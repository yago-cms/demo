
<?php

use App\Http\Controllers\BackendController;
use App\Http\Controllers\FrontendController;
use Illuminate\Support\Facades\Route;
use Symfony\Component\Process\Process;

// Admin
Route::prefix('admin')
    ->name('admin.')
    // ->middleware(['auth:sanctum'])
    ->group(function () {
        Route::get('', [BackendController::class, 'index']);
        Route::get('/revision/page/{id}', [FrontendController::class, 'getPageRevision']); // TODO: protect this route
        Route::get('/{any}', [BackendController::class, 'index'])->where('any', '.*');
    });

// Frontend
Route::get('/', [FrontendController::class, 'index']);

Route::get('{route}', [FrontendController::class, 'getPage'])
    ->where('route', '([A-Za-z0-9\-\/ÅÄÖåäö]+)');
