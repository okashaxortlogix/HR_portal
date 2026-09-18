<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\AuditLog;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required',
            'password' => 'required',
        ]);

        $input = $request->input('email');
        $password = $request->input('password');

        // Look up by email or username
        $user = User::with('leaveBalances')
            ->where('email', $input)
            ->orWhere('username', $input)
            ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid email or username.'
            ], 401);
        }

        if (!Hash::check($password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid password credentials provided.'
            ], 401);
        }

        // Log login in audit trail
        AuditLog::create([
            'log_code' => 'AUD-' . rand(1000, 9999),
            'user_name' => $user->name,
            'action' => 'Logged into portal session',
            'module' => 'Authentication',
            'ip_address' => $request->ip() ?: '127.0.0.1',
        ]);

        return response()->json([
            'success' => true,
            'user' => $user->toPortalArray(),
            'message' => 'Login successful.'
        ]);
    }

    public function updateProfile(Request $request)
    {
        $userId = $request->input('id');
        $user = User::with('leaveBalances')->find($userId);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User account not found.'
            ], 404);
        }

        // Check if password change is requested
        if ($request->filled('newPassword')) {
            $currentPass = $request->input('currentPassword');
            if (!Hash::check($currentPass, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Current password does not match our security records.'
                ], 422);
            }
            $user->password = Hash::make($request->input('newPassword'));
        }

        // Update fields
        if ($request->has('name')) $user->name = $request->input('name');
        if ($request->has('username')) $user->username = $request->input('username');
        if ($request->has('email')) $user->email = $request->input('email');
        if ($request->has('bio')) $user->bio = $request->input('bio');
        if ($request->has('avatar')) $user->avatar = $request->input('avatar');
        if ($request->has('phone')) $user->phone = $request->input('phone');

        $user->save();

        AuditLog::create([
            'log_code' => 'AUD-' . rand(1000, 9999),
            'user_name' => $user->name,
            'action' => 'Updated personal account profile and security credentials',
            'module' => 'Profile & Security',
            'ip_address' => $request->ip() ?: '127.0.0.1',
        ]);

        return response()->json([
            'success' => true,
            'user' => $user->fresh('leaveBalances')->toPortalArray(),
            'message' => 'Account profile and settings updated successfully.'
        ]);
    }
}
