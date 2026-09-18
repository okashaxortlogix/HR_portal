<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Announcement;
use App\Models\AuditLog;

class AnnouncementController extends Controller
{
    public function index()
    {
        $announcements = Announcement::orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'announcements' => $announcements->map(fn($a) => $a->toPortalArray())
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'content' => 'required|string',
        ]);

        $announcement = Announcement::create([
            'title' => $request->input('title'),
            'content' => $request->input('content'),
            'author_name' => $request->input('author', 'HR Management'),
            'author_role' => $request->input('role', 'People Operations'),
            'department' => $request->input('department', 'Company-Wide'),
            'priority' => $request->input('priority', 'Normal'),
            'publish_date' => date('M d, Y'),
        ]);

        AuditLog::create([
            'log_code' => 'AUD-' . rand(1000, 9999),
            'user_name' => $announcement->author_name,
            'action' => "Broadcast company-wide announcement '{$announcement->title}'",
            'module' => 'Announcements',
            'ip_address' => $request->ip() ?: '127.0.0.1',
        ]);

        return response()->json([
            'success' => true,
            'announcement' => $announcement->toPortalArray(),
            'message' => 'Announcement broadcast successfully.'
        ]);
    }

    public function destroy($id)
    {
        $announcement = Announcement::find($id);
        if ($announcement) {
            $title = $announcement->title;
            $announcement->delete();

            AuditLog::create([
                'log_code' => 'AUD-' . rand(1000, 9999),
                'user_name' => 'HR Admin',
                'action' => "Removed announcement '{$title}'",
                'module' => 'Announcements',
                'ip_address' => '127.0.0.1',
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Announcement deleted successfully.'
        ]);
    }
}
