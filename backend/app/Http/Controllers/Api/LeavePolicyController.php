<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LeavePolicy;
use App\Models\AuditLog;

class LeavePolicyController extends Controller
{
    public function index()
    {
        $policies = LeavePolicy::where('is_active', true)->get();
        return response()->json([
            'success' => true,
            'policies' => $policies->map(fn($p) => $p->toPortalArray())
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
        ]);

        // Cleanly extract days from input or entitlement string
        $rawDays = $request->input('days');
        if (!$rawDays && $request->filled('entitlement')) {
            $rawDays = preg_replace('/[^0-9]/', '', $request->input('entitlement'));
        }
        $days = (int)($rawDays ?: 20);
        if ($days <= 0) $days = 20;

        $rawId = $request->input('id', '');
        $policyKey = strtolower(str_replace('pol-', '', $rawId));
        $nameLower = strtolower($request->input('name', ''));

        if (empty($policyKey) || $policyKey === 'new') {
            if (str_contains($nameLower, 'annual') || str_contains($nameLower, 'vacation')) {
                $policyKey = 'annual';
            } elseif (str_contains($nameLower, 'medical') || str_contains($nameLower, 'sick')) {
                $policyKey = 'medical';
            } elseif (str_contains($nameLower, 'casual') || str_contains($nameLower, 'personal')) {
                $policyKey = 'casual';
            } elseif (str_contains($nameLower, 'emergency')) {
                $policyKey = 'emergency';
            } else {
                $policyKey = preg_replace('/[^a-z0-9]/', '_', $nameLower);
            }
        }

        $policy = LeavePolicy::updateOrCreate(
            ['policy_key' => $policyKey],
            [
                'name' => $request->input('name'),
                'days' => $days,
                'type' => $request->input('type') ?: ucfirst($policyKey),
                'is_paid' => (bool)$request->input('isPaid', true),
                'carry_forward' => (bool)$request->input('carryForward', false),
                'description' => $request->input('description') ?: "Official policy granting {$days} days per fiscal year.",
                'eligible_roles' => $request->input('eligibleRoles') ?: ['All Full-time Employees'],
                'probation_rule' => $request->input('probationRule') ?: 'Eligible upon joining',
                'requires_approval' => (bool)$request->input('requiresApproval', true),
                'is_active' => true,
            ]
        );

        // Synchronize leave balances for ALL active employees across the entire portal
        $activeUsers = \App\Models\User::where('is_active', true)->get();
        foreach ($activeUsers as $usr) {
            $existingBal = \App\Models\LeaveBalance::where('user_id', $usr->id)
                ->where('leave_type_key', $policyKey)
                ->first();

            $used = $existingBal ? (int)$existingBal->used : 0;
            $remaining = max(0, $days - $used);

            \App\Models\LeaveBalance::updateOrCreate(
                ['user_id' => $usr->id, 'leave_type_key' => $policyKey],
                [
                    'label' => $policy->name,
                    'total' => $days,
                    'used' => $used,
                    'remaining' => $remaining,
                ]
            );
        }

        // Automatic company-wide announcement broadcast so communication is properly conveyed to all employees
        \App\Models\Announcement::create([
            'title' => "Policy Update: {$policy->name} — {$days} Days Allowed",
            'content' => "Admin & HR have updated the annual entitlement for '{$policy->name}' to {$days} allowed days. All employee quotas, available balances, and self-service dashboards have been automatically synchronized.",
            'author_name' => $request->input('actor_name', 'Portal Administrator'),
            'author_role' => 'HR Operations & Executive',
            'department' => 'Company-Wide',
            'priority' => 'Important',
            'publish_date' => date('M d, Y'),
        ]);

        AuditLog::create([
            'log_code' => 'AUD-' . rand(1000, 9999),
            'user_name' => $request->input('actor_name', 'HR Administrator'),
            'action' => "Updated leave policy '{$policy->name}' to {$days} allowed days. Synchronized {$activeUsers->count()} employee quotas.",
            'module' => 'Leave Policy Engine',
            'ip_address' => $request->ip() ?: '127.0.0.1',
        ]);

        $freshUsers = \App\Models\User::with('leaveBalances')->where('is_active', true)->get()->map(fn($u) => $u->toPortalArray());

        return response()->json([
            'success' => true,
            'policy' => $policy->toPortalArray(),
            'users' => $freshUsers,
            'message' => "Policy '{$policy->name}' updated to {$days} allowed days. All employee quotas synchronized successfully."
        ]);
    }

    public function destroy($id)
    {
        $policy = LeavePolicy::where('policy_key', $id)->first();
        if ($policy) {
            $name = $policy->name;
            $policy->delete();

            AuditLog::create([
                'log_code' => 'AUD-' . rand(1000, 9999),
                'user_name' => 'HR Admin',
                'action' => "Deleted leave policy '{$name}'",
                'module' => 'Policy Engine',
                'ip_address' => '127.0.0.1',
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Policy removed successfully.'
        ]);
    }
}
