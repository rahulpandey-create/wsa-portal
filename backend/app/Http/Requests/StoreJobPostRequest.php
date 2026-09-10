<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreJobPostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Required fields
            'title' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'visa' => 'required|string|max:255',
            'job_type' => 'required|string|max:100',
            'positions' => 'required|integer|min:1',
            'description' => 'required|string',
            'requirements' => 'required|string',
            //not mentioned in the client requirements but added for completeness
            'contact_email' => 'nullable|email|max:255',

            // Optional fields
            'company' => 'nullable|string|max:255',
            'salary' => 'nullable|string|max:255',
            'experience' => 'nullable|string|max:255',
            'qualifications' => 'nullable|string|max:255',
        ];
    }
}