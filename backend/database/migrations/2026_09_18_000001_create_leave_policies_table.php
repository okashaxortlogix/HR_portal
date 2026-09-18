<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leave_policies', function (Blueprint $table) {
            $table->id();
            $table->string('policy_key')->unique();
            $table->string('name');
            $table->integer('days');
            $table->string('type')->default('Standard');
            $table->boolean('is_paid')->default(true);
            $table->boolean('carry_forward')->default(false);
            $table->text('description')->nullable();
            $table->json('eligible_roles')->nullable();
            $table->string('probation_rule')->nullable();
            $table->boolean('requires_approval')->default(true);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leave_policies');
    }
};
