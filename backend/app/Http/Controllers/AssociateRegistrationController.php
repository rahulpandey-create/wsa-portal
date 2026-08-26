<?php

namespace App\Http\Controllers;

use App\Models\AssociateRegistration;
use App\Models\User;
use Illuminate\Http\Request;
use App\Mail\AssociateAccountSetupMail;
use App\Models\AssociateAccountSetupToken;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\DB;

class AssociateRegistrationController extends Controller
{
    /**
     * Validate an associate account setup token.
     */
    public function validateSetupToken(string $token)
    {
        $tokenHash = hash('sha256', $token);

        $setupToken = AssociateAccountSetupToken::where(
            'token_hash',
            $tokenHash
        )
            ->whereNull('used_at')
            ->where('expires_at', '>', now())
            ->with('registration')
            ->first();

        if (!$setupToken) {
            return response()->json([
                'message' => 'This account setup link is invalid or has expired.'
            ], 422);
        }

        return response()->json([
            'message' => 'Setup link is valid.',
            'registration' => [
                'representative_name' =>
                    $setupToken->registration->representative_name,

                'business_name' =>
                    $setupToken->registration->business_name,

                'email' =>
                    $setupToken->registration->email,
            ],
        ]);
    }

    /**
     * Create an associate account using a valid setup token.
     */
    public function createAccount(Request $request, string $token)
    {
        $validated = $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $tokenHash = hash('sha256', $token);

        $setupToken = AssociateAccountSetupToken::where(
            'token_hash',
            $tokenHash
        )
            ->whereNull('used_at')
            ->where('expires_at', '>', now())
            ->with('registration')
            ->first();

        if (!$setupToken) {
            return response()->json([
                'message' => 'This account setup link is invalid or has expired.'
            ], 422);
        }

        $registration = $setupToken->registration;

        if ($registration->status !== 'Approved') {
            return response()->json([
                'message' => 'This registration is not available for account setup.'
            ], 422);
        }

        if (User::where('email', $registration->email)->exists()) {
            return response()->json([
                'message' => 'An account with this email already exists.'
            ], 422);
        }

        $user = DB::transaction(function () use ($registration, $setupToken, $validated) {
            $user = User::create([
                'name' => $registration->representative_name,
                'company' => $registration->business_name,
                'country' => $registration->country,
                'email' => $registration->email,
                'password' => Hash::make($validated['password']),
                'role' => 'associate',
                'status' => 'active',
            ]);

            $registration->update([
                'status' => 'Active',
            ]);

            $setupToken->update([
                'used_at' => now(),
            ]);

            return $user;
        });

        return response()->json([
            'message' => 'Account created successfully. You can now log in.',
            'user' => $user,
        ], 201);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'business_name' => 'required|string|min:2|max:255',
            'representative_name' => 'required|string|min:3|max:255',
            'business_type' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:50',
            'website' => 'nullable|url|max:255',
            'business_description' => 'required|string|min:10',
            'referral_source' => 'required|string|max:255',
            'declaration' => 'required|accepted',
        ]);

        // Do not allow an application if this email
        // already belongs to an existing account.
        if (User::where('email', $validated['email'])->exists()) {
            return response()->json([
                'message' => 'An account with this email already exists.'
            ], 422);
        }

        // Prevent duplicate pending applications.
        $pendingRegistration = AssociateRegistration::where(
            'email',
            $validated['email']
        )
            ->where('status', 'Pending')
            ->exists();

        if ($pendingRegistration) {
            return response()->json([
                'message' => 'A registration with this email is already under review.'
            ], 422);
        }

        $registration = AssociateRegistration::create([
            ...$validated,
            'status' => 'Pending',
        ]);

        return response()->json([
            'message' => 'Registration submitted successfully.',
            'registration' => $registration,
        ], 201);
    }

    /**
     * Get associate registrations for the admin dashboard.
     *
     * Optional:
     * ?status=Pending
     * ?status=Approved
     * ?status=Rejected
     * ?status=Active
     */
    public function index(Request $request)
    {
        $query = AssociateRegistration::query();

        if ($request->filled('status')) {
            $validated = $request->validate([
                'status' => 'required|in:Pending,Approved,Rejected,Active',
            ]);

            $query->where('status', $validated['status']);
        }

        $registrations = $query
            ->latest()
            ->get();

        $counts = [
            'Pending' => AssociateRegistration::where('status', 'Pending')->count(),
            'Approved' => AssociateRegistration::where('status', 'Approved')->count(),
            'Rejected' => AssociateRegistration::where('status', 'Rejected')->count(),
            'Active' => AssociateRegistration::where('status', 'Active')->count(),
        ];

        return response()->json([
            'registrations' => $registrations,
            'counts' => $counts,
        ]);
    }

    /**
     * Approve an associate registration.
     *
     * Account creation and activation email
     * will be added in the next step.
     */
    /**
     * Approve an associate registration.
     */
    public function approve(AssociateRegistration $registration)
    {
        if ($registration->status !== 'Pending') {
            return response()->json([
                'message' => 'Only pending registrations can be approved.'
            ], 422);
        }

        if (User::where('email', $registration->email)->exists()) {
            return response()->json([
                'message' => 'An account with this email already exists.'
            ], 422);
        }

        $user = User::create([
            'name' => $registration->representative_name,
            'email' => $registration->email,
            'role' => 'associate',
            'company' => $registration->business_name,
            'country' => $registration->country,
            'status' => 'active',
            'password' => null,
        ]);

        $registration->update([
            'status' => 'Approved',
        ]);

        // Generate a secure random token.
        $rawToken = Str::random(64);

        // Store only the hash of the token.
        AssociateAccountSetupToken::create([
            'associate_registration_id' => $registration->id,
            'token_hash' => hash('sha256', $rawToken),
            'expires_at' => now()->addHours(48),
        ]);

        // Build the frontend account setup URL.
        $setupUrl =
            rtrim(env('FRONTEND_URL'), '/') .
            '/associate-account-setup?token=' .
            urlencode($rawToken);

        // Send account setup email.

        try {
            Mail::to($registration->email)->send(
                new AssociateAccountSetupMail(
                    $setupUrl,
                    $registration->representative_name
                )
            );
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Registration approved, but the account setup email could not be sent.',
                'registration' => $registration->fresh(),
            ], 200);
        }
        return response()->json([
            'message' => 'Registration approved successfully.',
            'registration' => $registration->fresh(),
        ]);
    }

    /**
     * Reject an associate registration.
     */
    public function reject(AssociateRegistration $registration)
    {
        if ($registration->status !== 'Pending') {
            return response()->json([
                'message' => 'Only pending registrations can be rejected.'
            ], 422);
        }

        $registration->update([
            'status' => 'Rejected',
        ]);

        return response()->json([
            'message' => 'Registration rejected successfully.',
            'registration' => $registration->fresh(),
        ]);
    }

    public function setupAccount(Request $request)
    {
        $validated = $request->validate([
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $tokenHash = hash('sha256', $validated['token']);

        $setupToken = AssociateAccountSetupToken::where(
            'token_hash',
            $tokenHash
        )->first();

        if (!$setupToken) {
            return response()->json([
                'message' => 'Invalid account setup link.'
            ], 422);
        }

        if ($setupToken->used_at) {
            return response()->json([
                'message' => 'This account setup link has already been used.'
            ], 422);
        }

        if ($setupToken->expires_at->isPast()) {
            return response()->json([
                'message' => 'This account setup link has expired.'
            ], 422);
        }

        $registration = $setupToken->registration;

        if (!$registration) {
            return response()->json([
                'message' => 'Registration not found.'
            ], 404);
        }

        if ($registration->status !== 'Approved') {
            return response()->json([
                'message' => 'This registration is not available for account setup.'
            ], 422);
        }

        $user = User::where(
            'email',
            $registration->email
        )->first();

        if (!$user) {
            return response()->json([
                'message' => 'Associate account not found.'
            ], 404);
        }

        $user->update([
            'password' => $validated['password'],
        ]);

        $setupToken->update([
            'used_at' => now(),
        ]);

        $registration->update([
            'status' => 'Active',
        ]);

        return response()->json([
            'message' => 'Account setup completed successfully.'
        ]);
    }
}