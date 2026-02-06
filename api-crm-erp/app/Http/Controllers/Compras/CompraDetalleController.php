<?php

namespace App\Http\Controllers\Compras;

use App\Http\Controllers\Controller;
use App\Models\Product\ProductWarehouse;
use App\Models\Purchase\Purchase;
use App\Models\Purchase\PurchaseDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;

class CompraDetalleController extends Controller
{
    public function store(Request $request){
        $product = $request->product;
        $unit = $request->unit;
        $purchase_detail = PurchaseDetail::create([
            "purchase_id" => $request->purchase_id,
            "product_id" => $product["id"],
            "unit_id" => $unit["id"],
            // "description",
            "quantity" => $request->quantity,
            "price_unit" => $request->price_unit,
            "total" => $request->total,
        ]);

        $total = $request->total_purchase;
        $importe = $request->importe;
        $igv = $request->igv;

        $purchase = Purchase::findOrFail($request->purchase_id);
        $purchase->update([
            "total" => $total,
            "importe" => $importe,
            "igv" => $igv,
        ]);
        return response()->json([
            "purchase_detail" => [
                "id" => $purchase_detail->id,
                "purchase_id"  => $purchase_detail->purchase_id,
                "product_id"  => $purchase_detail->product_id,
                "product" => [
                    "id" => $purchase_detail->product->id,
                    "title" => $purchase_detail->product->title,
                ],
                "unit_id"  => $purchase_detail->unit_id,
                "unit" => [
                    "id" => $purchase_detail->unit->id,
                    "name" => $purchase_detail->unit->name,
                ],
                "description"  => $purchase_detail->description,
                "quantity"  => $purchase_detail->quantity,
                "price_unit"  => $purchase_detail->price_unit,
                "total"  => $purchase_detail->total,
                "state"  => $purchase_detail->state,
                "user_entrega"  => $purchase_detail->user_entrega,
                "encargado" => $purchase_detail->encargado ? [
                    "id" => $purchase_detail->encargado->id,
                    "full_name" => $purchase_detail->encargado->name.' '.$purchase_detail->encargado->surname,
                ]: NULL,
                "date_entrega"  => $purchase_detail->date_entrega ? Carbon::parse($purchase_detail->date_entrega)->format("Y-m-d h:i A") : NULL,
            ],
            "total" => $total,
            "importe" => $importe,
            "igv" => $igv,
        ]);
    }
    public function update(Request $request,$id){
        $product = $request->product;
        $unit = $request->unit;
        $purchase_detail = PurchaseDetail::findOrFail($id);
        $purchase_detail->update([
            "product_id" => $product["id"],
            "unit_id" => $unit["id"],
            // "description",
            "quantity" => $request->quantity,
            "price_unit" => $request->price_unit,
            "total" => $request->total,
        ]);

        $total = $request->total_purchase;
        $importe = $request->importe;
        $igv = $request->igv;

        $purchase = Purchase::findOrFail($request->purchase_id);
        $purchase->update([
            "total" => $total,
            "importe" => $importe,
            "igv" => $igv,
        ]);
        return response()->json([
            "purchase_detail" => [
                "id" => $purchase_detail->id,
                "purchase_id"  => $purchase_detail->purchase_id,
                "product_id"  => $purchase_detail->product_id,
                "product" => [
                    "id" => $purchase_detail->product->id,
                    "title" => $purchase_detail->product->title,
                ],
                "unit_id"  => $purchase_detail->unit_id,
                "unit" => [
                    "id" => $purchase_detail->unit->id,
                    "name" => $purchase_detail->unit->name,
                ],
                "description"  => $purchase_detail->description,
                "quantity"  => $purchase_detail->quantity,
                "price_unit"  => $purchase_detail->price_unit,
                "total"  => $purchase_detail->total,
                "state"  => $purchase_detail->state,
                "user_entrega"  => $purchase_detail->user_entrega,
                "encargado" => $purchase_detail->encargado ? [
                    "id" => $purchase_detail->encargado->id,
                    "full_name" => $purchase_detail->encargado->name.' '.$purchase_detail->encargado->surname,
                ]: NULL,
                "date_entrega"  => $purchase_detail->date_entrega ? Carbon::parse($purchase_detail->date_entrega)->format("Y-m-d h:i A") : NULL,
            ],
            "total" => $total,
            "importe" => $importe,
            "igv" => $igv,
        ]);
    }
    public function destroy(Request $request,$id){
        $purchase_detail = PurchaseDetail::findOrFail($id);
        $purchase_detail->delete();

        $total = $request->get("total");
        $importe = $request->get("importe");
        $igv = $request->get("igv");
        $purchase = Purchase::findOrFail($request->get("purchase_id"));
        $purchase->update([
            "total" => $total,
            "importe" => $importe,
            "igv" => $igv,
        ]);

        return response()->json([
            "message" => 200,
            "total" => $total,
            "importe" => $importe,
            "igv" => $igv,
        ]);
    }

    public function entrega(Request $request){

        $purchase_id = $request->purchase_id;
        $purchase_details = $request->purchase_details;//[3]

        $purchase = Purchase::findOrFail($purchase_id);
        $n_max_detail = $purchase->details->count();//2
        $n_detail_entregados = $purchase->detail_entregados->count();//1
        date_default_timezone_set("America/Lima");
        $n_entregado_now = 0;//1
        foreach ($purchase->details as $key => $detail) {
            if(in_array($detail->id,$purchase_details) && !$detail->date_entrega){
                $detail->update([
                    "state" => 2,//ENTREGADO
                    "user_entrega" => auth('api')->user()->id,
                    "date_entrega" => now(),
                ]);
                $n_entregado_now++;

                $is_exits_warehouse = ProductWarehouse::where("product_id",$detail->product_id)
                                                        ->where("unit_id",$detail->unit_id)
                                                        ->where("warehouse_id",$purchase->warehouse_id)
                                                        ->first();
                // Ingreso de la cantidad y unidad solicitada al proveedor, para su contabilización
                if($is_exits_warehouse){
                    $is_exits_warehouse->update([
                        "stock" => $detail->quantity + $is_exits_warehouse->stock,
                    ]);
                }else{
                    ProductWarehouse::create([
                        "product_id" => $detail->product_id,
                        "unit_id" => $detail->unit_id,
                        "warehouse_id" => $purchase->warehouse_id,
                        "stock" => $detail->quantity,
                    ]);
                }
            }
        }
        if($n_max_detail == ($n_detail_entregados + $n_entregado_now)){
            $purchase->update([
                "state" => 4,
                "date_entrega" => now(),
            ]);
        }else{
            $purchase->update([
                "state" => 3,
            ]);
        }

        return response()->json([
            "message" => 200
        ]);
    }
}
