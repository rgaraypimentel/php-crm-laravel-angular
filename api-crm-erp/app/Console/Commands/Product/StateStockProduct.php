<?php

namespace App\Console\Commands\Product;

use App\Models\Product\Product;
use Illuminate\Console\Command;

class StateStockProduct extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'product:state-stocks';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Asignar al producto 3 status (1 es disponible , 2 por agotar y 3 agotado)';

    /**
     * Execute the console command.
     */
    public function handle()
    {

        $products = Product::where("state",1)->get();

        foreach ($products as $key => $product) {
            if($product->umbral_unit_id){
                $umbral = $product->umbral;//CANTIDAD
                $umbral_unit_id = $product->umbral_unit_id;//LA UNIDAD

                $stock_total = 0;$is_umbral = false;
                // lista de existencias
                foreach ($product->warehouses as $warehouse) {
                    // calcular la suma total de stock
                    $stock_total += $warehouse->stock;
                    // comparar la unidad del umbral
                    if($warehouse->unit_id == $umbral_unit_id){
                        // saber si el umbral es menor o igual al stock disponible
                        if($warehouse->stock <= $umbral){
                            // asignar status de "por agotar"
                            $product->update([
                                "state_stock" => 2,
                            ]);
                            $is_umbral = true;
                        }
                    }
                }
                if($stock_total == 0){
                     // asignar status de "agotado"
                    $product->update([
                        "state_stock" => 3,
                    ]);
                }else{
                     // asignar status de "disponible"
                    if(!$is_umbral){
                        $product->update([
                            "state_stock" => 1,
                        ]);
                    }
                }
            }
        }
    }
}
