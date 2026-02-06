<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Support\Str;
use App\Models\Product\Product;
use Illuminate\Database\Seeder;
use App\Models\Proforma\Proforma;
use App\Models\Proforma\ProformaDetail;
use App\Models\Proforma\ProformaPayment;
use App\Models\Proforma\ProformaDeliverie;
use App\Models\Configuration\MethodPayment;
use App\Models\Configuration\SucursaleDeliverie;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\File;

class ProformaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Proforma::factory()->count(1000)->create()->each(function($p) {
            $faker = \Faker\Factory::create();
            $n_days = $faker->randomElement([1,2,3,4,5]);

            $region_random = $faker->randomElement([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]);

            $REGIONES = File::json(base_path('public/JSON/regiones.json'));
            $PROVINCIAS = File::json(base_path('public/JSON/provincias.json'));
            $DISTRITOS = File::json(base_path('public/JSON/distritos.json'));

            $REGION_SELECTED = null;$PROVINCIA_SELECTED = null;$DISTRITO_SELECTED = null;
            foreach ($REGIONES as $key => $REGION) {
                if($key == $region_random){
                    $REGION_SELECTED = $REGION;
                    break;
                }
            }
            foreach ($PROVINCIAS as $key => $PROVINCIA) {
                if($REGION_SELECTED && $PROVINCIA["department_id"] == $REGION_SELECTED["id"]){
                    $PROVINCIA_SELECTED = $PROVINCIA;
                    break;
                }
            }
            foreach ($DISTRITOS as $key => $DISTRITO) {
                if($REGION_SELECTED && $DISTRITO["department_id"] == $REGION_SELECTED["id"] &&
                $PROVINCIA_SELECTED && $DISTRITO["province_id"] == $PROVINCIA_SELECTED["id"]){
                    $DISTRITO_SELECTED = $DISTRITO;
                    break;
                }
            }
            $proforma_deliverie = ProformaDeliverie::create([
                "proforma_id" => $p->id,
                "sucursale_deliverie_id" => SucursaleDeliverie::where("state",1)->inRandomOrder()->first()->id,
                "date_entrega" => Carbon::parse($p->created_at)->addDay($n_days),
                "date_envio" => Carbon::parse($p->created_at)->addDay($n_days+2),
                "address" => $faker->word(),

                "agencia" => $faker->randomElement(['Olva Courier','Shalom','FedEx','Scharff','DHL']),
                "full_name_encargado" => $faker->name().' '.$faker->lastName(),
                "documento_encargado" => Str::random(8),
                "telefono_encargado" => $faker->phoneNumber(),
            ]);

            if($proforma_deliverie->sucursale_deliverie_id == 6){
                $proforma_deliverie->update([
                    "ubigeo_region" => $REGION_SELECTED ? $REGION_SELECTED["id"] : NULL,
                    "ubigeo_provincia" => $PROVINCIA_SELECTED ? $PROVINCIA_SELECTED["id"]: NULL,
                    "ubigeo_distrito" => $DISTRITO_SELECTED ? $DISTRITO_SELECTED["id"]: NULL,
                    "region" => $REGION_SELECTED ? $REGION_SELECTED["name"] : NULL,
                    "provincia" => $PROVINCIA_SELECTED ? $PROVINCIA_SELECTED["name"]: NULL,
                    "distrito" => $DISTRITO_SELECTED ? $DISTRITO_SELECTED["name"]: NULL,
                ]);
            }

            $num_items = $faker->randomElement([1,2,3,4,5]);

            $sum_total_sale = 0;$igv_total = 0;
            for ($i=0; $i < $num_items; $i++) { 
                $quantity = $faker->randomElement([1,2,3,4,5,6,7,8,9,10]);
                $product = Product::inRandomOrder()->first();
                $discount = $this->getDiscount($product);
                $warehouse = $product->warehouses->first();

                $subtotal = $product->price_general - $discount;
                $proforma_detail = ProformaDetail::create([
                    "proforma_id" => $p->id,
                    "product_id" => $product->id,
                    "product_categorie_id" => $product->product_categorie_id,
                    "quantity" => $quantity,
                    "price_unit" => $product->price_general,
                    "discount" => $discount,
                    "subtotal" => round($subtotal,2),
                    "total"  => round((($subtotal + ($subtotal* $product->importe_iva*0.01)) * $quantity),2),
                    "description" => $faker->text($maxNbChars = 30),
                    "unit_id" => $warehouse ? $warehouse->unit_id : NULL,
                    "impuesto" => $product->importe_iva > 0 ? ($subtotal* $product->importe_iva*0.01) : 0 ,
                    "created_at" => $p->created_at,
                    "updated_at" => $p->updated_at,
                ]);
                $sum_total_sale += $proforma_detail->total;
                $igv_total += $proforma_detail->impuesto;
            }

            $proforma = Proforma::findOrFail($p->id);
            
            $payment_complete = $faker->randomElement([1,2]);

            if($payment_complete == 1 || $p->state_proforma == 1){
                $proforma_payment = ProformaPayment::create([
                    "proforma_id" => $p->id,
                    "method_payment_id" => MethodPayment::where("state",1)->inRandomOrder()->first()->id,
                    "banco_id" => NULL ,
                    "amount" => $sum_total_sale*0.45,
                    "n_transaccion" => $faker->text($maxNbChars = 10),
                ]);
            }else{
                $proforma_payment = ProformaPayment::create([
                    "proforma_id" => $p->id,
                    "method_payment_id" => MethodPayment::where("state",1)->inRandomOrder()->first()->id,
                    "banco_id" => NULL ,
                    "amount" => $sum_total_sale,
                    "n_transaccion" => $faker->text($maxNbChars = 10),
                ]);
            }

            $n_days_v = $faker->randomElement([2,3,4,5,14,15]);
            $debt = $sum_total_sale - $proforma_payment->amount;
            // falta incluir la fecha de validación junto con la fecha de pago completo
            $proforma->update([
                "subtotal" => $sum_total_sale,
                "total" => $sum_total_sale,
                "igv" => $igv_total,
                "debt" => $debt,
                "paid_out" => $proforma_payment->amount,
                "state_payment" => $payment_complete == 1 || $p->state_proforma == 1 ? 2 : 3,
                "date_validation" => $p->state_proforma == 2 ? Carbon::parse($p->created_at)->addDay(1) : NULL,
                "date_pay_complete" => $payment_complete == 2 && $p->state_proforma == 2 ? Carbon::parse($p->created_at)->addDay($n_days_v) : NULL,
            ]);
            
        });
        // php artisan db:seed --class=ProformaSeeder
    }

    public function getDiscount($product){
        if($product->max_discount > 0){
            return ($product->price_general*$product->max_discount*0.01);
        }
        return 0;
    }
}
