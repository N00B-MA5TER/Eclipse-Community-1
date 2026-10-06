<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TeamCompletedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $email;
    public $team;
    public $problemStatements;

    public function __construct($email, $team)
    {
        $this->email = $email;
        $this->team = $team;
        $this->problemStatements = [
            "THE PRESENTATION FROM HELL",
            "THE PERFECT MODEL THAT DOESN'T WORK",
            "THE PRODUCTION LINE",
            "THE THREE PATIENTS",
            "THE HACKATHON PIVOT",
            "THE WRONG DELIVERY",
            "THE JOB OFFER",
            "THE EXPERIMENT",
            "THE EXAM PAPER",
            "THE PHONE THAT HAS TO LAST",
            "THE EVENT THAT IS TOO SUCCESSFUL",
            "THE LAST TEN MINUTES",
            "THE BRIDGE",
            "THE COMPUTER LAB",
            "THE SPEAKER WHO CANNOT SPEAK",
            "THE FACTORY FIRE",
            "THE DOOR THAT SHOULD STAY CLOSED",
            "THE BOX NOBODY SHOULD OPEN"
        ];
    }

    public function broadcastOn(): array
    {
        $emailId = str_replace(['@', '.'], '-', $this->email);
        return [
            new PrivateChannel('user.invites.' . $emailId),
        ];
    }
    
    public function broadcastAs()
    {
        return 'TeamCompletedEvent';
    }
}
