<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CandidateApplicationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
{
    return [
        'id' => $this->id,

        'candidate_name' => $this->candidate_name,
        'email' => $this->email,
        'phone' => $this->phone,
        'experience' => $this->experience,

        'status' => $this->status,

        'resume' => $this->resume,

        'created_at' => $this->created_at,

        'job' => [
            'id' => $this->jobPost?->id,
            'title' => $this->jobPost?->title,
            'company' => $this->jobPost?->company,
            'location' => $this->jobPost?->location,
        ],

        'user' => [
            'id' => $this->user?->id,
            'name' => $this->user?->name,
            'email' => $this->user?->email,
            'role' => $this->user?->role,
        ],
    ];
}
}
