<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;

class AuditLogController extends Controller
{
    public function index()
    {
        $logs = AuditLog::orderBy('created_at', 'desc')->take(50)->get();
        return response()->json([
            'success' => true,
            'auditLogs' => $logs->map(fn($l) => $l->toPortalArray())
        ]);
    }
}
