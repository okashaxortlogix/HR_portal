<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'log_code',
        'user_name',
        'action',
        'module',
        'ip_address',
    ];

    public function toPortalArray(): array
    {
        return [
            'id' => $this->log_code ?: "AUD-{$this->id}",
            'user' => $this->user_name,
            'action' => $this->action,
            'module' => $this->module,
            'ip' => $this->ip_address,
            'time' => $this->created_at ? $this->created_at->diffForHumans() : 'Just now',
        ];
    }
}
