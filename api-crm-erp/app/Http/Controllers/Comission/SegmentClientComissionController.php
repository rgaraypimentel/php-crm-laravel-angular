<?php

namespace App\Http\Controllers\Comission;

use App\Http\Controllers\Controller;
use App\Models\Commission\Commission;
use App\Models\Configuration\ClientSegment;
use Illuminate\Http\Request;

class SegmentClientComissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get("search");

        $client_segment_commissions = Commission::whereHas("client_segment",function($suq) use($search){
            $suq->where("name","like","%".$search."%");
        })->orderBy("id","desc")->paginate(25);

        $client_segments = ClientSegment::where("state",1)->get();
        return response()->json([
            "total" => $client_segment_commissions->total(),
            "client_segment_commissions" => $client_segment_commissions->map(function($client_segment_commission) {
                return [
                    "id" => $client_segment_commission->id,
                    "client_segment_id" => $client_segment_commission->client_segment_id,
                    "client_segment" => [
                        "id" =>  $client_segment_commission->client_segment->id,
                        "name" =>  $client_segment_commission->client_segment->name,
                    ],
                    "state" => $client_segment_commission->state,
                    "amount" => $client_segment_commission->amount,
                    "percentage" => $client_segment_commission->percentage,
                    "created_at" => $client_segment_commission->created_at->format("Y-m-d h:i A")
                ];
            }),
            "client_segments" => $client_segments,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $client_segment_commission = Commission::create($request->all());
        return response()->json([
            "message" => 200,
            "client_segment_commission" => [
                "id" => $client_segment_commission->id,
                "client_segment_id" => $client_segment_commission->client_segment_id,
                "client_segment" => [
                    "id" =>  $client_segment_commission->client_segment->id,
                    "name" =>  $client_segment_commission->client_segment->name,
                ],
                "state" => 1,//$client_segment_commission->state,
                "amount" => $client_segment_commission->amount,
                "percentage" => $client_segment_commission->percentage,
                "created_at" => $client_segment_commission->created_at->format("Y-m-d h:i A")
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
        $client_segment_commission = Commission::findOrFail($id);
        $client_segment_commission->update($request->all());
        return response()->json([
            "message" => 200,
            "client_segment_commission" => [
                "id" => $client_segment_commission->id,
                "client_segment_id" => $client_segment_commission->client_segment_id,
                "client_segment" => [
                    "id" =>  $client_segment_commission->client_segment->id,
                    "name" =>  $client_segment_commission->client_segment->name,
                ],
                "state" => $client_segment_commission->state,
                "amount" => $client_segment_commission->amount,
                "percentage" => $client_segment_commission->percentage,
                "created_at" => $client_segment_commission->created_at->format("Y-m-d h:i A")
            ],
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $client_segment_commission = Commission::findOrFail($id);
        $client_segment_commission->delete();
        return response()->json([
            "message" => 200,
        ]);
    }
}
