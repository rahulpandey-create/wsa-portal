<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\JobPost;
use App\Models\CandidateApplication;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $jobStats = [
            'total' => JobPost::count(),
            'approved' => JobPost::where('status', 'approved')->count(),
            'pending' => JobPost::where('status', 'pending')->count(),
            'rejected' => JobPost::where('status', 'rejected')->count(),
        ];

        $applicationStats = [
            'total' => CandidateApplication::count(),
            'pending' => CandidateApplication::where('status', 'pending')->count(),
            'shortlisted' => CandidateApplication::where('status', 'shortlisted')->count(),
            'interview_scheduled' => CandidateApplication::where('status', 'interview_scheduled')->count(),
            'interviewed' => CandidateApplication::where('status', 'interviewed')->count(),
            'offered' => CandidateApplication::where('status', 'offered')->count(),
            'hired' => CandidateApplication::where('status', 'hired')->count(),
            'rejected' => CandidateApplication::where('status', 'rejected')->count(),
        ];
        $userStats = [
            'total' => User::count(),
            'admins' => User::where('role', 'admin')->count(),
            'associates' => User::where('role', 'associate')->count(),
        ];

        return response()->json([
            'jobs' => $jobStats,
            'applications' => $applicationStats,
            'users' => $userStats,
        ]);
    }
}
