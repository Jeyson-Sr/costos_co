<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Models\Articulo;
use App\Models\CategoriaCompra;
use App\Models\CentroCosto;
use App\Models\CuentaContable;
use App\Models\Gerencia;
use App\Models\Proveedor;


class CostosController extends Controller
{



    /**
     * --------------------------------------------------------------------------
     * GET endpoint route 
     * --------------------------------------------------------------------------
     */
        public function getPartidasPresupuestales()
    {
        $data = Gerencia::with(['centrosCosto.cuentas'])->get();

        $partidasPresupuestales = $data->map(function ($gerencia) {
            return [
                'gerencia' => $gerencia->nombre,
                'centrosCosto' => $gerencia->centrosCosto->map(function ($cc) {
                    return [
                        'ccosto' => $cc->ccosto,
                        'desc_cc' => $cc->desc_cc,
                        'cuentas' => $cc->cuentas->map(function ($cuenta) {
                            return [
                                'ccontable' => $cuenta->ccontable,
                                'desc_contable' => $cuenta->desc_contable,
                                'partida' => $cuenta->partida,
                            ];
                        })
                    ];
                })
            ];
        });

        return response()->json($partidasPresupuestales);
    }

    //     public function getArticulos()
    // {
    //     $data = Articulo::get();

    //     $articulos = $data->map(function ($articulo) {
    //         return [
    //             'id' => $articulo->id,
    //             'codigoArticulo' => $articulo->codigo_articulo,
    //             'descArticulo' => $articulo->desc_articulo,
    //             'familiaMaterial' => $articulo->familia_material,
    //             'unidadMedida' => $articulo->unidad_medida,
    //         ];
    //     });

    //     return response()->json($articulos);
    // }
    

    public function getArticulos()
{
    $articulos = Articulo::all();
    return response()->json($articulos); // Devuelve JSON puro para que Axios lo lea
}


        public function getCategorias()
    {
        $data = CategoriaCompra::get();



        $categorias = $data->map(function ($categoria) {
            return [
                'id' => $categoria->id,
                'value' => $categoria->name_categoria,
                'label' => $categoria->name_categoria,
            ];
        });

        return response()->json($categorias);

    }


        public function getProveedors()
    {
        $data = Proveedor::get();

        $proveedors = $data->map(function ($proveedor) {
            return [
                'id' => $proveedor->id,
                'codProveedor' => $proveedor->cod_proveedors,
                'descProveedor' => $proveedor->desc_proveedor,
            ];
        });

        return response()->json($proveedors);
    }



    public function getCuentaContables()
    {
        $data = CuentaContable::get();
        

        $cuentasContables = $data->map(function ($cuentaContable) {
            return [
                'id' => $cuentaContable->id,
                'ccontable' => $cuentaContable->ccontable,
                'desc_contable' => $cuentaContable->desc_contable,
                'partida' => $cuentaContable->partida,
                'fondo' => $cuentaContable->fondo,
            ];
        });

        return response()->json($cuentasContables);
    }







    /**
     * --------------------------------------------------------------------------
     * PUT endpoint route 
     * --------------------------------------------------------------------------
     */

    // Tu ruta: /articulos/{articulo}
    public function updateArticulo(Request $request, Articulo $articulo)
    {
        $validated = $request->validate([
            'codigo_articulo'  => 'required|string',
            'desc_articulo'    => 'required|string',
            'familia_material' => 'nullable|string',
            'unidad_medida'    => 'nullable|string',
        ]);

        $articulo->update($validated);

        return redirect()->back()->with('success', 'Artículo actualizado');
    }


    public function updateFondo(Request $request, $partida)
    {
        $request->validate([
            'fondo' => 'required|numeric|min:0',
        ]);

        $cuenta = CuentaContable::where('partida', $partida)->firstOrFail();
        $cuenta->update(['fondo' => $request->fondo]);

        return response()->json(['message' => 'Fondo actualizado']);
    }

}