<?php

namespace App\Http\Controllers\Kardex;

use App\Exports\Kardex\ExportKardex;
use App\Http\Controllers\Controller;
use App\Models\Configuration\Unit;
use App\Models\Configuration\Warehouse;
use App\Models\Kardex\ProductStockInitial;
use App\Models\Product\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class KardexController extends Controller
{

    public function kardex_products($warehouse_id,$year,$month,$search_product){
        // DE LAS ENTRADAS O INGRESOS
        $movimients_products = collect([]);
            // 1 ES INGRESO Y 2 ES SALIDA
        $query_purchases = DB::table("purchase_details")->where("purchase_details.deleted_at",NULL)
                            ->join("purchases","purchase_details.purchase_id","=","purchases.id")
                            ->where("purchases.deleted_at",NULL)
                            ->join("products","purchase_details.product_id","=","products.id")
                            ->where("purchase_details.date_entrega","<>",NULL)
                            ->whereYear("purchase_details.date_entrega",$year)
                            ->whereMonth("purchase_details.date_entrega",$month)
                            ->where("purchases.warehouse_id",$warehouse_id);
        if($search_product){
            $query_purchases->where("products.title","like","%".$search_product."%");
        }
        $query_purchases = $query_purchases->selectRaw("UNIX_TIMESTAMP(purchase_details.date_entrega) as date_entrega_num,
                            DATE_FORMAT(purchase_details.date_entrega,'%D %M %Y') as date_entrega_format,
                            purchase_details.product_id as product_id,
                            purchase_details.unit_id as unit_id,
                            products.title as title_product,
                            1 as type_op,'COMPRA' as tag,
                            SUM(purchase_details.quantity) as product_quantity,
                            AVG(purchase_details.price_unit) as product_price_avg
                            ")
                            ->groupBy('date_entrega_num','unit_id','date_entrega_format','product_id','title_product',
                            'type_op','tag')
                            ->get();
        foreach ($query_purchases as $key => $query_purchase) {
            $movimients_products->push($query_purchase);
        }
        $query_transports = DB::table("transport_details")->where("transport_details.deleted_at",NULL)
                            ->join("transports","transport_details.transport_id","=","transports.id")
                            ->where("transports.deleted_at",NULL)
                            ->join("products","transport_details.product_id","=","products.id")
                            ->where("transport_details.date_entrega","<>",NULL)
                            ->whereYear("transport_details.date_entrega",$year)
                            ->whereMonth("transport_details.date_entrega",$month)
                            ->where("transports.warehouse_end_id",$warehouse_id);
        if($search_product){
            $query_transports->where("products.title","like","%".$search_product."%");
        }
        $query_transports = $query_transports->selectRaw("UNIX_TIMESTAMP(transport_details.date_entrega) as date_entrega_num,
                            DATE_FORMAT(transport_details.date_entrega,'%D %M %Y') as date_entrega_format,
                            transport_details.product_id as product_id,
                            transport_details.unit_id as unit_id,
                            products.title as title_product,
                            1 as type_op,'TRANSPORTE' as tag,
                            SUM(transport_details.quantity) as product_quantity,
                            AVG(transport_details.price_unit) as product_price_avg
                            ")
                            ->groupBy('date_entrega_num','unit_id','date_entrega_format','product_id','title_product',
                            'type_op','tag')
                            ->get();
        foreach ($query_transports as $key => $query_transport) {
            $movimients_products->push($query_transport);
        }
        $query_conversions = DB::table('conversions')->where("conversions.deleted_at",NULL)
                                ->join("products","conversions.product_id","=","products.id")
                                ->where("conversions.created_at","<>",NULL)
                                ->whereYear("conversions.created_at",$year)
                                ->whereMonth("conversions.created_at",$month)
                                ->where("conversions.warehouse_id",$warehouse_id);

        if($search_product){
            $query_conversions->where("products.title","like","%".$search_product."%");
        }

        $query_conversions = $query_conversions->selectRaw("UNIX_TIMESTAMP(conversions.created_at) as date_entrega_num,
                                DATE_FORMAT(conversions.created_at,'%D %M %Y') as date_entrega_format,
                                conversions.product_id as product_id,
                                conversions.unit_end_id as unit_id,
                                products.title as title_product,
                                1 as type_op,'CONVERSION' as tag,
                                SUM(conversions.quantity) as product_quantity,
                                0 as product_price_avg
                                ")
                                ->groupBy('date_entrega_num','unit_id','date_entrega_format','product_id','title_product',
                                'type_op','tag')
                                ->get();
        foreach ($query_conversions as $key => $query_conversion) {
            $movimients_products->push($query_conversion);
        }
        // LAS SALIDAS
        $query_transports_out = DB::table("transport_details")->where("transport_details.deleted_at",NULL)
                            ->join("transports","transport_details.transport_id","=","transports.id")
                            ->where("transports.deleted_at",NULL)
                            ->join("products","transport_details.product_id","=","products.id")
                            ->where("transport_details.date_salida","<>",NULL)
                            ->whereYear("transport_details.date_salida",$year)
                            ->whereMonth("transport_details.date_salida",$month)
                            ->where("transports.warehouse_start_id",$warehouse_id);
        if($search_product){
            $query_transports_out->where("products.title","like","%".$search_product."%");
        }
        $query_transports_out = $query_transports_out->selectRaw("UNIX_TIMESTAMP(transport_details.date_salida) as date_entrega_num,
                            DATE_FORMAT(transport_details.date_salida,'%D %M %Y') as date_entrega_format,
                            transport_details.product_id as product_id,
                            transport_details.unit_id as unit_id,
                            products.title as title_product,
                            2 as type_op,'TRANSPORTE' as tag,
                            SUM(transport_details.quantity) as product_quantity,
                            AVG(transport_details.price_unit) as product_price_avg
                            ")
                            ->groupBy('date_entrega_num','unit_id','date_entrega_format','product_id','title_product',
                            'type_op','tag')
                            ->get();
        foreach ($query_transports_out as $key => $query_transport) {
            $movimients_products->push($query_transport);
        }
        $query_conversions_out = DB::table('conversions')->where("conversions.deleted_at",NULL)
                                ->join("products","conversions.product_id","=","products.id")
                                ->where("conversions.created_at","<>",NULL)
                                ->whereYear("conversions.created_at",$year)
                                ->whereMonth("conversions.created_at",$month)
                                ->where("conversions.warehouse_id",$warehouse_id);

        if($search_product){
            $query_conversions_out->where("products.title","like","%".$search_product."%");
        }

        $query_conversions_out = $query_conversions_out->selectRaw("UNIX_TIMESTAMP(conversions.created_at) as date_entrega_num,
                                DATE_FORMAT(conversions.created_at,'%D %M %Y') as date_entrega_format,
                                conversions.product_id as product_id,
                                conversions.unit_start_id as unit_id,
                                products.title as title_product,
                                2 as type_op,'CONVERSION' as tag,
                                SUM(conversions.quantity_end) as product_quantity,
                                0 as product_price_avg
                                ")
                                ->groupBy('date_entrega_num','unit_id','date_entrega_format','product_id','title_product',
                                'type_op','tag')
                                ->get();
        foreach ($query_conversions_out as $key => $query_conversion) {
            $movimients_products->push($query_conversion);
        }
        $query_despachos = DB::table('proforma_details')->where("proforma_details.deleted_at",NULL)
                            ->join("proformas","proforma_details.proforma_id","=","proformas.id")
                            ->join("products","proforma_details.product_id","=","products.id")
                            ->where("proformas.deleted_at",NULL)
                            ->where("proforma_details.date_entrega","<>",NULL)
                            ->whereYear("proforma_details.date_entrega",$year)
                            ->whereMonth("proforma_details.date_entrega",$month)
                            ->where("proforma_details.warehouse_id",$warehouse_id);

        if($search_product){
            $query_despachos->where("products.title","like","%".$search_product."%");
        }

        $query_despachos = $query_despachos->selectRaw("UNIX_TIMESTAMP(proforma_details.date_entrega) as date_entrega_num,
                                DATE_FORMAT(proforma_details.date_entrega,'%D %M %Y') as date_entrega_format,
                                proforma_details.product_id as product_id,
                                proforma_details.unit_id as unit_id,
                                products.title as title_product,
                                2 as type_op,'CONTRATO' as tag,
                                SUM(proforma_details.quantity) as product_quantity,
                                0 as product_price_avg
                                ")
                                ->groupBy('date_entrega_num','unit_id','date_entrega_format','product_id','title_product',
                                'type_op','tag')
                            ->get();
        foreach ($query_despachos as $key => $query_despacho) {
            $movimients_products->push($query_despacho);
        }
        //CALCULOS Y OPERACIONES PARA LA COLUMNA EXISTENCIA
            // 1.-AGREGAR TODOS LOS REGISTRO EN UNA SOLA VARIABLE
            // 2.-AGRUPAR POR PRODUCTOS
                // 2.1.- AGRUPAR LOS PRODUCTOS SEGUN LA UNIDAD
                //2.2.- ORDENAR LOS MOVIMIENTOS DEL PRODUCTO SEGUN LA FECHA
                // 2.3.- OPERACIONES SEGUN SEA ENTRADA O SALIDA DE LOS MOVIMIENTOS
                    // 2.3.1.- AGREGAR EL MOVIMIENTO CON LOS CAMPOS: FECHA, DETALLE,UNIDAD,INGRESO,SALIDA,EXITENCIA
                // 2.4.- AGREGAR LOS MOVIMIENTOS A UNA COLLECTION SEGUN FORMATO
                    // 2.4.1.- ID DEL PRODUCTO, NOMBRE, SKU,CATEGORIA, MOVIMIENTOS
        $kardex_products = collect([]);
        foreach ($movimients_products->groupBy("product_id") as $key => $movimients_product) {
            // MOVIMIENTOS DE LAS UNIDADES DE UN PRODUCTO
            $movimient_units = collect([]);
            $units = collect([]);
            foreach ($movimients_product->groupBy("unit_id") as $key_unit => $movimients_for_unit) {
                // LISTA DE MOVIMIENTOS DE UNA UNIDAD EN ESPECIFICO
                $movimients = collect([]);
                $STOCK_INITIAL = ProductStockInitial::whereDate("created_at","$year-$month-01")
                                    ->where("product_id",$movimients_for_unit[0]->product_id)
                                    ->where("unit_id",$movimients_for_unit[0]->unit_id)
                                    ->where("warehouse_id",$warehouse_id)
                                    ->first();
                $Qb = $STOCK_INITIAL ? $STOCK_INITIAL->stock : 0;
                $PUb = $STOCK_INITIAL ? $STOCK_INITIAL->price_unit_avg : 0;
                $Tb = round($Qb * $PUb,2);

                // AGREGAMOS EL PRIMERO MOVIMIENTO QUE ES EL STOCK INICIAL
                $movimients->push([
                    "fecha" => Carbon::parse("$year-$month-01")->format('d M Y'),
                    "detalle" => "STOCK INICIAL",
                    "ingreso" => NULL,
                    "salida" => NULL,
                    "existencia" => [
                        "quantity" => $Qb,
                        "price_unit" => $PUb,
                        "total" => $Tb,
                    ],
                ]);
                // ORDENAMOS LOS MOVIMIENTOS SEGUN LA FECHA
                foreach ($movimients_for_unit->sortBy("date_entrega_num") as $movimient) {
                    $Qactual = $movimient->product_quantity;
                    $Qexistencia = 0;
                    if($movimient->type_op == 1){
                        // ENTRADA
                        $Qexistencia = $Qb + $Qactual;
                    }else{
                        //SALIDA
                        $Qexistencia = $Qb - $Qactual;
                    }
                    $PUactual = $movimient->product_price_avg == 0 ? $PUb : $movimient->product_price_avg;
                    $Tactual = round($Qactual * $PUactual,2);

                    $Texistencia = 0;
                    if($movimient->type_op == 1){
                        // ENTRADA
                        $Texistencia = $Tb + $Tactual;
                    }else{
                        // SALIDA
                        $Texistencia = $Tb - $Tactual;
                    }

                    $PUexistencia = $Qexistencia != 0 ? round($Texistencia / $Qexistencia, 2) : 0;

                    $movimients->push([
                        "fecha" => Carbon::parse($movimient->date_entrega_format)->format('d M Y'),//$movimient->date_entrega_format,
                        "detalle" => $movimient->tag,
                        "ingreso" => $movimient->type_op == 1 ? [
                            "quantity" => $Qactual,
                            "price_unit" => $PUactual,
                            "total" => $Tactual,
                        ] : NULL,
                        "salida" => $movimient->type_op == 2 ? [
                            "quantity" => $Qactual,
                            "price_unit" => $PUactual,
                            "total" => $Tactual,
                        ] : NULL,
                        "existencia" => [
                            "quantity" => $Qexistencia,
                            "price_unit" => $PUexistencia,
                            "total" => $Texistencia,
                        ],
                    ]);

                    $Qb = $Qexistencia;
                    $PUb = $PUexistencia;
                    $Tb = $Texistencia;
                }

                $movimient_units->push([
                    "unit_id" => $key_unit,
                    "movimients" => $movimients,
                ]);
                $units->push(Unit::find($key_unit));
            }

            $product = Product::findOrFail($movimients_product[0]->product_id);
            $kardex_products->push([
                "product_id" => $movimients_product[0]->product_id,
                "title" => $movimients_product[0]->title_product,
                "sku" => $product->sku,
                "categoria" => $product->product_categorie->name,
                "movimient_units" => $movimient_units,
                "unit_first" => $units->first(),
                "units" => $units,
            ]);
        }
        return $kardex_products;
    }

    public function index(Request $request){
        // LOS PARAMETROS DE BUSQUEDA
        $warehouse_id = $request->warehouse_id;
        $year = $request->year;
        $month = $request->month;
        $search_product = $request->search_product;

        return response()->json([
            "kardex_products" => $this->kardex_products($warehouse_id,$year,$month,$search_product),
        ]);
        // OPERACIONES DE EXISTENCIAS
    }

    public function export_kardex(Request $request){
        $warehouse_id = $request->get("warehouse_id");
        $year = $request->get("year");
        $month = $request->get("month");
        $search_product = $request->get("search_product");

        $kardex_products = $this->kardex_products($warehouse_id,$year,$month,$search_product);
        return Excel::download(new ExportKardex($kardex_products),"reporte_kardex".uniqid().".xlsx");
    }

    public function config(){

        $warehouses = Warehouse::where("state",1)->get();
        $year = date("Y");
        $month = date("m");

        return response()->json([
            "warehouses" => $warehouses,
            "year" => $year,
            "month" => $month,
        ]);
    }

}
