<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssociateRegistration extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_name',
        'representative_name',
        'business_type',
        'country',
        'email',
        'phone',
        'website',
        'business_description',
        'referral_source',
        'declaration',
        'status',
    ];

    protected $casts = [
        'declaration' => 'boolean',
    ];

    public function accountSetupTokens(): HasMany
    {
        return $this->hasMany(
            AssociateAccountSetupToken::class,
            'associate_registration_id'
        );
    }
}