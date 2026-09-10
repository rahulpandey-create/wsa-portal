<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobPostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'title' => $this->title,
            'company' => $this->company,
            'location' => $this->location,
            'visa' => $this->visa,
            'salary' => $this->salary,
            'job_type' => $this->job_type,
            'positions' => $this->positions,
            'experience' => $this->experience,
            'qualifications' => $this->qualifications,
            'description' => $this->description,
            'requirements' => $this->requirements,
            'contact_email' => $this->contact_email,
            'status' => $this->status,
            'is_sponsored' => $this->is_sponsored,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
