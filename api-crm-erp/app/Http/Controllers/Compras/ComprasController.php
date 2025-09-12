<?php

namespace App\Http\Controllers\Compras;

use App\Http\Controllers\Controller;
use App\Http\Resources\Purchase\PurchaseCollection;
use App\Http\Resources\Purchase\PurchaseResource;
use App\Models\Configuration\Provider;
use App\Models\Configuration\Unit;
use App\Models\Configuration\Warehouse;
use App\Models\Purchase\Purchase;
use App\Models\Purchase\PurchaseDetail;
use Illuminate\Http\Request;

class ComprasController extends Controller
{
    public function index(Request $request){
        $warehouse_id = $request->warehouse_id;
        $n_orden = $request->n_orden;
        $provider_id = $request->provider_id;
        $n_comprobant = $request->n_comprobant;
        $start_date = $request->start_date;
        $end_date = $request->end_date;
        $search_product = $request->search_product;

        $purchases = Purchase::filterAdvance($warehouse_id,$n_orden,$provider_id,$n_comprobant,$start_date,$end_date,$search_product)
                                ->orderBy("id","desc")
                                ->paginate(25);

        return response()->json([
            "total" => $purchases->total(),
            "purchases" => PurchaseCollection::make($purchases),
        ]);
    }

    public function config(Request $request){
        $warehouses = Warehouse::where("state",1)->get();
        $providers = Provider::where("state",1)->get();
        $units = Unit::where("state",1)->get();
        return response()->json([
            "warehouses" => $warehouses,
            "providers" => $providers,
            "units" => $units,
            "now" => now()->format("Y-m-d"),
        ]);
    }
    public function show($id){
        $purchase = Purchase::findOrFail($id);
        return response()->json([
            "purchase" => PurchaseResource::make($purchase),
        ]);
    }
    public function store(Request $request){

        $request->request->add(["user_id" => auth("api")->user()->id]);
        $purchase = Purchase::create($request->all());

        $details = $request->details;

        foreach ($details as $key => $detail) {
            PurchaseDetail::create([
                "purchase_id" => $purchase->id,
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

        $purchase = Purchase::findOrFail($id);
        $purchase->update($request->all());

        return response()->json([
            "message" => 200,
        ]);
    }

    public function destroy($id){
        $purchase = Purchase::findOrFail($id);
        if($purchase->state == 3 || $purchase->state == 4){
            return response()->json([
                "message" => 403,
            ]);
        }
        $purchase->delete();

        return response()->json([
            "message" => 200,
        ]);
    }
}
