<?php

use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthenticationController;
use App\Http\Controllers\JobPostController;
use App\Http\Controllers\CandidateApplicationController;
use App\Http\Controllers\NotificationController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\AssociateRegistrationController;


// Route::post('register', [AuthenticationController::class, 'register']);
Route::post('login', [AuthenticationController::class, 'login']);
Route::post('associate-registrations', [AssociateRegistrationController::class, 'store']);

Route::post('/setup-admin', function (Request $request) {
    $request->validate([
        'secret' => 'required|string',
        'name' => 'required|string',
        'email' => 'required|email',
        'password' => 'required|string|min:8',
    ]);

    if ($request->secret !== env('ADMIN_SETUP_SECRET')) {
        return response()->json([
            'message' => 'Unauthorized'
        ], 403);
    }

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => $request->password,
        'role' => 'admin',
    ]);

    return response()->json([
        'message' => 'Admin created successfully',
        'user' => $user,
    ], 201);
});

Route::get('/email/verify/{id}/{hash}', function (Request $request, $id, $hash) {

    $user = User::findOrFail($id);

    if (
        !hash_equals(
            sha1($user->getEmailForVerification()),
            $hash
        )
    ) {
        return response()->json([
            'message' => 'Invalid verification link'
        ], 403);
    }

    if (!$user->hasVerifiedEmail()) {
        $user->markEmailAsVerified();
    }

    return redirect(
        env('FRONTEND_URL') . '/email-verified'
    );

})->middleware('signed')
    ->name('verification.verify');
Route::post('/email/verification-notification', function (Request $request) {

    if ($request->user()->hasVerifiedEmail()) {
        return response()->json([
            'message' => 'Email already verified.'
        ]);
    }

    $request->user()->sendEmailVerificationNotification();

    return response()->json([
        'message' => 'Verification email sent.'
    ]);

})->middleware(['auth:sanctum']);

Route::get(
    '/associate-account/{token}',
    [AssociateRegistrationController::class, 'validateSetupToken']
);

Route::post(
    '/associate-account/{token}',
    [AssociateRegistrationController::class, 'createAccount']
);

Route::post(
    'associate-account-setup',
    [AssociateRegistrationController::class, 'setupAccount']
);

Route::middleware(['auth:sanctum'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Authenticated Routes
    |--------------------------------------------------------------------------
    */

    Route::get(
        'notifications',
        [NotificationController::class, 'index']
    );

    Route::patch(
        'notifications/read-all',
        [NotificationController::class, 'markAllAsRead']
    );

    Route::patch(
        'notifications/{notification}/read',
        [NotificationController::class, 'markAsRead']
    );

    Route::get('my-jobs', [JobPostController::class, 'myJobs']);

    Route::get('user', [AuthenticationController::class, 'userInfo']);

    Route::post('logout', [AuthenticationController::class, 'logOut']);


    /*
    |--------------------------------------------------------------------------
    | Job Routes
    |--------------------------------------------------------------------------
    */

    // Admin + Associate can view jobs
    Route::get('job-posts', [JobPostController::class, 'index']);

    // Admin + Associate can create/submit jobs
    Route::post('job-posts', [JobPostController::class, 'store']);

    Route::get(
        'job-posts/{jobPost}',
        [JobPostController::class, 'show']
    );


    /*
    |--------------------------------------------------------------------------
    | Candidate Application Routes
    |--------------------------------------------------------------------------
    */

    Route::post(
        'candidate-applications',
        [CandidateApplicationController::class, 'store']
    );

    Route::get(
        'candidate-applications',
        [CandidateApplicationController::class, 'index']
    );

    Route::get(
        'candidate-applications/{candidateApplication}',
        [CandidateApplicationController::class, 'show']
    );


    /*
    |--------------------------------------------------------------------------
    | ADMIN ONLY ROUTES
    |--------------------------------------------------------------------------
    */

    Route::middleware('admin')->group(function () {

        /*
    |--------------------------------------------------------------------------
    | Associate Registration Administration
    |--------------------------------------------------------------------------
    */

        Route::get(
            'associate-registrations',
            [AssociateRegistrationController::class, 'index']
        );

        Route::patch(
            'associate-registrations/{registration}/approve',
            [AssociateRegistrationController::class, 'approve']
        );

        Route::patch(
            'associate-registrations/{registration}/reject',
            [AssociateRegistrationController::class, 'reject']
        );

        /*
        |--------------------------------------------------------------------------
        | Job Administration
        |--------------------------------------------------------------------------
        */

        Route::put(
            'associates/{user}',
            function (Request $request, User $user) {
                if ($user->role !== 'associate') {
                    return response()->json([
                        'message' => 'User is not an associate.'
                    ], 422);
                }

                $validated = $request->validate([
                    'name' => 'required|string|min:3|max:255',
                    'company' => 'nullable|string|max:255',
                    'country' => 'nullable|string|max:255',
                    'status' => 'required|string|in:Active,Inactive',
                ]);

                $user->update($validated);

                return response()->json([
                    'message' => 'Associate updated successfully.',
                    'associate' => $user->fresh(),
                ]);
            }
        );

        Route::post(
            'job-posts/upload',
            [JobPostController::class, 'upload']
        );

        Route::post(
            'job-posts/sponsored',
            [JobPostController::class, 'createSponsored']
        );

        Route::get('associates', function () {
            return response()->json(
                User::where('role', 'associate')
                    ->withCount([
                        'jobPosts',
                        'candidateApplications',
                    ])
                    ->get()
            );
        });

        Route::patch(
            'job-posts/{jobPost}/approve',
            [JobPostController::class, 'approve']
        );

        Route::patch(
            'job-posts/{jobPost}/reject',
            [JobPostController::class, 'reject']
        );

        Route::put(
            'job-posts/{jobPost}',
            [JobPostController::class, 'update']
        );

        Route::delete(
            'job-posts/{jobPost}',
            [JobPostController::class, 'destroy']
        );

        /*
        |--------------------------------------------------------------------------
        | Candidate Application Administration
        |--------------------------------------------------------------------------
        */

        Route::put(
            'candidate-applications/{candidateApplication}',
            [CandidateApplicationController::class, 'update']
        );

        Route::delete(
            'candidate-applications/{candidateApplication}',
            [CandidateApplicationController::class, 'destroy']
        );

        Route::patch(
            'candidate-applications/{candidateApplication}/select',
            [CandidateApplicationController::class, 'select']
        );

        Route::patch(
            'candidate-applications/{candidateApplication}/reject',
            [CandidateApplicationController::class, 'reject']
        );

        Route::get(
            'candidate-applications/{candidateApplication}/resume',
            [CandidateApplicationController::class, 'downloadResume']
        );

        Route::patch(
            'candidate-applications/{candidateApplication}/status',
            [CandidateApplicationController::class, 'updateStatus']
        );


        /*
        |--------------------------------------------------------------------------
        | Admin Dashboard
        |--------------------------------------------------------------------------
        */

        Route::get(
            'dashboard',
            [DashboardController::class, 'index']
        );
    });
});


/*
|--------------------------------------------------------------------------
| API Test Route
|--------------------------------------------------------------------------
*/

Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working'
    ]);
});