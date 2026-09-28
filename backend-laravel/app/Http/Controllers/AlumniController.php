<?php

namespace App\Http\Controllers;

use App\Models\Alumni;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class AlumniController extends Controller
{
    public function index(Request $request)
    {
        $alumnis = Alumni::where('status', 'approved')
            ->orderBy('graduation_year', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        // Map the results to hide any internal data and format the photo URL
        $alumnis->getCollection()->transform(function ($alumni) {
            return [
                'id' => (string) $alumni->id,
                'photo_url' => $alumni->photo ? Storage::url($alumni->photo) : null,
                'name' => $alumni->name,
                'department' => $alumni->department,
                'graduation_year' => $alumni->graduation_year,
                'current_role' => $alumni->current_role,
                'linkedin_url' => $alumni->linkedin_url,
            ];
        });

        return response()->json($alumnis, 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'photo' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
            'name' => 'required|string|max:100',
            'department' => 'required|string|max:150',
            'graduation_year' => 'required|integer|min:1950|max:2100',
            'current_role' => 'required|string|max:150',
            'linkedin_url' => 'required|url|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $photoPath = $request->file('photo')->store('alumni', 'public');

        try {
            $alumni = Alumni::create([
                'photo' => $photoPath,
                'name' => $request->name,
                'department' => $request->department,
                'graduation_year' => $request->graduation_year,
                'current_role' => $request->current_role,
                'linkedin_url' => $request->linkedin_url,
                'status' => 'pending',
            ]);
        } catch (\Throwable $e) {
            Storage::disk('public')->delete($photoPath);
            \Illuminate\Support\Facades\Log::error('Alumni Registration Failed: ' . $e->getMessage());
            
            return response()->json([
                'error' => 'Unable to register alumni at this time.'
            ], 500);
        }

        return response()->json([
            'message' => 'Your alumni profile has been submitted and is pending approval.',
            'alumni_id' => (string) $alumni->id
        ], 201);
    }
}
