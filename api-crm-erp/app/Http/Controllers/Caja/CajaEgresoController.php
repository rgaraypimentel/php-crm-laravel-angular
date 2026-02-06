<?php

namespace App\Http\Controllers\Caja;

use App\Http\Controllers\Controller;
use App\Models\Caja\CajaEgreso;
use App\Models\Caja\CajaSucursale;
use Illuminate\Http\Request;

class CajaEgresoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $caja_sucursale_id = $request->get("caja_sucursale_id");

        $egresos = CajaEgreso::where("caja_sucursale_id",$caja_sucursale_id)->orderBy("id","desc")->get();

        return response()->json([
            "egresos" => $egresos->map(function($ingreso){
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
        $is_exits = CajaEgreso::where("caja_sucursale_id",$request->caja_sucursale_id)
                                            ->where("description",$request->description)
                                            ->first();
        if($is_exits){
            return response()->json([
                "message" => 403,
                "message_text" => "La descripción ya existe"
            ]);
        }
        $egreso = CajaEgreso::create($request->all());

        $caja_sucursale = CajaSucursale::find($request->caja_sucursale_id);
        $egreso_current = $caja_sucursale->egresos;
        $efectivo_finish_current = $caja_sucursale->efectivo_finish;
        $caja_sucursale->update([
            "egresos" => $egreso_current + $egreso->amount,
            "efectivo_finish" => $efectivo_finish_current - $egreso->amount,
        ]);
        $egreso->created_at_format = $egreso->created_at->format("Y-m-d h:i A");
        return response()->json([
            "message" => 200,
            "egreso" => $egreso,
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
        $is_exits = CajaEgreso::where("caja_sucursale_id",$request->caja_sucursale_id)
                ->where("description",$request->description)
                ->where("id","<>",$id)
                ->first();
        if($is_exits){
            return response()->json([
            "message" => 403,
            "message_text" => "La descripción ya existe"
            ]);
        }
        $egreso = CajaEgreso::findOrFail($id);
        $amount_old = $egreso->amount;
        $egreso->update($request->all());
        $amount_new = $egreso->amount;

        $caja_sucursale = CajaSucursale::find($request->caja_sucursale_id);
        $egreso_current = $caja_sucursale->egresos;
        $efectivo_finish_current = $caja_sucursale->efectivo_finish;
        $caja_sucursale->update([
            "egresos" => $egreso_current - $amount_old + $amount_new,
            "efectivo_finish" => $efectivo_finish_current + $amount_old - $amount_new,
        ]);
        $egreso->created_at_format = $egreso->created_at->format("Y-m-d h:i A");
        return response()->json([
            "message" => 200,
            "egreso" => $egreso,
            "caja_sucursale" => $caja_sucursale,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $egreso = CajaEgreso::findOrFail($id);
        $caja_sucursale = CajaSucursale::find($egreso->caja_sucursale_id);
        $egreso_current = $caja_sucursale->egresos;
        $efectivo_finish_current = $caja_sucursale->efectivo_finish;
        $caja_sucursale->update([
            "egresos" => $egreso_current - $egreso->amount,
            "efectivo_finish" => $efectivo_finish_current + $egreso->amount,
        ]);
        // VALIDACION POR PROFORMA
        $egreso->delete();
        return response()->json([
            "message" => 200,
            "caja_sucursale" => $caja_sucursale,
        ]);
    }
}
