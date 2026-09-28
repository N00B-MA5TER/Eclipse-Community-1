<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alumni extends Model
{
    protected $fillable = [
        'photo',
        'name',
        'department',
        'graduation_year',
        'current_role',
        'linkedin_url',
        'status',
    ];

    protected $casts = [
        'graduation_year' => 'integer',
    ];
}
