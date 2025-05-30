<?php

namespace App\Console\Commands\Kardex;

use App\Models\Kardex\ProductStockInitial;
use App\Models\Product\ProductWarehouse;
use App\Models\Purchase\PurchaseDetail;
use Illuminate\Console\Command;

class ProcessStockInitialOfProducts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:process-stock-initial-of-products';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cada 1 del mes, se va guardar el stock disponible en ese momento';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $product_warehouses = ProductWarehouse::orderBy("id","desc")->get();

        foreach ($product_warehouses as $key => $product_warehouse) {
            $price_unit_avg = 0;
            $date_before_month = now()->subMonth(1);
            $price_unit_avg = PurchaseDetail::where("date_entrega","<>",NULL)
                            ->where("product_id",$product_warehouse->product_id)
                            ->where("unit_id",$product_warehouse->unit_id)
                            ->whereHas("purchase",function($q) use($product_warehouse){
                                $q->where("warehouse_id",$product_warehouse->warehouse_id);
                            })
                            ->whereYear("date_entrega",$date_before_month->format("Y"))
                            ->whereMonth("date_entrega",$date_before_month->format("m"))
                            ->avg("price_unit");
            if(!$price_unit_avg){
                $product_inital_last = ProductStockInitial::where("product_id",$product_warehouse->product_id)
                                    ->where("unit_id",$product_warehouse->unit_id)
                                    ->where("warehouse_id",$product_warehouse->warehouse_id)
                                    ->where("price_unit_avg",">",0)
                                    ->orderBy("id","desc")
                                    ->first();
                if($product_inital_last){
                    $price_unit_avg = $product_inital_last->price_unit_avg;
                }
            }
            ProductStockInitial::create([
                "product_id" => $product_warehouse->product_id,
                "price_unit_avg" => $price_unit_avg ?? 0,
                "unit_id"=> $product_warehouse->unit_id,
                "warehouse_id" => $product_warehouse->warehouse_id,
                "stock" => $product_warehouse->stock
            ]);
        }
        //

    }
}
