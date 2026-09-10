<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateJobPostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'location' => 'required|string|max:255',
            'visa' => 'nullable|string|max:255',
            'salary' => 'nullable|string|max:255',
            'job_type' => 'required|string|max:255',
            'positions' => 'required|integer|min:1',
            'experience' => 'nullable|string|max:255',
            'qualifications' => 'nullable|string|max:255',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'contact_email' => 'nullable|email|max:255',
        ];
    }
}
