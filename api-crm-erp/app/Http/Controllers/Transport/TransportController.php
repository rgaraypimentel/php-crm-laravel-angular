<?php

namespace App\Http\Controllers\Transport;

use App\Http\Controllers\Controller;
use App\Http\Resources\Transport\TransportCollection;
use App\Http\Resources\Transport\TransportResource;
use App\Models\Configuration\Unit;
use App\Models\Configuration\Warehouse;
use App\Models\Product\ProductWarehouse;
use App\Models\Transport\Transport;
use App\Models\Transport\TransportDetail;
use Illuminate\Http\Request;

class TransportController extends Controller
{
    public function index(Request $request){
        $warehouse_start_id = $request->warehouse_start_id;
        $warehouse_end_id = $request->warehouse_end_id;
        $n_orden = $request->n_orden;
        $start_date = $request->start_date;
        $end_date = $request->end_date;
        $search_product = $request->search_product;

        $transports = Transport::filterAdvance($warehouse_start_id,$warehouse_end_id,$n_orden,$start_date,$end_date,$search_product)
                                ->orderBy("id","desc")
                                ->paginate(25);

        return response()->json([
            "total" => $transports->total(),
            "transports" => TransportCollection::make($transports),
        ]);
    }

    public function config(Request $request){
        $warehouses = Warehouse::where("state",1)->get();
        $units = Unit::where("state",1)->get();
        return response()->json([
            "warehouses" => $warehouses,
            "units" => $units,
            "now" => now()->format("Y-m-d"),
        ]);
    }
    public function show($id){
        $transport = Transport::findOrFail($id);
        return response()->json([
            "transport" => TransportResource::make($transport),
        ]);
    }
    public function store(Request $request){

        $request->request->add(["user_id" => auth("api")->user()->id]);
        $transport = Transport::create($request->all());

        $details = $request->details;

        foreach ($details as $key => $detail) {
            TransportDetail::create([
                "transport_id" => $transport->id,
                "product_id" => $detail["product"]["id"],
                "unit_id" => $detail["unit"]["id"],
                // "description",
                "quantity" => $detail["quantity"],
                "price_unit" => $detail["price_unit"],
                "total" => $detail["total"],
            ]);
        }

        return response()->json([
            "message" => 200
        ]);
    }

    public function update(Request $request,$id){

        $transport = Transport::findOrFail($id);
        // SALIDA
        if($transport->state < 3 && $request->state == 3){
            // ES LA VALIDACIÓN
            foreach ($transport->details as $key => $detail) {
                $product_warehouse = ProductWarehouse::where("product_id",$detail->product_id)
                                                        ->where("unit_id",$detail->unit_id)
                                                        ->where("warehouse_id",$transport->warehouse_start_id)
                                                        ->first();
                if(!$product_warehouse){
                    return response()->json([
                        "message" => 403,
                        "message_text" => "EL PRODUCTO '".$detail->product->title."' NO CUENTA CON LA CANTIDAD PARA ATENDER"
                    ]);
                }

                if($product_warehouse->stock < $detail->quantity){
                    return response()->json([
                        "message" => 403,
                        "message_text" => "EL PRODUCTO '".$detail->product->title."' NO CUENTA CON LA CANTIDAD PARA ATENDER"
                    ]);
                }
            }
            date_default_timezone_set("America/Lima");
            foreach ($transport->details as $key => $detail) {
                $product_warehouse = ProductWarehouse::where("product_id",$detail->product_id)
                                                    ->where("unit_id",$detail->unit_id)
                                                    ->where("warehouse_id",$transport->warehouse_start_id)
                                                    ->first();
                $product_warehouse->update([
                    "stock" => $product_warehouse->stock - $detail->quantity,
                ]);
                $detail->update([
                    "state" => 2,
                    "user_salida" => auth("api")->user()->id,
                    "date_salida" => now(),
                ]);
            }
        }
        // ENTREGA
        if($transport->state < 6 && $request->state == 6){
            foreach ($transport->details as $key => $detail) {
                $product_warehouse = ProductWarehouse::where("product_id",$detail->product_id)
                                                    ->where("unit_id",$detail->unit_id)
                                                    ->where("warehouse_id",$transport->warehouse_end_id)
                                                    ->first();
                if(!$product_warehouse){
                    ProductWarehouse::create([
                        "product_id" => $detail->product_id,
                        "unit_id" => $detail->unit_id,
                        "warehouse_id" => $transport->warehouse_end_id,
                        "stock" => $detail->quantity,
                    ]);
                }else{
                    $product_warehouse->update([
                        "stock" => $product_warehouse->stock + $detail->quantity,
                    ]);
                }
                $detail->update([
                    "state" => 3,
                    "user_entrega" => auth("api")->user()->id,
                    "date_entrega" => now(),
                ]);
            }
            $transport->update([
                "date_entrega" => now(),
            ]);
        }
        $transport->update($request->all());
        return response()->json([
            "message" => 200,
        ]);
    }

    public function destroy($id){
        $transport = Transport::findOrFail($id);
        if($transport->state == 3 || $transport->state == 4){
            return response()->json([
                "message" => 403,
            ]);
        }
        $transport->delete();

        return response()->json([
            "message" => 200,
        ]);
    }
}
