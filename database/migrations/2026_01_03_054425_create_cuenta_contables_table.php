<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cuenta_contables', function (Blueprint $table) {
        $table->id();
        $table->string('ccontable'); // Ej: 6251110101
        $table->string('desc_contable');
        $table->string('partida');   // Ej: 76
        $table->foreignId('centro_costo_id')->constrained('centros_costos')->onDelete('cascade');
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cuenta_contables');
    }
};
