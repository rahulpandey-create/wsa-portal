<?php

namespace App\Http\Controllers;

use App\Models\JobPost;
use App\Http\Requests\StoreJobPostRequest;
use App\Http\Requests\UpdateJobPostRequest;
use Illuminate\Http\Request;
use App\Http\Resources\JobPostResource;

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

        // return JobPostResource::collection(
        //     $query->paginate($perPage)
// );

        return JobPostResource::collection($jobPosts);

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
    public function store(storeJobPostRequest $request)
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
        $jobPost = JobPost::create([
            ...$validated,
            'status' => 'pending',
        ]);
        return response()->json([
    'message' => 'Job created successfully',
    'data' => new JobPostResource($jobPost), // Load the user relationship
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

        return new JobPostResource($jobPost);
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
    public function update(UpdateJobPostRequest $request, JobPost $jobPost)
    {
        $validated = $request->validated();

        $jobPost->update($validated);

        return response()->json([
            'message' => 'Job updated successfully',
            'data' => new JobPostResource($jobPost)
        ]);
    }
    public function approve(JobPost $jobPost)
    {
        $jobPost->status = 'approved';
        $jobPost->save();

        return response()->json([
            'message' => 'Job approved successfully',
            'data' => new JobPostResource($jobPost) 
        ]);
    }

    public function reject(JobPost $jobPost)
    {
        $jobPost->status = 'rejected';
        $jobPost->save();

        return response()->json([
            'message' => 'Job rejected successfully',
            'data' => new JobPostResource($jobPost)
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
