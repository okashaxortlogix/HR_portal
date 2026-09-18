<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->date('date_joined')->nullable()->after('hr_contact');
            $table->string('employment_type')->default('Permanent')->after('date_joined');
            $table->string('employment_status')->default('Permanent')->after('employment_type');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['date_joined', 'employment_type', 'employment_status']);
        });
    }
};
