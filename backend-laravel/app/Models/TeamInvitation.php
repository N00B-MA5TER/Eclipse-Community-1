<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamInvitation extends Model
{
    protected $fillable = [
        'team_id',
        'email',
        'status',
    ];

    public function team()
    {
        return $this->belongsTo(Team::class);
    }
}
