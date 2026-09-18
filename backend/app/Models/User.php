<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'role',
        'role_key',
        'department',
        'team',
        'avatar',
        'bio',
        'phone',
        'reporting_lead',
        'department_head',
        'hr_contact',
        'date_joined',
        'employment_type',
        'employment_status',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function leaveBalances()
    {
        return $this->hasMany(LeaveBalance::class);
    }

    public function leaveRequests()
    {
        return $this->hasMany(LeaveRequest::class);
    }

    public function hrTickets()
    {
        return $this->hasMany(HrTicket::class);
    }

    public function toPortalArray(): array
    {
        $balances = [];
        foreach ($this->leaveBalances as $b) {
            $balances[$b->leave_type_key] = [
                'label' => $b->label,
                'total' => (int)$b->total,
                'used' => (int)$b->used,
                'remaining' => (int)$b->remaining,
            ];
        }

        // Fallbacks if not set
        if (empty($balances)) {
            $balances = [
                'annual' => ['label' => 'Annual Vacation', 'total' => 20, 'used' => 0, 'remaining' => 20],
                'medical' => ['label' => 'Medical Leave', 'total' => 10, 'used' => 0, 'remaining' => 10],
                'casual' => ['label' => 'Casual Leave', 'total' => 8, 'used' => 0, 'remaining' => 8],
                'emergency' => ['label' => 'Emergency Leave', 'total' => 3, 'used' => 0, 'remaining' => 3],
            ];
        }

        return [
            'id' => (string)$this->id,
            'name' => $this->name,
            'username' => $this->username ?: strtolower(str_replace(' ', '', $this->name)),
            'email' => $this->email,
            'role' => $this->role,
            'roleKey' => $this->role_key,
            'department' => $this->department,
            'team' => $this->team,
            'avatar' => $this->avatar ?: '',
            'bio' => $this->bio ?: '',
            'phone' => $this->phone ?: '+1 (555) 019-2831',
            'reportingLead' => $this->reporting_lead ?: 'Sarah Jenkins',
            'departmentHead' => $this->department_head ?: 'Elena Rostova',
            'hrContact' => $this->hr_contact ?: 'David Miller',
            'dateJoined' => $this->date_joined ? date('d M Y', strtotime($this->date_joined)) : ($this->created_at ? date('d M Y', strtotime($this->created_at)) : '15 Jan 2024'),
            'dateJoinedRaw' => $this->date_joined ? date('Y-m-d', strtotime($this->date_joined)) : ($this->created_at ? date('Y-m-d', strtotime($this->created_at)) : '2024-01-15'),
            'employmentType' => $this->employment_type ?: 'Permanent',
            'employmentStatus' => $this->employment_status ?: 'Permanent',
            'leaveBalances' => $balances,
        ];
    }
}
