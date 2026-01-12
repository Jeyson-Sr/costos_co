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
        return Inertia::render('presupuestos');
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

    Route::get('/cuentaContables', [CostosController::class, 'getCuentaContables'])
        ->name('cuentaContables');

    Route::get('/ordenCompras', [CostosController::class, 'getOrdenCompras'])
        ->name('ordenCompras');

    Route::put('/cuentaContables/{partida}', [CostosController::class, 'updateFondo'])
        ->name('cuentaContables.update');
});

require __DIR__.'/settings.php';
