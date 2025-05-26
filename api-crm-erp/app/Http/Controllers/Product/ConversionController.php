<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Resources\Product\Conversion\ConversionCollection;
use App\Http\Resources\Product\Conversion\ConversionResource;
use App\Models\configuration\Unit;
use App\Models\configuration\Warehouse;
use App\Models\Product\Conversion;
use App\Models\Product\ProductWarehouse;
use Illuminate\Http\Request;

class ConversionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $n_orden = $request->n_orden;
        $warehouse_id = $request->warehouse_id;
        $unit_start_id = $request->unit_start_id;
        $unit_end_id = $request->unit_end_id;
        $search_product = $request->search_product;
        $start_date = $request->start_date;
        $end_date = $request->end_date;

        $conversions = Conversion::filterAdvance($n_orden,$warehouse_id,$unit_start_id,
                                $unit_end_id,$search_product,$start_date,$end_date)
                                ->orderBy("id","desc")->paginate(25);

        return response()->json([
            "total" => $conversions->total(),
            "conversions" => ConversionCollection::make($conversions),
        ]);
    }

    public function config(){
        $warehouses = Warehouse::where("state",1)->orderBy("id","desc")->get();
        $units = Unit::where("state",1)->orderBy("id","desc")->get();

        return response()->json([
            "warehouses" => $warehouses,
            "units" => $units->map(function($unit) {
                return [
                    "id" => $unit->id,
                    "name" => $unit->name,
                    "transforms" => $unit->transforms->map(function($transform){
                        return [
                            "id" => $transform->unit_to->id,
                            "name" => $transform->unit_to->name,
                        ];
                    })
                ];
            })
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->request->add(["user_id" => auth('api')->user()->id]);
        $conversion = Conversion::create($request->all());
        // FALTA CODIGO
        // "product_id",
        // "warehouse_id",
        // "unit_start_id",
        // "unit_end_id",
        // "user_id",
        // "quantity_start",
        // "quantity_end",
        // "quantity",
        // "description",

        // DISMINUIR EL STOCK

        $stock_start = ProductWarehouse::where("product_id",$request->product_id)
                            ->where("unit_id",$request->unit_start_id)
                            ->where("warehouse_id",$request->warehouse_id)
                            ->first();
        if($stock_start){
            if(($stock_start->stock - $request->quantity_end) < 0){
                return response()->json([
                    "message" => 403,
                    "message_text" => "NO SE PUEDE CREAR ESTA CONVERSION PORQUE YA NO SE CONTARIA CON EL STOCK",
                ]);
            }
            $stock_start->update([
                "stock" => $stock_start->stock - $request->quantity_end,
            ]);
        }
        // AUMENTAR STOCK
        $stock_end = ProductWarehouse::where("product_id",$request->product_id)
                            ->where("unit_id",$request->unit_end_id)
                            ->where("warehouse_id",$request->warehouse_id)
                            ->first();
        if($stock_end){
            $stock_end->update([
                "stock" => $stock_end->stock + $request->quantity,
            ]);
        }else{
            ProductWarehouse::create([
                "product_id" => $request->product_id,
                "unit_id" => $request->unit_end_id,
                "warehouse_id" => $request->warehouse_id,
                "stock" => $request->quantity
            ]);
        }
        return response()->json([
            "message" => 200,
            "conversion" => ConversionResource::make($conversion),
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
        $conversion = Conversion::findOrFail($id);
        // FALTA CODIGO

        // AUMENTAR EL STOCK
        $stock_start = ProductWarehouse::where("product_id",$conversion->product_id)
                            ->where("unit_id",$conversion->unit_start_id)
                            ->where("warehouse_id",$conversion->warehouse_id)
                            ->first();
        if($stock_start){
            $stock_start->update([
                "stock" => $stock_start->stock + $conversion->quantity_end,
            ]);
        }

        // DISMINUYE STOCK
        $stock_end = ProductWarehouse::where("product_id",$conversion->product_id)
                            ->where("unit_id",$conversion->unit_end_id)
                            ->where("warehouse_id",$conversion->warehouse_id)
                            ->first();
        if($stock_end){
            if(($stock_end->stock - $conversion->quantity) < 0){
                return response()->json([
                    "message" => 403,
                    "message_text" => "NO SE PUEDE ELIMINAR ESTA CONVERSION PORQUE YA NO SE CUENTA CON STOCK",
                ]);
            }
            $stock_end->update([
                "stock" => $stock_end->stock - $conversion->quantity,
            ]);
        }

        $conversion->delete();
        return response()->json([
            "message" => 200,
        ]);
    }
}
