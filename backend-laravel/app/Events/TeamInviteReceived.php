<?php

namespace App\Events;

use App\Models\TeamInvitation;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TeamInviteReceived implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $invitation;

    /**
     * Create a new event instance.
     */
    public function __construct(TeamInvitation $invitation)
    {
        $this->invitation = $invitation->load('team');
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        $emailId = str_replace(['@', '.'], ['-', '-'], $this->invitation->email);
        
        return [
            new PrivateChannel('user.invites.' . $emailId),
        ];
    }
    
    public function broadcastAs()
    {
        return 'TeamInviteReceived';
    }
}
