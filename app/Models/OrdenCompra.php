<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrdenCompra extends Model
{
    protected $table = 'orden_compras';

    protected $fillable = [
        'idx', //<--- Directo
        'oc',
        'importe', //<--- Directo
        'moneda',
        'categoria', //<--- Directo
        'proveedor',
        'solicitante', //<--- Directo
        'descripcion', //<--- Directo
        'articulo',
        'gerencia',
        'centroCosto', //<--- Directo
        'partida', //<--- Directo
        'presupuesto',
    ];
}
