<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthenticationController;
use App\Http\Controllers\JobPostController;

Route::post('register', [AuthenticationController::class, 'register']);
Route::post('login', [AuthenticationController::class, 'login']);
Route::middleware(['auth:sanctum'])->group(function () {

    Route::get('user', [AuthenticationController::class, 'userInfo']);

    Route::post('logout', [AuthenticationController::class, 'logOut']);

    Route::middleware('admin')->group(function () {

        Route::get('job-posts', [JobPostController::class, 'index']);
        Route::get('job-posts/{jobPost}', [JobPostController::class, 'show']);
        Route::post('job-posts', [JobPostController::class, 'store']);
        Route::put('job-posts/{jobPost}', [JobPostController::class, 'update']);
        Route::delete('job-posts/{jobPost}', [JobPostController::class, 'destroy']);

    });

});
Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});
