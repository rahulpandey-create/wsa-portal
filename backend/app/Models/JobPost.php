<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobPost extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'company',
        'location',
        'visa',
        'salary',
        'job_type',
        'description',
        'status',
        'is_sponsored',
    ];

    protected $casts = [
        'is_sponsored' => 'boolean',
    ];

    public function candidateApplications(): HasMany
    {
        return $this->hasMany(CandidateApplication::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}