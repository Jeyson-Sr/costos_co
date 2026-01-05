<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Articulo extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'articulos';
    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'codigo_articulo',
        'desc_articulo',
        'familia_material',
        'unidad_medida',
    ];
}
