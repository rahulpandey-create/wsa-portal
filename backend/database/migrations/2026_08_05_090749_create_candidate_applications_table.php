<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('candidate_applications', function (Blueprint $table) {
            $table->id();
            
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->foreignId('job_post_id')->constrained()->cascadeOnDelete();

            $table->string('candidate_name');

            $table->string('email');

            $table->string('phone');

            $table->integer('experience');

            $table->text('cover_letter')->nullable();

            $table->enum('status', ['pending', 'selected', 'rejected'])->default('pending');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidate_applications');
    }
};
