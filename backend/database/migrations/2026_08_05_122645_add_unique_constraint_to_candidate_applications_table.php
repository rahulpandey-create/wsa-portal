<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('candidate_applications', function (Blueprint $table) {
            $table->unique(['user_id', 'job_post_id']);
        });
    }

    public function down(): void
    {
        Schema::table('candidate_applications', function (Blueprint $table) {
            $table->dropUnique(['user_id', 'job_post_id']);
        });
    }
};