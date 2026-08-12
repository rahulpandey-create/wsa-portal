<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("
            ALTER TABLE candidate_applications
            ALTER COLUMN status TYPE VARCHAR(255)
        ");

        DB::statement("
            ALTER TABLE candidate_applications
            ALTER COLUMN status SET NOT NULL
        ");

        DB::statement("
            ALTER TABLE candidate_applications
            ALTER COLUMN status SET DEFAULT 'pending'
        ");
    }

    public function down(): void
    {
        DB::statement("
            ALTER TABLE candidate_applications
            ALTER COLUMN status DROP DEFAULT
        ");

        DB::statement("
            ALTER TABLE candidate_applications
            ALTER COLUMN status DROP NOT NULL
        ");
    }
};