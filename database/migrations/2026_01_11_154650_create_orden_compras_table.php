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
        Schema::create('orden_compras', function (Blueprint $table) {
            $table->id();
                $table->integer('idx')->nullable()->unique();    // <---
                $table->integer('oc')->unique();
                $table->decimal('importe', 12, 2);  // <---
                $table->string('moneda');
                $table->string('categoria');        // <---
                $table->string('proveedor');
                $table->string('solicitante');      // <---
                $table->text('descripcion');        // <---
                $table->string('articulo');
                $table->string('gerencia');
                $table->integer('centroCosto');     // <---
                $table->integer('partida');         // <---
                $table->boolean('presupuesto');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orden_compras');
    }
};
