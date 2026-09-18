<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LeaveRequest;
use App\Models\LeaveBalance;
use App\Models\AuditLog;

class LeaveRequestController extends Controller
{
    public function index()
    {
        $requests = LeaveRequest::orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'requests' => $requests->map(fn($r) => $r->toPortalArray())
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'employee' => 'required',
            'type' => 'required',
            'startDate' => 'required',
            'endDate' => 'required',
            'days' => 'required|numeric',
        ]);

        $code = 'LR-' . date('Y') . '-' . sprintf('%03d', LeaveRequest::count() + 1);

        $lr = LeaveRequest::create([
            'request_code' => $code,
            'user_id' => $request->input('userId'),
            'employee_name' => $request->input('employee'),
            'department' => $request->input('department') ?: 'Engineering',
            'leave_type' => $request->input('type'),
            'start_date' => $request->input('startDate'),
            'end_date' => $request->input('endDate'),
            'days' => (int)$request->input('days'),
            'reason' => $request->input('reason'),
            'is_emergency' => (bool)$request->input('isEmergency', false),
            'status' => 'Pending',
        ]);

        AuditLog::create([
            'log_code' => 'AUD-' . rand(1000, 9999),
            'user_name' => $lr->employee_name,
            'action' => "Submitted {$lr->leave_type} request ({$lr->days} days)",
            'module' => 'Leave Requests',
            'ip_address' => $request->ip() ?: '127.0.0.1',
        ]);

        return response()->json([
            'success' => true,
            'request' => $lr->toPortalArray(),
            'message' => 'Leave request submitted successfully.'
        ]);
    }

    public function action(Request $request, $id)
    {
        $lr = LeaveRequest::where('request_code', $id)->first() ?: LeaveRequest::find($id);

        if (!$lr) {
            return response()->json([
                'success' => false,
                'message' => 'Leave request not found.'
            ], 404);
        }

        $action = $request->input('action'); // 'Approve' or 'Reject'
        $approver = $request->input('approver', 'Manager');
        $reason = $request->input('reason');

        if ($action === 'Approve') {
            $lr->status = 'Approved';
            $lr->approver_name = $approver;

            // Deduct from leave balance if user exists
            if ($lr->user_id) {
                $typeKey = strtolower(explode(' ', $lr->leave_type)[0]);
                $bal = LeaveBalance::where('user_id', $lr->user_id)
                    ->where('leave_type_key', 'like', "%{$typeKey}%")
                    ->first();

                if ($bal) {
                    $bal->used = $bal->used + $lr->days;
                    $bal->remaining = max(0, $bal->total - $bal->used);
                    $bal->save();
                }
            }

            AuditLog::create([
                'log_code' => 'AUD-' . rand(1000, 9999),
                'user_name' => $approver,
                'action' => "Approved leave request {$lr->request_code} for {$lr->employee_name}",
                'module' => 'Leave Approvals',
                'ip_address' => $request->ip() ?: '127.0.0.1',
            ]);
        } else {
            $lr->status = 'Rejected';
            $lr->approver_name = $approver;
            $lr->rejection_reason = $reason ?: 'Not approved per current operational requirements';

            AuditLog::create([
                'log_code' => 'AUD-' . rand(1000, 9999),
                'user_name' => $approver,
                'action' => "Rejected leave request {$lr->request_code} for {$lr->employee_name}",
                'module' => 'Leave Approvals',
                'ip_address' => $request->ip() ?: '127.0.0.1',
            ]);
        }

        $lr->save();

        return response()->json([
            'success' => true,
            'request' => $lr->toPortalArray(),
            'message' => "Request {$lr->status} successfully."
        ]);
    }
}
