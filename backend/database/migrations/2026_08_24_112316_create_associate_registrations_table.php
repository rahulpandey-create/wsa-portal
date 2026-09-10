<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('associate_registrations', function (Blueprint $table) {
            $table->id();

            $table->string('business_name');
            $table->string('representative_name');
            $table->string('business_type');
            $table->string('country');
            $table->string('email');
            $table->string('phone');
            $table->string('website')->nullable();
            $table->text('business_description');
            $table->string('referral_source');
            $table->boolean('declaration')->default(false);

            $table->string('status')->default('Pending');

            $table->timestamps();

            $table->index('email');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('associate_registrations');
    }
};