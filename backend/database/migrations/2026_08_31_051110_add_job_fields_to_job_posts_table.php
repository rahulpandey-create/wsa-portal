<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('job_posts', function (Blueprint $table) {
            $table->string('company')->nullable()->change();
            $table->string('salary')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('job_posts', function (Blueprint $table) {
            $table->string('company')->nullable(false)->change();
            $table->decimal('salary', 10, 2)->nullable()->change();
        });
    }
};