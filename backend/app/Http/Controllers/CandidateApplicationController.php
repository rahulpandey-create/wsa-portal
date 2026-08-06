<?php

namespace App\Http\Controllers;

use App\Models\CandidateApplication;
use Illuminate\Http\Request;

class CandidateApplicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->user()->role === 'admin') {

            $query = CandidateApplication::with(['user', 'jobPost']);

        } else {

            $query = CandidateApplication::with(['jobPost'])
                ->where('user_id', $request->user()->id);

        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('job_post_id')) {
            $query->where('job_post_id', $request->job_post_id);
        }

        if ($request->filled('candidate_name')) {
            $query->where(
                'candidate_name',
                'like',
                '%' . $request->candidate_name . '%'
            );
        }

        if ($request->filled('sort')) {

            switch ($request->sort) {

                case 'latest':
                    $query->latest();
                    break;

                case 'oldest':
                    $query->oldest();
                    break;

                case 'experience':
                    $query->orderBy('experience', 'desc');
                    break;

                case 'name':
                    $query->orderBy('candidate_name', 'asc');
                    break;

            }

            $request->validate([
                'sort' => 'nullable|in:latest,oldest,experience,name',
            ]);

        }

        if ($request->filled('experience')) {
            $query->where('experience', $request->experience);
        }

        $perPage = min($request->input('per_page', 10), 100);

        return response()->json(
            $query->paginate($perPage)
        );
        ;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'job_post_id' => 'required|exists:job_posts,id',
            'candidate_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'experience' => 'required|integer|min:0',
            'cover_letter' => 'nullable|string',
            'resume' => 'nullable|file|mimes:pdf,doc,docx|max:5120', // Optional resume upload
        ]);

        // Prevent duplicate application
        $alreadyApplied = CandidateApplication::where('user_id', $request->user()->id)
            ->where('job_post_id', $validated['job_post_id'])
            ->exists();

        if ($alreadyApplied) {
            return response()->json([
                'message' => 'You have already applied for this job.'
            ], 409);
        }
        $resumePath = null;

        if ($request->hasFile('resume')) {

            $resumePath = $request
                ->file('resume')
                ->store('resumes', 'public');

        }

        $application = CandidateApplication::create([
            'user_id' => $request->user()->id,
            'job_post_id' => $validated['job_post_id'],
            'candidate_name' => $validated['candidate_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'experience' => $validated['experience'],
            'cover_letter' => $validated['cover_letter'] ?? null,
            'resume' => $resumePath,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Application submitted successfully',
            'data' => $application
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, CandidateApplication $candidateApplication)
    {
        if (
            $request->user()->role !== 'admin' &&
            $candidateApplication->user_id !== $request->user()->id
        ) {
            return response()->json([
                'message' => 'Access Denied'
            ], 403);
        }

        return response()->json(
            $candidateApplication->load(['user', 'jobPost'])
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CandidateApplication $candidateApplication)
    {
        //
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CandidateApplication $candidateApplication)
    {
        $validated = $request->validate([
            'candidate_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255',
            'phone' => 'sometimes|string|max:20',
            'experience' => 'sometimes|integer|min:0',
            'cover_letter' => 'nullable|string',
        ]);

        $candidateApplication->update($validated);

        return response()->json([
            'message' => 'Application updated successfully',
            'data' => $candidateApplication
        ]);
    }

    public function select(CandidateApplication $candidateApplication)
    {
        if ($candidateApplication->status === 'selected') {
            return response()->json([
                'message' => 'Application is already selected'
            ], 400);
        }

        $candidateApplication->status = 'selected';
        $candidateApplication->save();

        return response()->json([
            'message' => 'Candidate selected successfully',
            'data' => $candidateApplication
        ]);
    }

    public function reject(CandidateApplication $candidateApplication)
    {
        if ($candidateApplication->status === 'rejected') {
            return response()->json([
                'message' => 'Application is already rejected'
            ], 400);
        }

        $candidateApplication->status = 'rejected';
        $candidateApplication->save();

        return response()->json([
            'message' => 'Candidate rejected successfully',
            'data' => $candidateApplication
        ]);
    }

    // public function updateStatus(Request $request, CandidateApplication $candidateApplication)
// {
//     $validated = $request->validate([
//         'status' => 'required|in:pending,shortlisted,interview_scheduled,interviewed,offered,hired,rejected',
//     ]);

    //     $currentStatus = $candidateApplication->status;
//     $newStatus = $validated['status'];

    //     // Allowed workflow
//     $workflow = [
//         'pending' => ['shortlisted', 'rejected'],
//         'shortlisted' => ['interview_scheduled', 'rejected'],
//         'interview_scheduled' => ['interviewed', 'rejected'],
//         'interviewed' => ['offered', 'rejected'],
//         'offered' => ['hired', 'rejected'],
//         'hired' => [],
//         'rejected' => [],
//     ];

    //     if (!in_array($newStatus, $workflow[$currentStatus])) {
//         return response()->json([
//             'message' => "Cannot change status from {$currentStatus} to {$newStatus}"
//         ], 400);
//     }

    //     $candidateApplication->status = $newStatus;
//     $candidateApplication->save();

    //     return response()->json([
//         'message' => 'Application status updated successfully',
//         'data' => $candidateApplication
//     ]);
// }

    /**
     * Remove the specified resource from storage.
     */
    // public function updateStatus(Request $request, CandidateApplication $candidateApplication)
    // {
    //     return response()->json($candidateApplication);
    // }

    // public function updateStatus(Request $request, CandidateApplication $candidateApplication)
    // {
    //     $validated = $request->validate([
    //         'status' => 'required|in:pending,shortlisted,interview_scheduled,interviewed,offered,hired,rejected',
    //     ]);

    //     return response()->json([
    //         'current_status' => $candidateApplication->status,
    //         'new_status' => $validated['status'],
    //     ]);
    // }

    // public function updateStatus(Request $request, CandidateApplication $candidateApplication)
    // {
    //     $validated = $request->validate([
    //         'status' => 'required|in:pending,shortlisted,interview_scheduled,interviewed,offered,hired,rejected',
    //     ]);

    //     $currentStatus = $candidateApplication->status;
    //     $newStatus = $validated['status'];

    //     $workflow = [
    //         'pending' => ['shortlisted', 'rejected'],
    //         'shortlisted' => ['interview_scheduled', 'rejected'],
    //         'interview_scheduled' => ['interviewed', 'rejected'],
    //         'interviewed' => ['offered', 'rejected'],
    //         'offered' => ['hired', 'rejected'],
    //         'hired' => [],
    //         'rejected' => [],
    //     ];

    //     return response()->json([
    //         'current_status' => $currentStatus,
    //         'allowed_next_statuses' => $workflow[$currentStatus],
    //         'requested_status' => $newStatus,
    //         'allowed' => in_array($newStatus, $workflow[$currentStatus]),
    //     ]);
    // }

    public function updateStatus(Request $request, CandidateApplication $candidateApplication)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,shortlisted,interview_scheduled,interviewed,offered,hired,rejected',
        ]);

        $candidateApplication->status = $validated['status'];
        $candidateApplication->save();

        return response()->json($candidateApplication->fresh());
    }

    public function downloadResume(CandidateApplication $candidateApplication)
    {
        if (!$candidateApplication->resume) {
            return response()->json([
                'message' => 'Resume not uploaded.'
            ], 404);
        }

        if (!Storage::disk('public')->exists($candidateApplication->resume)) {
            return response()->json([
                'message' => 'Resume file not found.'
            ], 404);
        }

        return Storage::disk('public')->download(
            $candidateApplication->resume
        );
    }
    public function destroy(CandidateApplication $candidateApplication)
    {
        $candidateApplication->delete();

        return response()->json([
            'message' => 'Application deleted successfully'
        ]);
    }
}
