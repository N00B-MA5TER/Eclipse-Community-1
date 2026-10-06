<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('user.invites.{emailId}', function ($user, $emailId) {
    $userEmailId = str_replace(['@', '.'], ['-', '-'], $user->email);
    return $userEmailId === $emailId;
});
