<?php

namespace App\Http\Controllers\Comission;

use App\Http\Controllers\Controller;
use App\Models\Commission\Commission;
use Illuminate\Http\Request;

class PositionComissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get("search");

        $position_commissions = Commission::where("position","like","%".$search."%")->orderBy("id","desc")->paginate(25);

        return response()->json([
            "total" => $position_commissions->total(),
            "position_commissions" => $position_commissions->map(function($position_commission) {
                return [
                    "id" => $position_commission->id,
                    "position" => $position_commission->position,
                    "state" => $position_commission->state,
                    "amount" => $position_commission->amount,
                    "percentage" => $position_commission->percentage,
                    "created_at" => $position_commission->created_at->format("Y-m-d h:i A")
                ];
            }),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $position_commission = Commission::create($request->all());
        return response()->json([
            "message" => 200,
            "position_commission" => [
                "id" => $position_commission->id,
                "position" => $position_commission->position,
                "state" => 1,//$position_commission->state,
                "amount" => $position_commission->amount,
                "percentage" => $position_commission->percentage,
                "created_at" => $position_commission->created_at->format("Y-m-d h:i A")
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
        $position_commission = Commission::findOrFail($id);
        $position_commission->update($request->all());
        return response()->json([
            "message" => 200,
            "position_commission" => [
                "id" => $position_commission->id,
                "position" => $position_commission->position,
                "state" => $position_commission->state,
                "amount" => $position_commission->amount,
                "percentage" => $position_commission->percentage,
                "created_at" => $position_commission->created_at->format("Y-m-d h:i A")
            ],
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $position_commission = Commission::findOrFail($id);
        $position_commission->delete();
        return response()->json([
            "message" => 200,
        ]);
    }
}
