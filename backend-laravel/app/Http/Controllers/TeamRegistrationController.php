<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\TeamMember;
use App\Models\TeamInvitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class TeamRegistrationController extends Controller
{
    // Point Break event ID = 6 (event_id=1 is Zero to Hackathon)
    private const POINT_BREAK_EVENT_ID = 6;

    public function register(Request $request)
    {
        $eventId = self::POINT_BREAK_EVENT_ID;

        $validator = Validator::make($request->all(), [
            'name'           => [
                'required', 'string', 'max:255',
                // Unique only within this event (teams from other events don't conflict)
                Rule::unique('teams', 'name')->where('event_id', $eventId),
            ],
            'leader_name'     => 'nullable|string|max:255',
            'members'         => 'nullable|array|max:3',
            'members.*.email' => 'required_with:members|email',
            'members.*.name'  => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 400);
        }

        $user = $request->user();

        // Check if user is already in a team FOR THIS SPECIFIC EVENT only
        $alreadyInTeam = TeamMember::whereHas('team', function ($q) use ($eventId) {
            $q->where('event_id', $eventId);
        })->where('user_id', $user->id)->exists();

        if ($alreadyInTeam) {
            return response()->json(['error' => 'You are already in a team for this event.'], 400);
        }

        if ($request->leader_name) {
            $user->name = $request->leader_name;
            $user->save();
        }

        $members = $request->members ?? [];

        $team = Team::create([
            'event_id'    => $eventId,
            'name'        => $request->name,
            'code'        => Str::upper(Str::random(6)),
            'leader_id'   => $user->id,
            'max_members' => count($members) + 1,
        ]);

        // Add leader as a team member
        TeamMember::create([
            'team_id' => $team->id,
            'user_id' => $user->id,
            'role'    => 'leader',
        ]);

        // Create invites for each additional member
        foreach ($members as $memberData) {
            $invite = TeamInvitation::create([
                'team_id' => $team->id,
                'email'   => $memberData['email'],
                'status'  => 'pending',
            ]);

            // Broadcast best-effort — don't crash if Pusher/Soketi is unavailable
            try {
                event(new \App\Events\TeamInviteReceived($invite));
            } catch (\Exception $e) {
                Log::warning('Broadcasting failed (TeamInviteReceived): ' . $e->getMessage());
            }
        }

        return response()->json(['message' => 'Team created and invites sent successfully!']);
    }

    public function deleteTeam(Request $request, $id)
    {
        $user = $request->user();
        $team = Team::findOrFail($id);

        if ($team->leader_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized. Only the leader can delete the team.'], 403);
        }

        $team->delete();
        return response()->json(['message' => 'Team deleted successfully!']);
    }

    public function getInvites(Request $request)
    {
        $user    = $request->user();
        $invites = TeamInvitation::with('team')
            ->where('email', $user->email)
            ->where('status', 'pending')
            ->get();
        return response()->json(['invites' => $invites]);
    }

    public function acceptInvite(Request $request, $id)
    {
        $user   = $request->user();
        $invite = TeamInvitation::where('id', $id)
            ->where('email', $user->email)
            ->where('status', 'pending')
            ->first();

        if (!$invite) {
            return response()->json(['error' => 'Invite not found or already processed.'], 404);
        }

        // Scope duplicate check to this event
        $alreadyInTeam = TeamMember::whereHas('team', function ($q) {
            $q->where('event_id', self::POINT_BREAK_EVENT_ID);
        })->where('user_id', $user->id)->exists();

        if ($alreadyInTeam) {
            return response()->json(['error' => 'You are already in a team for this event.'], 400);
        }

        $invite->status = 'accepted';
        $invite->save();

        TeamMember::create([
            'team_id' => $invite->team_id,
            'user_id' => $user->id,
            'role'    => 'member',
        ]);

        $team        = Team::find($invite->team_id);
        $memberCount = TeamMember::where('team_id', $team->id)->count();
        $isComplete  = $memberCount >= $team->max_members;

        if ($isComplete) {
            $members = TeamMember::with('user')->where('team_id', $team->id)->get();
            foreach ($members as $m) {
                if ($m->user && $m->user->email) {
                    // Broadcast best-effort — don't crash if Pusher/Soketi is unavailable
                    try {
                        event(new \App\Events\TeamCompletedEvent($m->user->email, $team));
                    } catch (\Exception $e) {
                        Log::warning('Broadcasting failed (TeamCompletedEvent): ' . $e->getMessage());
                    }
                }
            }
        }

        return response()->json([
            'message'        => 'Invite accepted!',
            'team_completed' => $isComplete,
        ]);
    }

    public function rejectInvite(Request $request, $id)
    {
        $user   = $request->user();
        $invite = TeamInvitation::where('id', $id)
            ->where('email', $user->email)
            ->where('status', 'pending')
            ->first();

        if (!$invite) {
            return response()->json(['error' => 'Invite not found or already processed.'], 404);
        }

        $invite->status = 'rejected';
        $invite->save();

        return response()->json(['message' => 'Invite rejected!']);
    }

    public function getAdminTeams(Request $request)
    {
        // Event ID 6 is Point Break (event_id=1 is Zero to Hackathon)
        $teams = Team::with(['leader', 'teamMembers.user', 'joinRequests'])
            ->where('event_id', self::POINT_BREAK_EVENT_ID)
            ->orderBy('created_at', 'desc')
            ->get();

        $invitations = TeamInvitation::whereIn('team_id', $teams->pluck('id'))->get();

        $teamsArray = $teams->map(function ($team) use ($invitations) {
            $teamInvites = $invitations->where('team_id', $team->id);
            return [
                'id'          => $team->id,
                'name'        => $team->name,
                'max_members' => $team->max_members,
                'leader'      => $team->leader ? clone $team->leader : null,
                'members'     => $team->teamMembers->map(function ($member) {
                    return [
                        'user'   => $member->user,
                        'role'   => $member->role,
                        'status' => 'registered',
                    ];
                }),
                'pending_invites' => $teamInvites
                    ->filter(fn($i) => $i->status === 'pending')
                    ->map(fn($invite) => ['email' => $invite->email, 'status' => 'pending'])
                    ->values(),
            ];
        });

        return response()->json(['teams' => $teamsArray]);
    }
}
