<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobPost extends Model
{
    protected $fillable = [
        'title',
        'company',
        'location',
        'salary',
        'job_type',
        'description',
        'status',
    ];
    public function candidateApplications(): HasMany
{
    return $this->hasMany(CandidateApplication::class);
}
}
