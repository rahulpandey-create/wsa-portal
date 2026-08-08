<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CandidateApplication extends Model
{
    protected $fillable = [
        'user_id',
        'job_post_id',
        'candidate_name',
        'email',
        'phone',
        'experience',
        'cover_letter',
        'resume',
        'status',
    ];

    public function user(): BelongsTo
    {

        return $this->belongsTo(User::class);
    }

    public function jobPost(): BelongsTo
    {
        return $this->belongsTo(JobPost::class);
    }
}