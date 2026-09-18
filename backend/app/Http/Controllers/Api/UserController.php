<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\LeaveBalance;
use App\Models\AuditLog;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('leaveBalances')->where('is_active', true)->get();
        return response()->json([
            'success' => true,
            'users' => $users->map(fn($u) => $u->toPortalArray())
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|string',
            'department' => 'required|string',
        ]);

        $roleKeyMap = [
            'Administrator' => 'admin',
            'HR Specialist' => 'hr',
            'HR Operations Specialist' => 'hr',
            'Team Lead' => 'team_lead',
            'Department Head' => 'department_head',
            'Intern' => 'intern',
            'Intern / Trainee' => 'intern',
            'intern' => 'intern',
            'Software Engineer' => 'employee',
            'Senior Engineer' => 'employee',
            'Employee' => 'employee',
        ];

        $role = $request->input('role');
        $roleKey = $request->input('roleKey') ?: ($roleKeyMap[$role] ?? 'employee');

        $user = User::create([
            'name' => $request->input('name'),
            'username' => $request->input('username') ?: strtolower(str_replace(' ', '.', $request->input('name'))),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password') ?: 'pass123'),
            'role' => $role,
            'role_key' => $roleKey,
            'department' => $request->input('department'),
            'team' => $request->input('team') ?: 'General Team',
            'avatar' => $request->input('avatar') ?: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
            'bio' => $request->input('bio') ?: 'Employee at XortLogix.',
            'phone' => $request->input('phone') ?: '+1 (555) 019-0000',
            'reporting_lead' => $request->input('reportingLead') ?: 'Sarah Jenkins',
            'department_head' => $request->input('departmentHead') ?: 'Elena Rostova',
            'hr_contact' => 'David Miller',
            'date_joined' => $request->input('dateJoinedRaw') ?: ($request->input('dateJoined') ? date('Y-m-d', strtotime($request->input('dateJoined'))) : date('Y-m-d')),
            'employment_type' => $request->input('employmentType', 'Permanent'),
            'employment_status' => $request->input('employmentStatus', 'Permanent'),
            'is_active' => true,
        ]);

        // Automated leave balances: permanent employees get equal company leaves, probation/intern get 0
        $empType = $request->input('employmentType', 'Permanent');
        $isProbationOrIntern = in_array(strtolower($empType), ['probation', 'intern', 'internship']);

        $defaultBalances = [
            'annual' => ['label' => 'Annual Vacation', 'total' => $isProbationOrIntern ? 0 : 20, 'used' => 0, 'remaining' => $isProbationOrIntern ? 0 : 20],
            'medical' => ['label' => 'Medical Leave', 'total' => $isProbationOrIntern ? 0 : 10, 'used' => 0, 'remaining' => $isProbationOrIntern ? 0 : 10],
            'casual' => ['label' => 'Casual Leave', 'total' => $isProbationOrIntern ? 0 : 8, 'used' => 0, 'remaining' => $isProbationOrIntern ? 0 : 8],
            'emergency' => ['label' => 'Emergency Leave', 'total' => $isProbationOrIntern ? 0 : 3, 'used' => 0, 'remaining' => $isProbationOrIntern ? 0 : 3],
        ];

        foreach ($defaultBalances as $k => $b) {
            LeaveBalance::create([
                'user_id' => $user->id,
                'leave_type_key' => $k,
                'label' => $b['label'],
                'total' => $b['total'],
                'used' => 0,
                'remaining' => $b['remaining'],
            ]);
        }

        AuditLog::create([
            'log_code' => 'AUD-' . rand(1000, 9999),
            'user_name' => $request->input('creator_name', 'HR Admin'),
            'action' => "Created employee profile for {$user->name} ({$user->email})",
            'module' => 'User Management',
            'ip_address' => $request->ip() ?: '127.0.0.1',
        ]);

        return response()->json([
            'success' => true,
            'user' => $user->fresh('leaveBalances')->toPortalArray(),
            'message' => 'Employee account created successfully.'
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Employee record not found.'
            ], 404);
        }

        $request->validate([
            'name' => 'sometimes|required|string',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
        ]);

        if ($request->has('name')) $user->name = $request->input('name');
        if ($request->has('username')) $user->username = $request->input('username');
        if ($request->has('email')) $user->email = $request->input('email');
        if ($request->has('role')) $user->role = $request->input('role');
        if ($request->has('roleKey')) $user->role_key = $request->input('roleKey');
        if ($request->has('department')) $user->department = $request->input('department');
        if ($request->has('team')) $user->team = $request->input('team');
        if ($request->has('phone')) $user->phone = $request->input('phone');
        if ($request->has('reportingLead')) $user->reporting_lead = $request->input('reportingLead');
        if ($request->has('departmentHead')) $user->department_head = $request->input('departmentHead');
        if ($request->has('dateJoined') || $request->has('dateJoinedRaw')) {
            $raw = $request->input('dateJoinedRaw') ?: $request->input('dateJoined');
            if ($raw) {
                $user->date_joined = date('Y-m-d', strtotime($raw));
            }
        }
        if ($request->has('employmentType')) $user->employment_type = $request->input('employmentType');
        if ($request->has('employmentStatus')) $user->employment_status = $request->input('employmentStatus');
        if ($request->has('status')) {
            $user->is_active = ($request->input('status') === 'Active' || $request->input('status') === true || $request->input('status') === 1);
        }
        if ($request->has('is_active')) {
            $user->is_active = (bool)$request->input('is_active');
        }
        if ($request->filled('password')) {
            $user->password = Hash::make($request->input('password'));
        }

        $user->save();

        // Update leave balances if provided
        if ($request->has('leaveBalances') && is_array($request->input('leaveBalances'))) {
            foreach ($request->input('leaveBalances') as $key => $bal) {
                if (isset($bal['total'])) {
                    LeaveBalance::updateOrCreate(
                        ['user_id' => $user->id, 'leave_type_key' => $key],
                        [
                            'label' => $bal['label'] ?? (ucfirst($key) . ' Leave'),
                            'total' => (int)$bal['total'],
                            'used' => (int)($bal['used'] ?? 0),
                            'remaining' => (int)($bal['remaining'] ?? max(0, $bal['total'] - ($bal['used'] ?? 0)))
                        ]
                    );
                }
            }
        }

        AuditLog::create([
            'log_code' => 'AUD-' . rand(1000, 9999),
            'user_name' => $request->input('editor_name', 'HR Administrator'),
            'action' => "Updated employee credentials and record for {$user->name} ({$user->email})",
            'module' => 'Employee Management',
            'ip_address' => $request->ip() ?: '127.0.0.1',
        ]);

        return response()->json([
            'success' => true,
            'user' => $user->fresh('leaveBalances')->toPortalArray(),
            'message' => 'Employee updated successfully.'
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Employee record not found.'
            ], 404);
        }

        // Prevent accidental deletion of primary admin
        if ($user->role_key === 'admin' || $user->id === 1) {
            return response()->json([
                'success' => false,
                'message' => 'Primary Administrator account cannot be deleted.'
            ], 403);
        }

        $name = $user->name;
        $email = $user->email;

        // Clean up child relations
        $user->leaveBalances()->delete();
        $user->delete();

        AuditLog::create([
            'log_code' => 'AUD-' . rand(1000, 9999),
            'user_name' => $request->input('deleter_name', 'HR Administrator'),
            'action' => "Deleted employee profile for {$name} ({$email})",
            'module' => 'Employee Management',
            'ip_address' => $request->ip() ?: '127.0.0.1',
        ]);

        return response()->json([
            'success' => true,
            'message' => "Employee {$name} deleted successfully."
        ]);
    }
}
