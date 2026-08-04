<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthenticationController;
use App\Http\Controllers\JobPostController;

Route::post('register', [AuthenticationController::class, 'register']);
Route::post('login', [AuthenticationController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
Route::get('user', [AuthenticationController::class, 'userInfo']);
Route::post('logout', [AuthenticationController::class, 'logOut']);
Route::apiResource('job-posts', JobPostController::class);
});
Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});
