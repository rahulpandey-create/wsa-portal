<?php

namespace App\Http\Controllers;

use App\Models\JobPost;
use Illuminate\Http\Request;

class JobPostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
{
    // dd("INDEX HIT");

    // dd($request->user()->role);

    if ($request->user()->role === 'admin') {
        $jobPosts = JobPost::all();
    } else {
        $jobPosts = JobPost::where('status', 'approved')->get();
    }

    return response()->json($jobPosts);
    
    // return response()->json($request->user());

    //  return response()->json([
    //     'controller' => __FILE__,
    //     'method' => __METHOD__,
    // ]);

    //  return response()->json([
    //     'user' => $request->user(),
    //     'role' => $request->user()->role
    // ]);

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
            'title' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'salary' => 'nullable|numeric',
            'job_type' => 'required|string|max:100',
            'description' => 'required|string',
            // 'status' => 'nullable|in:pending,approved,rejected',
    ]);

    // $job = \App\Models\JobPost::create($validated);
        $job = JobPost::create([
        ...$validated,
        'status' => 'pending',
    ]);
    return response()->json([
        'message' => 'Job created successfully',
        'data' => $job
    ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, JobPost $jobPost)
{
    if (
        $request->user()->role !== 'admin' &&
        $jobPost->status !== 'approved'
    ) {
        return response()->json([
            'message' => 'Access Denied'
        ], 403);
    }

    return response()->json($jobPost);
}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(JobPost $jobPost)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, JobPost $jobPost)
    {
         $validated = $request->validate([
        'title' => 'sometimes|string|max:255',
        'company' => 'sometimes|string|max:255',
        'location' => 'sometimes|string|max:255',
        'salary' => 'nullable|numeric',
        'job_type' => 'sometimes|string|max:100',
        'description' => 'sometimes|string',
        'status' => 'sometimes|in:pending,approved,rejected',
    ]);

    $jobPost->update($validated);

    return response()->json([
        'message' => 'Job updated successfully',
        'data' => $jobPost
    ]);
    }
        public function approve(JobPost $jobPost)
{
    $jobPost->status = 'approved';
    $jobPost->save();

    return response()->json([
        'message' => 'Job approved successfully',
        'data' => $jobPost
    ]);
}

public function reject(JobPost $jobPost)
{
    $jobPost->status = 'rejected';
    $jobPost->save();

    return response()->json([
        'message' => 'Job rejected successfully',
        'data' => $jobPost
    ]);
}


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JobPost $jobPost)
    {
        $jobPost->delete();

    return response()->json([
        'message' => 'Job deleted successfully'
    ]);
    }
}
