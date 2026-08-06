<?php

use Illuminate\Http\Request;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthenticationController;
use App\Http\Controllers\JobPostController;
use App\Http\Controllers\CandidateApplicationController;

Route::post('register', [AuthenticationController::class, 'register']);
Route::post('login', [AuthenticationController::class, 'login']);
Route::middleware(['auth:sanctum'])->group(function () {

    Route::get('user', [AuthenticationController::class, 'userInfo']);

    Route::post('logout', [AuthenticationController::class, 'logOut']);

    Route::get('job-posts', [JobPostController::class, 'index']);
    //     Route::get('job-posts', function () {
//     return response()->json([
//         'message' => 'ROUTE HIT'
//     ]);
// });
    Route::post('candidate-applications', [CandidateApplicationController::class, 'store']);

    Route::get('job-posts/{jobPost}', [JobPostController::class, 'show']);

    Route::get('candidate-applications', [CandidateApplicationController::class, 'index']);
    Route::get('candidate-applications/{candidateApplication}', [CandidateApplicationController::class, 'show']);
    Route::post('candidate-applications', [CandidateApplicationController::class, 'store']);

    Route::middleware('admin')->group(function () {
        Route::patch('job-posts/{jobPost}/approve', [JobPostController::class, 'approve']);
        Route::patch('job-posts/{jobPost}/reject', [JobPostController::class, 'reject']);
        Route::post('job-posts', [JobPostController::class, 'store']);
        Route::put('job-posts/{jobPost}', [JobPostController::class, 'update']);
        Route::delete('job-posts/{jobPost}', [JobPostController::class, 'destroy']);
        Route::put('candidate-applications/{candidateApplication}', [CandidateApplicationController::class, 'update']);
        Route::delete('candidate-applications/{candidateApplication}', [CandidateApplicationController::class, 'destroy']);
        Route::patch('candidate-applications/{candidateApplication}/select', [CandidateApplicationController::class, 'select']);
        Route::patch('candidate-applications/{candidateApplication}/reject', [CandidateApplicationController::class, 'reject']);
        Route::put(
            'candidate-applications/{candidateApplication}',
            [CandidateApplicationController::class, 'update']
        );

        Route::delete(
            'candidate-applications/{candidateApplication}',
            [CandidateApplicationController::class, 'destroy']
        );

        // Route::patch(
        //     'candidate-applications/{candidateApplication}/select',
        //     [CandidateApplicationController::class, 'select']);

        // Route::patch(
        //     'candidate-applications/{candidateApplication}/reject',
        //     [CandidateApplicationController::class, 'reject']);
        Route::get(
            'candidate-applications/{candidateApplication}/resume',
            [CandidateApplicationController::class, 'downloadResume']
        );
        Route::patch(
            'candidate-applications/{candidateApplication}/status',
            [CandidateApplicationController::class, 'updateStatus']

        );
        Route::get('dashboard', [DashboardController::class, 'index']);
    });

});
Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});