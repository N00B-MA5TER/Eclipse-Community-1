<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\TeamMember;
use App\Models\TeamInvitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class TeamRegistrationController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:teams,name',
            'leader_name' => 'nullable|string|max:255',
            'members' => 'required|array|min:1|max:3',
            'members.*.email' => 'required|email',
            'members.*.name' => 'nullable|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 400);
        }

        $user = $request->user();

        // Point Break event ID = 6 (event_id=1 is Zero to Hackathon)
        $eventId = 6;

        // Check if user is already in a team FOR THIS SPECIFIC EVENT
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
        
        $team = Team::create([
            'event_id' => $eventId,
            'name' => $request->name,
            'code' => Str::upper(Str::random(6)),
            'leader_id' => $user->id,
            'max_members' => count($request->members) + 1,
        ]);

        // Add leader
        TeamMember::create([
            'team_id' => $team->id,
            'user_id' => $user->id,
            'role' => 'leader'
        ]);

        // Create invites
        foreach($request->members as $memberData) {
            $invite = TeamInvitation::create([
                'team_id' => $team->id,
                'email' => $memberData['email'],
                'status' => 'pending'
            ]);
            
            // Broadcast event for real-time notification
            event(new \App\Events\TeamInviteReceived($invite));
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
        $user = $request->user();
        $invites = TeamInvitation::with('team')->where('email', $user->email)->where('status', 'pending')->get();
        return response()->json(['invites' => $invites]);
    }

    public function acceptInvite(Request $request, $id)
    {
        $user = $request->user();
        $invite = TeamInvitation::where('id', $id)->where('email', $user->email)->where('status', 'pending')->first();

        if (!$invite) {
            return response()->json(['error' => 'Invite not found or already processed.'], 404);
        }

        if (TeamMember::where('user_id', $user->id)->exists()) {
            return response()->json(['error' => 'You are already in a team.'], 400);
        }

        $invite->status = 'accepted';
        $invite->save();

        TeamMember::create([
            'team_id' => $invite->team_id,
            'user_id' => $user->id,
            'role' => 'member'
        ]);

        $team = Team::find($invite->team_id);
        $memberCount = TeamMember::where('team_id', $team->id)->count();
        $isComplete = $memberCount >= $team->max_members;

        if ($isComplete) {
            $members = TeamMember::with('user')->where('team_id', $team->id)->get();
            foreach ($members as $m) {
                if ($m->user && $m->user->email) {
                    event(new \App\Events\TeamCompletedEvent($m->user->email, $team));
                }
            }
        }

        return response()->json([
            'message' => 'Invite accepted!',
            'team_completed' => $isComplete
        ]);
    }
    
    public function rejectInvite(Request $request, $id)
    {
        $user = $request->user();
        $invite = TeamInvitation::where('id', $id)->where('email', $user->email)->where('status', 'pending')->first();

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
                     ->where('event_id', 6)
                     ->orderBy('created_at', 'desc')
                     ->get();

        // Let's also fetch invitations so admin can see pending invites
        $invitations = TeamInvitation::whereIn('team_id', $teams->pluck('id'))->get();

        $teamsArray = $teams->map(function ($team) use ($invitations) {
            $teamInvites = $invitations->where('team_id', $team->id);
            return [
                'id' => $team->id,
                'name' => $team->name,
                'max_members' => $team->max_members,
                'leader' => $team->leader ? clone $team->leader : null,
                'members' => $team->teamMembers->map(function ($member) {
                    return [
                        'user' => $member->user,
                        'role' => $member->role,
                        'status' => 'registered'
                    ];
                }),
                'pending_invites' => $teamInvites->filter(fn($i) => $i->status === 'pending')->map(function ($invite) {
                    return [
                        'email' => $invite->email,
                        'status' => 'pending'
                    ];
                })->values()
            ];
        });

        return response()->json(['teams' => $teamsArray]);
    }
}
