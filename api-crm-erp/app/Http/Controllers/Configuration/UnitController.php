<?php

namespace App\Http\Controllers\configuration;

use App\Http\Controllers\Controller;
use App\Models\configuration\Unit;
use App\Models\COnfiguration\UnitTransform;
use Illuminate\Http\Request;

class UnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get("search");

        $units = Unit::where("name","like","%".$search."%")->orderBy("id","desc")->paginate(25);

        return response()->json([
            "total" => $units->total(),
            "units" => $units->map(function($unit) {
                return [
                    "id" => $unit->id,
                    "name" => $unit->name,
                    "description" => $unit->description,
                    "state" => $unit->state,
                    "transforms" => $unit->transforms->map(function($transfor){
                        $transfor->unit_to = $transfor->unit_to;
                        return $transfor;
                    }),
                    "created_at" => $unit->created_at->format("Y-m-d h:i A")
                ];
            }),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $is_exits_unit = Unit::where("name",$request->name)->first();
        if($is_exits_unit){
            return response()->json([
                "message" => 403,
                "message_text" => "El nombre de la unidad ya existe"
            ]);
        }
        $unit = Unit::create($request->all());
        return response()->json([
            "message" => 200,
            "unit" => [
                "id" => $unit->id,
                "name" => $unit->name,
                "description" => $unit->description,
                "state" => $unit->state,
                "transforms" => $unit->transforms->map(function($transfor){
                    $transfor->unit_to = $transfor->unit_to;
                    return $transfor;
                }),
                "created_at" => $unit->created_at->format("Y-m-d h:i A")
            ],
        ]);
    }

    public function add_transform(Request $request){
        $is_exits_unit = UnitTransform::where("unit_id",$request->unit_id)
                    ->where("unit_to_id",$request->unit_to_id)
                    ->first();
        if($is_exits_unit){
            return response()->json([
                "message" => 403,
                "message_text" => "La unidad seleccionada ya existe"
            ]);
        }
        $unit = UnitTransform::create([
            "unit_id" => $request->unit_id,
            "unit_to_id" => $request->unit_to_id,
        ]);
        return response()->json([
            "message" => 200,
            "unit" => [
                "id" => $unit->id,
                "unit_id" => $unit->unit_id,
                "unit_to_id" => $unit->unit_to_id,
                "unit_to" => $unit->unit_to,
                "created_at" => $unit->created_at->format("Y-m-d h:i A")
            ],
        ]);
    }
    public function delete_transform($id){
        $unit = UnitTransform::findOrFail($id);
        $unit->delete();
        return response()->json([
            "message" => 200
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
        $is_exits_unit = Unit::where("name",$request->name)
                            ->where("id","<>",$id)->first();
        if($is_exits_unit){
            return response()->json([
                "message" => 403,
                "message_text" => "El nombre de la unidad ya existe"
            ]);
        }
        $unit = Unit::findOrFail($id);
        $unit->update($request->all());
        return response()->json([
            "message" => 200,
            "unit" => [
                "id" => $unit->id,
                "name" => $unit->name,
                "description" => $unit->description,
                "state" => $unit->state,
                "transforms" => $unit->transforms->map(function($transfor){
                    $transfor->unit_to = $transfor->unit_to;
                    return $transfor;
                }),
                "created_at" => $unit->created_at->format("Y-m-d h:i A")
            ],
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $unit = Unit::findOrFail($id);
        // VALIDACION POR PRODUCTO
        //COMPRAS
        $unit->delete();
        return response()->json([
            "message" => 200,
        ]);
    }
}
