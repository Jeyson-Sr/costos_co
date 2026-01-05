<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CentroCosto extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'centros_costos';
    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'ccosto',
        'desc_cc',
        'gerencia_id',
    ];

    public function cuentas() {
    return $this->hasMany(CuentaContable::class, 'centro_costo_id');
}
}
