<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeavePolicy extends Model
{
    use HasFactory;

    protected $fillable = [
        'policy_key',
        'name',
        'days',
        'type',
        'is_paid',
        'carry_forward',
        'description',
        'eligible_roles',
        'probation_rule',
        'requires_approval',
        'is_active',
    ];

    protected $casts = [
        'days' => 'integer',
        'is_paid' => 'boolean',
        'carry_forward' => 'boolean',
        'requires_approval' => 'boolean',
        'is_active' => 'boolean',
        'eligible_roles' => 'array',
    ];

    public function toPortalArray(): array
    {
        return [
            'id' => $this->policy_key,
            'name' => $this->name,
            'days' => (int)$this->days,
            'type' => $this->type,
            'isPaid' => (bool)$this->is_paid,
            'carryForward' => (bool)$this->carry_forward,
            'description' => $this->description,
            'eligibleRoles' => $this->eligible_roles ?: ['All Full-time Employees'],
            'probationRule' => $this->probation_rule ?: 'Eligible upon joining',
            'requiresApproval' => (bool)$this->requires_approval,
        ];
    }
}
