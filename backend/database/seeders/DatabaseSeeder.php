<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\LeaveBalance;
use App\Models\LeavePolicy;
use App\Models\Announcement;
use App\Models\LeaveRequest;
use App\Models\HrTicket;
use App\Models\AuditLog;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Users
        // 1. Seed ONLY HR User (All other users removed as requested)
        $usersData = [
            [
                'name' => 'David Miller',
                'username' => 'david.miller',
                'email' => 'david.hr@xortlogix.com',
                'password' => Hash::make('hr123'),
                'role' => 'HR Operations Specialist',
                'role_key' => 'hr',
                'department' => 'Supporting Staff',
                'team' => 'Supporting Staff',
                'avatar' => '',
                'bio' => 'HR Operations specialist handling employee onboarding, leaves, and policy administration.',
                'phone' => '+1 (555) 019-3321',
                'reporting_lead' => 'Executive Leadership',
                'department_head' => 'Executive Leadership',
                'hr_contact' => 'Self',
                'balances' => [
                    'annual' => ['label' => 'Annual Vacation', 'total' => 28, 'used' => 2, 'remaining' => 26],
                    'medical' => ['label' => 'Medical Leave', 'total' => 10, 'used' => 0, 'remaining' => 10],
                    'casual' => ['label' => 'Casual Leave', 'total' => 8, 'used' => 1, 'remaining' => 7],
                    'emergency' => ['label' => 'Emergency Leave', 'total' => 3, 'used' => 0, 'remaining' => 3],
                ]
            ]
        ];

        // Clean out any non-HR users
        User::where('role_key', '!=', 'hr')->delete();

        foreach ($usersData as $uData) {
            $balances = $uData['balances'];
            unset($uData['balances']);

            $user = User::updateOrCreate(['email' => $uData['email']], $uData);

            foreach ($balances as $key => $bal) {
                LeaveBalance::updateOrCreate(
                    ['user_id' => $user->id, 'leave_type_key' => $key],
                    [
                        'label' => $bal['label'],
                        'total' => $bal['total'],
                        'used' => $bal['used'],
                        'remaining' => $bal['remaining'],
                    ]
                );
            }
        }

        // 2. Seed Leave Policies (Maternity leave removed by default as instructed)
        $policies = [
            [
                'policy_key' => 'annual',
                'name' => 'Annual Vacation Leave',
                'days' => 20,
                'type' => 'Annual',
                'is_paid' => true,
                'carry_forward' => true,
                'description' => 'Statutory paid vacation days credited at start of fiscal year.',
                'eligible_roles' => ['Full-time Employees', 'Team Leads', 'Directors'],
                'probation_rule' => 'Eligible after 90 days',
                'requires_approval' => true,
                'is_active' => true,
            ],
            [
                'policy_key' => 'medical',
                'name' => 'Medical & Sick Leave',
                'days' => 10,
                'type' => 'Medical',
                'is_paid' => true,
                'carry_forward' => false,
                'description' => 'Paid time off for illnesses or medical recovery. Over 2 consecutive days requires certified medical note.',
                'eligible_roles' => ['All Employees', 'Contractors'],
                'probation_rule' => 'Eligible upon joining',
                'requires_approval' => true,
                'is_active' => true,
            ],
            [
                'policy_key' => 'casual',
                'name' => 'Casual & Personal Leave',
                'days' => 8,
                'type' => 'Casual',
                'is_paid' => true,
                'carry_forward' => false,
                'description' => 'Intended for urgent personal commitments, administrative errands, or family obligations.',
                'eligible_roles' => ['Full-time Employees'],
                'probation_rule' => 'Eligible upon joining',
                'requires_approval' => true,
                'is_active' => true,
            ],
            [
                'policy_key' => 'emergency',
                'name' => 'Emergency Fast-Track Leave',
                'days' => 3,
                'type' => 'Emergency',
                'is_paid' => true,
                'carry_forward' => false,
                'description' => 'Unplanned critical emergency circumstances. Automatically expedited with post-facto verification.',
                'eligible_roles' => ['All Employees'],
                'probation_rule' => 'Immediate eligibility',
                'requires_approval' => true,
                'is_active' => true,
            ]
        ];

        foreach ($policies as $p) {
            LeavePolicy::updateOrCreate(['policy_key' => $p['policy_key']], $p);
        }

        // 3. Seed Announcements
        $announcements = [
            [
                'title' => 'XortLogix Annual Hackathon & Innovation Summit 2026',
                'content' => 'Registration is officially open for the upcoming annual engineering hackathon. Teams of up to 4 members are encouraged to build generative AI integrations.',
                'author_name' => 'David Miller',
                'author_role' => 'People Operations',
                'department' => 'Company-Wide',
                'priority' => 'Important',
                'publish_date' => date('M d, Y'),
            ],
            [
                'title' => 'Mid-Year Leave Balance Audit & Carry-Forward Window',
                'content' => 'Please review your remaining leave ledger before end of quarter. Up to 5 annual leave days may be carried forward into the subsequent calendar period.',
                'author_name' => 'Admin XortLogix',
                'author_role' => 'Executive Office',
                'department' => 'Company-Wide',
                'priority' => 'Normal',
                'publish_date' => date('M d, Y', strtotime('-2 days')),
            ]
        ];

        foreach ($announcements as $a) {
            Announcement::create($a);
        }

        // 4. Empty Leave Requests (No dummy requests)
        LeaveRequest::query()->delete();

        // 5. Empty HR Tickets (No dummy tickets)
        HrTicket::query()->delete();


        // 6. Seed Audit Logs
        $logs = [
            [
                'log_code' => 'AUD-1001',
                'user_name' => 'Admin XortLogix',
                'action' => 'Database initialized with official organizational seed records',
                'module' => 'System & Database',
                'ip_address' => '127.0.0.1',
            ],
            [
                'log_code' => 'AUD-1002',
                'user_name' => 'Sarah Jenkins',
                'action' => 'Approved Annual Vacation request LR-2026-001 for Alex Rivera',
                'module' => 'Leave Approvals',
                'ip_address' => '192.168.10.45',
            ]
        ];

        foreach ($logs as $l) {
            AuditLog::create($l);
        }
    }
}
