<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\LeavePolicyController;
use App\Http\Controllers\Api\LeaveRequestController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\HrTicketController;
use App\Http\Controllers\Api\AuditLogController;

// Authentication & Profile Endpoints
Route::post('/auth/login', [AuthController::class, 'login']);
Route::put('/auth/profile', [AuthController::class, 'updateProfile']);

// Users / Employees Directory
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

// Leave Policies Engine
Route::get('/policies', [LeavePolicyController::class, 'index']);
Route::post('/policies', [LeavePolicyController::class, 'store']);
Route::delete('/policies/{id}', [LeavePolicyController::class, 'destroy']);

// Leave Requests & Approvals Workflow
Route::get('/leaves', [LeaveRequestController::class, 'index']);
Route::post('/leaves', [LeaveRequestController::class, 'store']);
Route::put('/leaves/{id}/action', [LeaveRequestController::class, 'action']);

// Company Announcements & Notice Broadcasts
Route::get('/announcements', [AnnouncementController::class, 'index']);
Route::post('/announcements', [AnnouncementController::class, 'store']);
Route::delete('/announcements/{id}', [AnnouncementController::class, 'destroy']);

// HR Helpdesk & Tickets
Route::get('/tickets', [HrTicketController::class, 'index']);
Route::post('/tickets', [HrTicketController::class, 'store']);
Route::put('/tickets/{id}/status', [HrTicketController::class, 'updateStatus']);

// Security Audit Trail
Route::get('/audit-logs', [AuditLogController::class, 'index']);
