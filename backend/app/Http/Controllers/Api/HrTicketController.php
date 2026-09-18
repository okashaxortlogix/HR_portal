<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\HrTicket;
use App\Models\AuditLog;

class HrTicketController extends Controller
{
    public function index()
    {
        $tickets = HrTicket::orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'tickets' => $tickets->map(fn($t) => $t->toPortalArray())
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'employee' => 'required',
            'category' => 'required',
            'subject' => 'required',
        ]);

        $code = 'HR-' . rand(1000, 9999);

        $ticket = HrTicket::create([
            'ticket_code' => $code,
            'user_id' => $request->input('userId'),
            'employee_name' => $request->input('employee'),
            'department' => $request->input('department', 'Engineering'),
            'category' => $request->input('category'),
            'subject' => $request->input('subject'),
            'description' => $request->input('description'),
            'priority' => $request->input('priority', 'Medium'),
            'status' => 'Open',
        ]);

        AuditLog::create([
            'log_code' => 'AUD-' . rand(1000, 9999),
            'user_name' => $ticket->employee_name,
            'action' => "Raised HR support ticket {$ticket->ticket_code}: '{$ticket->subject}'",
            'module' => 'HR Helpdesk',
            'ip_address' => $request->ip() ?: '127.0.0.1',
        ]);

        return response()->json([
            'success' => true,
            'ticket' => $ticket->toPortalArray(),
            'message' => 'Helpdesk request submitted successfully.'
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $ticket = HrTicket::where('ticket_code', $id)->first() ?: HrTicket::find($id);

        if (!$ticket) {
            return response()->json(['success' => false, 'message' => 'Ticket not found.'], 404);
        }

        $ticket->status = $request->input('status', 'In Progress');
        $ticket->save();

        AuditLog::create([
            'log_code' => 'AUD-' . rand(1000, 9999),
            'user_name' => $request->input('actor_name', 'HR Specialist'),
            'action' => "Updated ticket {$ticket->ticket_code} status to '{$ticket->status}'",
            'module' => 'HR Helpdesk',
            'ip_address' => $request->ip() ?: '127.0.0.1',
        ]);

        return response()->json([
            'success' => true,
            'ticket' => $ticket->toPortalArray(),
            'message' => 'Ticket status updated.'
        ]);
    }
}
