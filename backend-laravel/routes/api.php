<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\NotificationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Auth Routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [\App\Http\Controllers\AuthController::class, 'register']);
    Route::post('/verify-otp', [\App\Http\Controllers\AuthController::class, 'verifyOtp']);
    Route::post('/resend-otp', [\App\Http\Controllers\AuthController::class, 'resendOtp']);
    Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login']);
    Route::post('/forgot-password', [\App\Http\Controllers\AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [\App\Http\Controllers\AuthController::class, 'resetPassword'])->name('password.reset');
    
    // OAuth Routes
    Route::get('/google/redirect', [\App\Http\Controllers\OAuthController::class, 'redirectGoogle']);
    Route::get('/google/callback', [\App\Http\Controllers\OAuthController::class, 'callbackGoogle']);
    Route::get('/github/redirect', [\App\Http\Controllers\OAuthController::class, 'redirectGithub']);
    Route::get('/github/callback', [\App\Http\Controllers\OAuthController::class, 'callbackGithub']);
    Route::post('/oauth/exchange', [\App\Http\Controllers\OAuthController::class, 'exchangeHandoff']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/me', [AuthController::class, 'updateProfile']);
    });
});

// Event Routes
Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{id}', [EventController::class, 'show']);

use App\Http\Controllers\AdminController;
use App\Http\Controllers\StatsController;

// ...

// Public Stats Route
Route::get('/stats/public', [StatsController::class, 'publicStats']);

use App\Http\Controllers\AlumniController;
use App\Http\Controllers\AdminAlumniController;

// Public Alumni Routes
Route::get('/alumni', [AlumniController::class, 'index']);
Route::post('/alumni', [AlumniController::class, 'store'])->middleware('throttle:5,1');

// Public Calendar Routes
Route::get('/calendar-events', [\App\Http\Controllers\CalendarEventController::class, 'index']);

// Public Memberships Route (Moved to protected routes)



// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/memberships', [\App\Http\Controllers\MembershipController::class, 'store'])->middleware('throttle:6,1');
    Route::get('/memberships/me', [\App\Http\Controllers\MembershipController::class, 'myMembership']);
    Route::get('/events/{id}/participants', [EventController::class, 'participants']);

    // Admin
    Route::prefix('admin')->group(function () {
        Route::post('/events', [AdminController::class, 'createEvent']);
        Route::delete('/events/{id}', [AdminController::class, 'deleteEvent']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::post('/broadcast', [AdminController::class, 'broadcast']);
        
        // Admin Alumni Routes
        Route::get('/alumni/pending', [AdminAlumniController::class, 'pending']);
        Route::get('/alumni/all', [AdminAlumniController::class, 'index']);
        Route::patch('/alumni/{id}/approve', [AdminAlumniController::class, 'approve']);
        Route::patch('/alumni/{id}/reject', [AdminAlumniController::class, 'reject']);
        Route::delete('/alumni/{id}', [AdminAlumniController::class, 'destroy']);

        // Admin Membership Routes
        Route::get('/memberships', [\App\Http\Controllers\MembershipController::class, 'index']);
        Route::get('/memberships/{id}', [\App\Http\Controllers\MembershipController::class, 'show']);
        Route::patch('/memberships/{id}/approve', [\App\Http\Controllers\MembershipController::class, 'approve']);
        Route::patch('/memberships/{id}/reject', [\App\Http\Controllers\MembershipController::class, 'reject']);
        Route::delete('/memberships/{id}', [\App\Http\Controllers\MembershipController::class, 'destroy']);
        
        // Admin Calendar Routes
        Route::post('/calendar-events', [\App\Http\Controllers\CalendarEventController::class, 'store']);
        Route::put('/calendar-events/{id}', [\App\Http\Controllers\CalendarEventController::class, 'update']);
        Route::delete('/calendar-events/{id}', [\App\Http\Controllers\CalendarEventController::class, 'destroy']);

        // Admin Point Break Routes
        Route::get('/point-break/teams', [\App\Http\Controllers\TeamRegistrationController::class, 'getAdminTeams']);
    });
    // Teams
    Route::prefix('teams')->group(function () {
        Route::get('/stream', [TeamController::class, 'stream']);
        Route::get('/', [TeamController::class, 'index']);
        Route::post('/', [TeamController::class, 'store']);
        Route::post('/join', [TeamController::class, 'join']);
        Route::post('/{id}/approve', [TeamController::class, 'approve']);
        Route::post('/{id}/reject', [TeamController::class, 'reject']);
        Route::post('/{id}/leave', [TeamController::class, 'leave']);
        Route::put('/{id}', [TeamController::class, 'update']);
        Route::delete('/{id}', [TeamController::class, 'destroy']);
        Route::post('/{id}/project', [TeamController::class, 'submitProject']);
    });

    // Registrations
    Route::prefix('registrations')->group(function () {
        Route::get('/individual', [RegistrationController::class, 'index']);
        Route::post('/individual', [RegistrationController::class, 'store']);
    });

    // Notifications
    Route::prefix('notifications')->group(function () {
        Route::get('/stream', [NotificationController::class, 'stream']);
        Route::get('/', [NotificationController::class, 'index']);
        Route::put('/mark-read', [NotificationController::class, 'markRead']);
    });

    // Point Break Team Registration
    Route::prefix('point-break')->group(function () {
        Route::post('/register', [\App\Http\Controllers\TeamRegistrationController::class, 'register']);
        Route::get('/invites', [\App\Http\Controllers\TeamRegistrationController::class, 'getInvites']);
        Route::post('/invites/{id}/accept', [\App\Http\Controllers\TeamRegistrationController::class, 'acceptInvite']);
        Route::post('/invites/{id}/reject', [\App\Http\Controllers\TeamRegistrationController::class, 'rejectInvite']);
        Route::delete('/teams/{id}', [\App\Http\Controllers\TeamRegistrationController::class, 'deleteTeam']);
    });
});
