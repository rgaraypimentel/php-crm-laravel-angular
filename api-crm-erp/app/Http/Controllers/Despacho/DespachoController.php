<?php

namespace App\Http\Controllers\Despacho;

use App\Http\Controllers\Controller;
use App\Http\Resources\Proforma\ProformaCollection;
use App\Models\Product\ProductWarehouse;
use App\Models\Proforma\Proforma;
use App\Models\Proforma\ProformaDetail;
use Illuminate\Http\Request;

class DespachoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $search = $request->search;
        $client_segment_id = $request->client_segment_id;
        $asesor_id = $request->asesor_id;
        $product_categorie_id = $request->product_categorie_id;
        $search_client = $request->search_client;
        $search_product = $request->search_product;
        $start_date = $request->start_date;
        $end_date = $request->end_date;

        $contracts = Proforma::filterAdvance($search,$client_segment_id,$asesor_id,
                                    $product_categorie_id,$search_client,$search_product,
                                    $start_date,$end_date,null)
                                    ->where("state_proforma",2)
                                    ->where("state_payment",3)
                                    ->orderBy("id","desc")->paginate(25);

        return response()->json([
            "total" => $contracts->total(),
            "contracts" => ProformaCollection::make($contracts),
        ]);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        date_default_timezone_set("America/Lima");
        $warehouse_id = $request->warehouse_id;
        $detail_selected = $request->detail_selected;//[5780,5781]
        $proforma_id = $request->proforma_id;
        // VALIDACIÓN
        $validations = [];
        $proforma_details = ProformaDetail::whereIn("id",$detail_selected)->get();
        foreach ($proforma_details as $key => $proforma_detail) {
            $product_warehouse = ProductWarehouse::where("warehouse_id",$warehouse_id)
                                ->where("unit_id",$proforma_detail->unit_id)
                                ->where("product_id",$proforma_detail->product_id)
                                ->first();
            if($product_warehouse){
                if($product_warehouse->stock < $proforma_detail->quantity){
                    array_push($validations,"El producto ".$proforma_detail->product->title." no cuenta con el stock disponible");
                }
            }else{
                array_push($validations,"El producto ".$proforma_detail->product->title." no cuenta con el stock disponible");
            }
        }
        if(sizeof($validations) > 0){
            return response()->json([
                "message" => 403,
                "validations" => $validations,
            ]);
        }
        // ENTREGA
        $proforma_details = ProformaDetail::whereIn("id",$detail_selected)->get();
        foreach ($proforma_details as $key => $proforma_detail) {
            $product_warehouse = ProductWarehouse::where("warehouse_id",$warehouse_id)
                                ->where("unit_id",$proforma_detail->unit_id)
                                ->where("product_id",$proforma_detail->product_id)
                                ->first();
            if($product_warehouse){
                $product_warehouse->update([
                    "stock" => $product_warehouse->stock - $proforma_detail->quantity,
                ]);
            }
            $proforma_detail->update([
                "date_entrega" => now(),
                "user_entrega" => auth('api')->user()->id,
                "warehouse_id" => $warehouse_id,
            ]);
        }
        $proforma = Proforma::findOrFail($proforma_id);
        $state_despacho = 2;
        $date_entrega = null;
        if($proforma->entregados->count() == $proforma->details->count()){
            $state_despacho = 3;
            $date_entrega = now();
        }

        $proforma->update([
            "state_despacho" => $state_despacho,
            "date_entrega" => $date_entrega,
        ]);
        return response()->json([
            "message" => 200,
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
