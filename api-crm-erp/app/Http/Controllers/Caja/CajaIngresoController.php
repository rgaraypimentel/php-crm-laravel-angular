<?php

namespace App\Http\Controllers\Caja;

use App\Http\Controllers\Controller;
use App\Models\Caja\CajaIngreso;
use App\Models\Caja\CajaSucursale;
use Illuminate\Http\Request;

class CajaIngresoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $caja_sucursale_id = $request->get("caja_sucursale_id");

        $ingresos = CajaIngreso::where("caja_sucursale_id",$caja_sucursale_id)->orderBy("id","desc")->get();

        return response()->json([
            "ingresos" => $ingresos->map(function($ingreso){
                $ingreso->created_at_format = $ingreso->created_at->format("Y-m-d h:i A");
                return $ingreso;
            })
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $is_exits = CajaIngreso::where("caja_sucursale_id",$request->caja_sucursale_id)
                                            ->where("description",$request->description)
                                            ->first();
        if($is_exits){
            return response()->json([
                "message" => 403,
                "message_text" => "La descripción ya existe"
            ]);
        }
        $ingreso = CajaIngreso::create($request->all());

        $caja_sucursale = CajaSucursale::find($request->caja_sucursale_id);
        $ingreso_current = $caja_sucursale->ingresos;
        $efectivo_finish_current = $caja_sucursale->efectivo_finish;
        $caja_sucursale->update([
            "ingresos" => $ingreso_current + $ingreso->amount,
            "efectivo_finish" => $efectivo_finish_current + $ingreso->amount,
        ]);
        $ingreso->created_at_format = $ingreso->created_at->format("Y-m-d h:i A");
        return response()->json([
            "message" => 200,
            "ingreso" => $ingreso,
            "caja_sucursale" => $caja_sucursale,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $is_exits = CajaIngreso::where("caja_sucursale_id",$request->caja_sucursale_id)
                ->where("description",$request->description)
                ->where("id","<>",$id)
                ->first();
        if($is_exits){
            return response()->json([
            "message" => 403,
            "message_text" => "La descripción ya existe"
            ]);
        }
        $ingreso = CajaIngreso::findOrFail($id);
        $amount_old = $ingreso->amount;
        $ingreso->update($request->all());
        $amount_new = $ingreso->amount;

        $caja_sucursale = CajaSucursale::find($request->caja_sucursale_id);
        $ingreso_current = $caja_sucursale->ingresos;
        $efectivo_finish_current = $caja_sucursale->efectivo_finish;
        $caja_sucursale->update([
            "ingresos" => $ingreso_current - $amount_old + $amount_new,
            "efectivo_finish" => $efectivo_finish_current - $amount_old + $amount_new,
        ]);
        $ingreso->created_at_format = $ingreso->created_at->format("Y-m-d h:i A");
        return response()->json([
            "message" => 200,
            "ingreso" => $ingreso,
            "caja_sucursale" => $caja_sucursale,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $ingreso = CajaIngreso::findOrFail($id);
        $caja_sucursale = CajaSucursale::find($ingreso->caja_sucursale_id);
        $ingreso_current = $caja_sucursale->ingresos;
        $efectivo_finish_current = $caja_sucursale->efectivo_finish;
        $caja_sucursale->update([
            "ingresos" => $ingreso_current - $ingreso->amount,
            "efectivo_finish" => $efectivo_finish_current - $ingreso->amount,
        ]);
        // VALIDACION POR PROFORMA
        $ingreso->delete();
        return response()->json([
            "message" => 200,
            "caja_sucursale" => $caja_sucursale,
        ]);
    }
}
