<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hr_tickets', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_code')->unique();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('employee_name');
            $table->string('department');
            $table->string('category');
            $table->string('subject');
            $table->text('description')->nullable();
            $table->string('priority')->default('Medium'); // Low, Medium, High, Urgent
            $table->string('status')->default('Open'); // Open, In Progress, Resolved, Closed
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hr_tickets');
    }
};
