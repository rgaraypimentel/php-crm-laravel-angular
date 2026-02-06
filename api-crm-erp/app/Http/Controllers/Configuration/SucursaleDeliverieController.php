<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Configuration\SucursaleDeliverie;

class SucursaleDeliverieController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get("search");

        $sucursal_deliveries = SucursaleDeliverie::where("name","like","%".$search."%")->orderBy("id","desc")->paginate(25);

        return response()->json([
            "total" => $sucursal_deliveries->total(),
            "sucursal_deliveries" => $sucursal_deliveries->map(function($sucursal) {
                return [
                    "id" => $sucursal->id,
                    "name" => $sucursal->name,
                    "address" => $sucursal->address,
                    "state" => $sucursal->state,
                    "created_at" => $sucursal->created_at->format("Y-m-d h:i A")
                ];
            }),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $is_exits_sucursal = SucursaleDeliverie::where("name",$request->name)->first();
        if($is_exits_sucursal){
            return response()->json([
                "message" => 403,
                "message_text" => "El nombre del lugar de entrega ya existe"
            ]);
        }
        $sucursal_deliverie = SucursaleDeliverie::create($request->all());
        return response()->json([
            "message" => 200,
            "sucursal" => [
                "id" => $sucursal_deliverie->id,
                "name" => $sucursal_deliverie->name,
                "address" => $sucursal_deliverie->address,
                "state" => $sucursal_deliverie->state ?? 1,
                "created_at" => $sucursal_deliverie->created_at->format("Y-m-d h:i A")
            ],
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
        $is_exits_sucursal = SucursaleDeliverie::where("name",$request->name)
                            ->where("id","<>",$id)->first();
        if($is_exits_sucursal){
            return response()->json([
                "message" => 403,
                "message_text" => "El nombre del lugar de entrega ya existe"
            ]);
        }
        $sucursal_deliverie = SucursaleDeliverie::findOrFail($id);
        $sucursal_deliverie->update($request->all());
        return response()->json([
            "message" => 200,
            "sucursal" => [
                "id" => $sucursal_deliverie->id,
                "name" => $sucursal_deliverie->name,
                "address" => $sucursal_deliverie->address,
                "state" => $sucursal_deliverie->state,
                "created_at" => $sucursal_deliverie->created_at->format("Y-m-d h:i A")
            ],
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $sucursal_deliverie = SucursaleDeliverie::findOrFail($id);
        // VALIDACION POR PROFORMA
        $sucursal_deliverie->delete();
        return response()->json([
            "message" => 200,
        ]);
    }
}
