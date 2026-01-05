<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CuentaContable extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'cuenta_contables';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'ccontable',
        'desc_contable',
        'partida',
        'centro_costo_id',
    ];
}
