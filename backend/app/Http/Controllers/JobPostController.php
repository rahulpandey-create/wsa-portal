<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\JobSubmittedNotification;
use App\Notifications\NewJobNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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
        if ($request->user()->role === 'admin') {
            $jobPosts = JobPost::all();
        } else {
            $jobPosts = JobPost::where('status', 'approved')->get();
        }

        return JobPostResource::collection($jobPosts);
    }

    public function myJobs(Request $request)
    {
        $jobs = JobPost::where(
            'user_id',
            $request->user()->id
        )
            ->latest()
            ->get();

        return response()->json([
            'data' => $jobs,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    public function createSponsored(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Only administrators can create sponsored jobs.'
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'location' => 'required|string|max:255',
            'visa' => 'required|string|max:255',
            'salary' => 'nullable|string|max:255',
            'job_type' => 'required|string|max:100',
            'positions' => 'required|integer|min:1',
            'experience' => 'nullable|string|max:255',
            'qualifications' => 'nullable|string|max:255',
            'description' => 'required|string',
            'requirements' => 'required|string',
            'contact_email' => 'nullable|email|max:255',
        ]);

        $jobPost = JobPost::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'status' => 'approved',
            'is_sponsored' => true,
        ]);

        $this->notifyAssociatesAboutLiveJob($jobPost);

        return response()->json([
            'message' => 'Sponsored job created successfully.',
            'data' => new JobPostResource($jobPost),
        ], 201);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreJobPostRequest $request)
    {
       $validated = $request->validated();

        $jobPost = JobPost::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'status' => 'pending',
        ]);

        // Notify all admins about the new job submission
        $admins = User::where('role', 'admin')->get();

        foreach ($admins as $admin) {
            $admin->notify(
                new JobSubmittedNotification($jobPost)
            );
        }

        return response()->json([
            'message' => 'Job created successfully',
            'data' => new JobPostResource($jobPost),
        ], 201);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,xlsx,xls|max:5120',
        ]);

        $file = $request->file('file');

        $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load(
            $file->getPathname()
        );

        $sheet = $spreadsheet->getActiveSheet();

        $rows = $sheet->toArray();

        if (count($rows) < 2) {
            return response()->json([
                'message' => 'The uploaded file contains no job records.'
            ], 422);
        }

        $headers = array_map(
            fn($header) => strtolower(trim($header)),
            $rows[0]
        );

        $requiredHeaders = [
            'title',
            'location',
            'visa',
            'job_type',
            'positions',
            'description',
            'requirements',
            'contact_email',
        ];

        foreach ($requiredHeaders as $header) {
            if (!in_array($header, $headers)) {
                return response()->json([
                    'message' => "Missing required column: {$header}"
                ], 422);
            }
        }

        $created = [];

        foreach (array_slice($rows, 1) as $row) {
            $data = array_combine($headers, $row);

            if (
                empty($data['title']) ||
                empty($data['location']) ||
                empty($data['visa']) ||
                empty($data['job_type']) ||
                empty($data['positions']) ||
                empty($data['description']) ||
                empty($data['requirements']) ||
                empty($data['contact_email'])
            ) {
                continue;
            }

            $jobPost = JobPost::create([
                'title' => $data['title'],
                'company' => $data['company'] ?? null,
                'location' => $data['location'],
                'visa' => $data['visa'],
                'salary' => !empty($data['salary']) ? $data['salary'] : null,
                'job_type' => $data['job_type'],
                'positions' => $data['positions'],
                'experience' => !empty($data['experience'])
                    ? $data['experience']
                    : null,
                'qualifications' => !empty($data['qualifications'])
                    ? $data['qualifications']
                    : null,
                'description' => $data['description'],
                'requirements' => $data['requirements'],
                'contact_email' => $data['contact_email'],
                'status' => 'pending',
            ]);

            $admins = User::where('role', 'admin')->get();

            foreach ($admins as $admin) {
                $admin->notify(
                    new JobSubmittedNotification($jobPost)
                );
            }

            $created[] = $jobPost;
        }

        return response()->json([
            'message' => count($created) . ' jobs uploaded successfully.',
            'data' => JobPostResource::collection($created),
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
    public function update(
        UpdateJobPostRequest $request,
        JobPost $jobPost
    ) {
        $validated = $request->validated();

        $jobPost->update($validated);

        return response()->json([
            'message' => 'Job updated successfully',
            'data' => new JobPostResource($jobPost)
        ]);
    }

    public function approve(JobPost $jobPost)
    {
        DB::transaction(function () use ($jobPost) {
            $jobPost->status = 'approved';
            $jobPost->save();
        });

        $this->notifyAssociatesAboutLiveJob($jobPost->fresh());

        return response()->json([
            'message' => 'Job approved successfully',
            'data' => new JobPostResource($jobPost->fresh()),
        ]);
    }

    private function notifyAssociatesAboutLiveJob(JobPost $jobPost): void
    {
        User::where('role', 'associate')
            ->each(function (User $associate) use ($jobPost) {
                try {
                    $associate->notify(
                        new NewJobNotification($jobPost)
                    );
                } catch (\Throwable $exception) {
                    Log::error(
                        'Failed to notify associate about live job.',
                        [
                            'job_id' => $jobPost->id,
                            'associate_id' => $associate->id,
                            'associate_email' => $associate->email,
                            'exception' => get_class($exception),
                            'message' => $exception->getMessage(),
                        ]
                    );
                }
            });
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