<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeaveRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'request_code',
        'user_id',
        'employee_name',
        'department',
        'leave_type',
        'start_date',
        'end_date',
        'days',
        'reason',
        'is_emergency',
        'status',
        'approver_name',
        'rejection_reason',
    ];

    protected $casts = [
        'days' => 'integer',
        'is_emergency' => 'boolean',
        'start_date' => 'date:Y-m-d',
        'end_date' => 'date:Y-m-d',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function toPortalArray(): array
    {
        return [
            'id' => $this->request_code ?: "LR-{$this->id}",
            'employee' => $this->employee_name,
            'department' => $this->department,
            'type' => $this->leave_type,
            'startDate' => $this->start_date ? $this->start_date->format('Y-m-d') : '',
            'endDate' => $this->end_date ? $this->end_date->format('Y-m-d') : '',
            'days' => (int)$this->days,
            'status' => $this->status,
            'reason' => $this->reason ?: '',
            'isEmergency' => (bool)$this->is_emergency,
            'approver' => $this->approver_name,
            'rejectionReason' => $this->rejection_reason,
            'createdAt' => $this->created_at ? $this->created_at->toIso8601String() : null,
        ];
    }
}
