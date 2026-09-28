<?php

namespace App\Http\Controllers;

use App\Models\Membership;
use Illuminate\Http\Request;

class MembershipController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'department' => 'required|string|max:255',
            'student_id' => 'required|string|max:255',
            'year_semester' => 'required|string|max:255',
            'linkedin_url' => 'required|url|max:255',
            'github_url' => 'nullable|url|max:255',
        ]);

        $existing = Membership::where('user_id', $request->user()->id)
            ->whereIn('status', ['pending', 'approved'])
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'You already have a membership application.'
            ], 409);
        }

        $validated['status'] = 'pending';
        $validated['user_id'] = $request->user()->id;
        $membership = Membership::create($validated);

        // Generate ID immediately on submission as per flow
        $membership_id = 'ECL-' . date('Y') . '-' . str_pad($membership->id, 4, '0', STR_PAD_LEFT);
        $membership->update(['membership_id' => $membership_id]);

        return response()->json([
            'message' => 'Membership application submitted successfully.',
            'membership' => $membership
        ], 201);
    }

    public function myMembership(Request $request)
    {
        $membership = Membership::where('user_id', $request->user()->id)->first();
        if (!$membership) {
            return response()->json(['message' => 'No membership found.'], 404);
        }
        return response()->json($membership);
    }

    public function index(Request $request)
    {
        $query = Membership::query();

        if ($request->has('status') && $request->status !== 'All') {
            $query->where('status', strtolower($request->status));
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('student_id', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('created_at', 'desc')->paginate($request->get('per_page', 15));
    }

    public function show($id)
    {
        $membership = Membership::findOrFail($id);
        return response()->json($membership);
    }

    public function approve($id)
    {
        $membership = Membership::findOrFail($id);
        
        $membership->update([
            'status' => 'approved'
        ]);

        return response()->json([
            'message' => 'Membership approved.',
            'membership' => $membership
        ]);
    }

    public function reject($id)
    {
        $membership = Membership::findOrFail($id);
        $membership->update(['status' => 'rejected']);

        return response()->json([
            'message' => 'Membership rejected.',
            'membership' => $membership
        ]);
    }

    public function destroy($id)
    {
        $membership = Membership::findOrFail($id);
        $membership->delete();

        return response()->json([
            'message' => 'Membership deleted successfully.'
        ]);
    }
}
