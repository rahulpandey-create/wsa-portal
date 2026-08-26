<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssociateAccountSetupToken extends Model
{
    use HasFactory;

    protected $fillable = [
        'associate_registration_id',
        'token_hash',
        'expires_at',
        'used_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'used_at' => 'datetime',
    ];

    public function registration(): BelongsTo
    {
        return $this->belongsTo(
            AssociateRegistration::class,
            'associate_registration_id'
        );
    }
}