<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HrTicket extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_code',
        'user_id',
        'employee_name',
        'department',
        'category',
        'subject',
        'description',
        'priority',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function toPortalArray(): array
    {
        return [
            'id' => $this->ticket_code ?: "HR-{$this->id}",
            'userId' => $this->user_id ? (string)$this->user_id : null,
            'employee' => $this->employee_name,
            'department' => $this->department,
            'category' => $this->category,
            'subject' => $this->subject,
            'description' => $this->description ?: '',
            'priority' => $this->priority,
            'status' => $this->status,
            'date' => $this->created_at ? $this->created_at->format('M d, Y') : date('M d, Y'),
        ];
    }
}
