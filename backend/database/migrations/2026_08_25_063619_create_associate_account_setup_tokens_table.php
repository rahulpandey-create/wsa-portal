<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('associate_account_setup_tokens', function (Blueprint $table) {
            $table->id();

            $table->foreignId('associate_registration_id')
                ->constrained('associate_registrations')
                ->cascadeOnDelete();

            $table->string('token_hash', 64)->unique();

            $table->timestamp('expires_at');

            $table->timestamp('used_at')->nullable();

            $table->timestamps();

            $table->index('associate_registration_id');
            $table->index('expires_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('associate_account_setup_tokens');
    }
};