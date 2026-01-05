<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gerencia extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'gerencias';
    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'nombre',
    ];


    public function centrosCosto() {
    return $this->hasMany(CentroCosto::class, 'gerencia_id');
}
}
