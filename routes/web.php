<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\CostosController;



Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('costos');
    })->name('dashboard');
    Route::get('costos', function () {
        return Inertia::render('costos');
    })->name('costos');
    Route::get('presupuestos', function () {
        return Inertia::render('presupuestos');
    })->name('presupuestos');



    Route::get('/partidaPresupuestal', [CostosController::class, 'getPartidasPresupuestales'])
        ->name('partidaPresupuestal');

    Route::get('/articulos', [CostosController::class, 'getArticulos'])
        ->name('articulos');

    Route::get('/categorias', [CostosController::class, 'getCategorias'])
        ->name('categorias');
        
    Route::get('/proveedors', [CostosController::class, 'getProveedors'])
        ->name('proveedors');
});

require __DIR__.'/settings.php';
