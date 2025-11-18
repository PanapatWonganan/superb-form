<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LeadController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Public API routes for leads (from frontend form)
Route::prefix('v1')->middleware('throttle:60,1')->group(function () {
    // Public endpoint - create lead from form
    Route::post('/leads', [LeadController::class, 'store']);

    // Protected endpoints - require authentication
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/leads', [LeadController::class, 'index']);
        Route::get('/leads/{lead}', [LeadController::class, 'show']);
        Route::put('/leads/{lead}', [LeadController::class, 'update']);
        Route::delete('/leads/{lead}', [LeadController::class, 'destroy']);
    });
});
