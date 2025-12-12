<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('costos', function () {
        return Inertia::render('costos');
    })->name('costos');
    Route::get('presupuestos', function () {
        return Inertia::render('presupuestos');
    })->name('presupuestos');


});

require __DIR__.'/settings.php';
