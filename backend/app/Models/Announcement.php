<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'author_name',
        'author_role',
        'department',
        'priority',
        'publish_date',
    ];

    public function toPortalArray(): array
    {
        return [
            'id' => (string)$this->id,
            'title' => $this->title,
            'content' => $this->content,
            'author' => $this->author_name,
            'role' => $this->author_role,
            'department' => $this->department,
            'priority' => $this->priority,
            'date' => $this->publish_date ?: ($this->created_at ? $this->created_at->format('M d, Y') : date('M d, Y')),
        ];
    }
}
