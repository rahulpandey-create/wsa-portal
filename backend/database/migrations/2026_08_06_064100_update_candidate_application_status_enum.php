<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("
            ALTER TABLE candidate_applications
            MODIFY status VARCHAR(255) NOT NULL DEFAULT 'pending'
        ");
    }

    public function down(): void
    {
        DB::statement("
            ALTER TABLE candidate_applications
            MODIFY status ENUM('pending','selected','rejected')
            NOT NULL DEFAULT 'pending'
        ");
    }
};