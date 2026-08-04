<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}
