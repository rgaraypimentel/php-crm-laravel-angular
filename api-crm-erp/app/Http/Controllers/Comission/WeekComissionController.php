<?php

namespace App\Http\Controllers\Comission;

use App\Http\Controllers\Controller;
use App\Models\Commission\Commission;
use Illuminate\Http\Request;

class WeekComissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get("search");

        $week_commissions = Commission::where("week","like","%".$search."%")->orderBy("id","desc")->paginate(25);

        return response()->json([
            "total" => $week_commissions->total(),
            "week_commissions" => $week_commissions->map(function($week_commission) {
                return [
                    "id" => $week_commission->id,
                    "week" => $week_commission->week,
                    "state" => $week_commission->state,
                    "amount" => $week_commission->amount,
                    "percentage" => $week_commission->percentage,
                    "created_at" => $week_commission->created_at->format("Y-m-d h:i A")
                ];
            }),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $week_commission = Commission::create($request->all());
        return response()->json([
            "message" => 200,
            "week_commission" => [
                "id" => $week_commission->id,
                "week" => $week_commission->week,
                "state" => 1,//$week_commission->state
                "amount" => $week_commission->amount,
                "percentage" => $week_commission->percentage,
                "created_at" => $week_commission->created_at->format("Y-m-d h:i A")
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
        $week_commission = Commission::findOrFail($id);
        $week_commission->update($request->all());
        return response()->json([
            "message" => 200,
            "week_commission" => [
                "id" => $week_commission->id,
                "week" => $week_commission->week,
                "state" => $week_commission->state,
                "amount" => $week_commission->amount,
                "percentage" => $week_commission->percentage,
                "created_at" => $week_commission->created_at->format("Y-m-d h:i A")
            ],
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $week_commission = Commission::findOrFail($id);
        $week_commission->delete();
        return response()->json([
            "message" => 200,
        ]);
    }
}
