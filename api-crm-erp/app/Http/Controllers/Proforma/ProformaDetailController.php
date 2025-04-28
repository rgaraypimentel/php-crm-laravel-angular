<?php

namespace App\Http\Controllers\Proforma;

use App\Http\Controllers\Controller;
use App\Models\Proforma\Proforma;
use App\Models\Proforma\ProformaDetail;
use Illuminate\Http\Request;

class ProformaDetailController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request){
        $product = $request->product;
        $proforma_detail = ProformaDetail::create([
            "proforma_id" => $request->proforma_id,
            "product_id" => $product["id"],
            "product_categorie_id" => $product["product_categorie_id"],
            "description" => $request->description,
            "unit_id" => $request->unidad_product,
            "quantity" => $request->quantity,
            "price_unit" => $request->price_unit,
            "discount" => $request->discount,
            "subtotal" => $request->subtotal,
            "impuesto" => $request->impuesto,
            "total" => $request->total,
        ]);
        //100  pagado:10 deuda:90
        // 120
        $proforma = Proforma::findOrFail($request->proforma_id);
        $proforma->update([
            "total" => $proforma->total + $request->total,
            "debt" => $proforma->debt + $request->total,
            "igv" => $proforma->igv + $request->impuesto,
        ]);
        $new_total = $proforma->total;
        $new_impuesto = $proforma->igv;
        $new_debt = $proforma->debt;

        $units = collect([]);
        foreach ($proforma_detail->product->wallets->groupBy("unit_id") as $unit_only) {
            $units->push($unit_only[0]->unit);
        }
        return response()->json([
            "detail" => [
                "id" => $proforma_detail->id,
                "product_id" => $proforma_detail->product_id,
                "product" => [
                    "id" => $proforma_detail->product->id,
                    "title" => $proforma_detail->product->title,
                    "imagen" => env('APP_URL').'storage/'.$proforma_detail->product->imagen,
                    "warehouses" => $proforma_detail->product->warehouses->map(function ($warehouse) {
                        return [
                            "id" => $warehouse->id,
                            "unit" => $warehouse->unit,
                            "warehouse" => $warehouse->warehouse,
                            "quantity" => $warehouse->stock,
                        ];
                    }),
                    "units" => $units,
                ],
                "product_categorie_id" => $proforma_detail->product_categorie_id,
                "product_categorie" => [
                    "id" => $proforma_detail->product_categorie->id,
                    "name" => $proforma_detail->product_categorie->name,
                ],
                "quantity" => $proforma_detail->quantity,
                "price_unit" => $proforma_detail->price_unit,
                "discount" => round($proforma_detail->discount,2),
                "subtotal" => round($proforma_detail->subtotal,2),
                "total" => round($proforma_detail->total,2),
                "description" => $proforma_detail->description,
                "unidad_product" => $proforma_detail->unit_id,
                "unit_id" => $proforma_detail->unit_id,
                "unit" => [
                    "id" => $proforma_detail->unit->id,
                    "name" => $proforma_detail->unit->name,
                ],
                "impuesto" => round($proforma_detail->impuesto,2),
            ],
            "new_total" => $new_total,
            "new_impuesto" => $new_impuesto,
            "new_debt" => $new_debt,
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
    public function update(Request $request,$id){
        $proforma_detail = ProformaDetail::findOrFail($id);
        $old_total = $proforma_detail->total;
        $old_impuesto = $proforma_detail->impuesto;
        $proforma_detail->update([
            "description" => $request->description,
            "unit_id" => $request->unidad_product,
            "quantity" => $request->quantity,
            "price_unit" => $request->price_unit,
            "discount" => $request->discount,
            "subtotal" => $request->subtotal,
            "impuesto" => $request->impuesto,
            "total" => $request->total,
        ]);

        $proforma = Proforma::findOrFail($proforma_detail->proforma_id);
        // 1000 - 300 = 700 + 200 = 900
        // 300
        // 200
        $proforma->update([
            "total" => ($proforma->total - $old_total) + $request->total,
            "debt" => ($proforma->debt - $old_total) + $request->total,
            "igv" => ($proforma->igv - $old_impuesto) + $request->impuesto,
        ]);
        $new_total = $proforma->total;
        $new_impuesto = $proforma->igv;
        $new_debt = $proforma->debt;

        $units = collect([]);
        foreach ($proforma_detail->product->wallets->groupBy("unit_id") as $unit_only) {
            $units->push($unit_only[0]->unit);
        }
        return response()->json([
            "detail" => [
                "id" => $proforma_detail->id,
                "product_id" => $proforma_detail->product_id,
                "product" => [
                    "id" => $proforma_detail->product->id,
                    "title" => $proforma_detail->product->title,
                    "imagen" => env('APP_URL').'storage/'.$proforma_detail->product->imagen,
                    "warehouses" => $proforma_detail->product->warehouses->map(function ($warehouse) {
                        return [
                            "id" => $warehouse->id,
                            "unit" => $warehouse->unit,
                            "warehouse" => $warehouse->warehouse,
                            "quantity" => $warehouse->stock,
                        ];
                    }),
                    "units" => $units,
                ],
                "product_categorie_id" => $proforma_detail->product_categorie_id,
                "product_categorie" => [
                    "id" => $proforma_detail->product_categorie->id,
                    "name" => $proforma_detail->product_categorie->name,
                ],
                "quantity" => $proforma_detail->quantity,
                "price_unit" => $proforma_detail->price_unit,
                "discount" => round($proforma_detail->discount,2),
                "subtotal" => round($proforma_detail->subtotal,2),
                "total" => round($proforma_detail->total,2),
                "description" => $proforma_detail->description,
                "unidad_product" => $proforma_detail->unit_id,
                "unit_id" => $proforma_detail->unit_id,
                "unit" => [
                    "id" => $proforma_detail->unit->id,
                    "name" => $proforma_detail->unit->name,
                ],
                "impuesto" => round($proforma_detail->impuesto,2),
            ],
            "new_total" => $new_total,
            "new_impuesto" => $new_impuesto,
            "new_debt" => $new_debt,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id){

        $proforma_detail = ProformaDetail::findOrFail($id);
        $proforma_detail->delete();

        $proforma = Proforma::findOrFail($proforma_detail->proforma_id);
        // 1000 - 300 = 700 + 200 = 900
        // 300
        // 200
        $proforma->update([
            "total" => ($proforma->total - $proforma_detail->total),
            "debt" => ($proforma->debt - $proforma_detail->total),
            "igv" => ($proforma->igv - $proforma_detail->impuesto),
        ]);
        $new_total = $proforma->total;
        $new_impuesto = $proforma->igv;
        $new_debt = $proforma->debt;

        return response()->json([
            "message" => 200,
            "new_total" => $new_total,
            "new_impuesto" => $new_impuesto,
            "new_debt" => $new_debt,
        ]);
    }
}
