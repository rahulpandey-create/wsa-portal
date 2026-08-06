<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobPostResource extends JsonResource
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

        'title' => $this->title,
        'company' => $this->company,
        'location' => $this->location,
        'salary' => $this->salary,
        'job_type' => $this->job_type,
        'description' => $this->description,
        'status' => $this->status,

        'created_at' => $this->created_at,
        'updated_at' => $this->updated_at,
    ];
}
}
