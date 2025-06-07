<?php

namespace App\Http\Controllers\Kpi;

use App\Http\Controllers\Controller;
use App\Models\Configuration\SucursaleDeliverie;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class KpiController extends Controller
{
    public function config_all() {
        $sucursale_deliveries = SucursaleDeliverie::whereNotIn("id",[5,6])->orderBy("id","desc")->get();
        return response()->json([
            "sucursale_deliveries" => $sucursale_deliveries,
            "year" => date("Y"),
            "month" => date("m"),
        ]);
    }
    //
    public function information_general(Request $request){
        $year = $request->year;
        $month = $request->month;

        $total_purchase = DB::table("purchases")->where("purchases.deleted_at",NULL)
                                ->where("purchases.state",">",2)
                                ->whereYear("purchases.created_at",$year)
                                ->whereMonth("purchases.created_at",$month)
                                ->sum("purchases.total");
        $total_clients = DB::table("clients")->where("clients.deleted_at",NULL)
                            ->whereYear("clients.created_at",$year)
                            ->whereMonth("clients.created_at",$month)
                            ->count();
        $total_sales = DB::table("proformas")->where("proformas.deleted_at",NULL)
                            ->where("proformas.state_proforma",2)
                            ->where("proformas.state_payment",3)
                            ->whereYear("proformas.created_at",$year)
                            ->whereMonth("proformas.created_at",$month)
                            ->sum("proformas.total");

        $sucursal_most_sales = DB::table("proformas")->where("proformas.deleted_at",NULL)
                            ->join("proforma_deliveries","proforma_deliveries.proforma_id","=","proformas.id")
                            ->join("sucursale_deliveries","proforma_deliveries.sucursale_deliverie_id","=","sucursale_deliveries.id")
                            ->where("proformas.state_proforma",2)
                            ->where("proformas.state_payment",3)
                            ->whereYear("proformas.created_at",$year)
                            ->whereMonth("proformas.created_at",$month)
                            ->whereNotIn("proforma_deliveries.sucursale_deliverie_id",[5,6])
                            ->selectRaw("proforma_deliveries.sucursale_deliverie_id as sucursale_deliverie_id,
                            sucursale_deliveries.name as sucursale_name,
                            ROUND(SUM(proformas.total),2) as total_sales,
                            COUNT(*) as count_contratos
                            ")
                            ->groupBy("sucursale_deliverie_id","sucursale_name")
                            ->orderBy("total_sales","desc")
                            ->take(1)
                            ->get();

        return response()->json([
            "sucursal_most_sales" => $sucursal_most_sales->first(),
            "total_sales" => round($total_sales,2),
            "total_purchase" => round($total_purchase,2),
            "total_clients" => $total_clients,
        ]);
    }

    public function sale_x_sucursales(Request $request){
        $year = $request->year;
        $month = $request->month;

        $sale_sucursales = DB::table("proformas")->where("proformas.deleted_at",NULL)
                            ->join("proforma_deliveries","proforma_deliveries.proforma_id","=","proformas.id")
                            ->join("sucursale_deliveries","proforma_deliveries.sucursale_deliverie_id","=","sucursale_deliveries.id")
                            ->where("proformas.state_proforma",2)
                            ->where("proformas.state_payment",3)
                            ->whereYear("proformas.created_at",$year)
                            ->whereMonth("proformas.created_at",$month)
                            ->whereNotIn("proforma_deliveries.sucursale_deliverie_id",[5,6])
                            ->selectRaw("proforma_deliveries.sucursale_deliverie_id as sucursale_deliverie_id,
                            sucursale_deliveries.name as sucursale_name,
                            ROUND(SUM(proformas.total),2) as total_sales,
                            COUNT(*) as count_contratos
                            ")
                            ->groupBy("sucursale_deliverie_id","sucursale_name")
                            ->orderBy("total_sales","desc")
                            ->get();
        $total_sale_sucursales = $sale_sucursales->sum("total_sales");

        $date_last = Carbon::parse($year."-".$month."-01")->subMonth();

        $total_sales_sucursales_month_last = DB::table("proformas")->where("proformas.deleted_at",NULL)
                                            ->join("proforma_deliveries","proforma_deliveries.proforma_id","=","proformas.id")
                                            ->join("sucursale_deliveries","proforma_deliveries.sucursale_deliverie_id","=","sucursale_deliveries.id")
                                            ->where("proformas.state_proforma",2)
                                            ->where("proformas.state_payment",3)
                                            ->whereYear("proformas.created_at",$date_last->format("Y"))
                                            ->whereMonth("proformas.created_at",$date_last->format("m"))
                                            ->whereNotIn("proforma_deliveries.sucursale_deliverie_id",[5,6])
                                            ->sum("proformas.total");
        $percentageV = 0;
        // 100
        // 50
        // 100 - 50 = 50/100 = 0.5 * 100 = 50
        if($total_sale_sucursales > 0){
            $percentageV = round((($total_sale_sucursales - $total_sales_sucursales_month_last)/$total_sale_sucursales)*100,2);
        }
        return response()->json([
            "percentageV" => $percentageV,
            "total_sales_sucursales_month_last" => round($total_sales_sucursales_month_last,2),
            "total_sale_sucursales" => round($total_sale_sucursales,2),
            "sale_sucursales" => $sale_sucursales,
        ]);
    }

    public function sale_x_day_of_month(Request $request){
        $year = $request->year;
        $month = $request->month;
        $sucursale_deliverie_id =$request->sucursale_deliverie_id;


        $sales_for_day_month = DB::table("proformas")->where("proformas.deleted_at",NULL)
                                ->join("proforma_deliveries","proforma_deliveries.proforma_id","=","proformas.id")
                                ->where("proformas.state_proforma",2)
                                ->where("proformas.state_payment",3)
                                ->whereYear("proformas.created_at",$year)
                                ->whereMonth("proformas.created_at",$month);
        if($sucursale_deliverie_id){
            $sales_for_day_month->where("proforma_deliveries.sucursale_deliverie_id",$sucursale_deliverie_id);
        }

        $sales_for_day_month = $sales_for_day_month->selectRaw("
                                    DATE_FORMAT(proformas.created_at,'%Y-%m-%d') as created_format,
                                    DATE_FORMAT(proformas.created_at,'%m-%d') as day_created_format,
                                    ROUND(SUM(proformas.total),2) as total_sales,
                                    COUNT(*) as count_contratos
                                ")
                                ->groupBy("created_format","day_created_format")
                                ->get();
        $total_sales_current = round($sales_for_day_month->sum("total_sales"),2);
        $date_last = Carbon::parse($year."-".$month."-01")->subMonth();

        $total_sales_before = DB::table("proformas")->where("proformas.deleted_at",NULL)
                                ->join("proforma_deliveries","proforma_deliveries.proforma_id","=","proformas.id")
                                ->where("proformas.state_proforma",2)
                                ->where("proformas.state_payment",3)
                                ->whereYear("proformas.created_at",$date_last->format("Y"))
                                ->whereMonth("proformas.created_at",$date_last->format("m"));
        if($sucursale_deliverie_id){
            $total_sales_before->where("proforma_deliveries.sucursale_deliverie_id",$sucursale_deliverie_id);
        }

        $total_sales_before = $total_sales_before->sum("proformas.total");

        $percentageV = 0;
        if($total_sales_current > 0){
            $percentageV = round((($total_sales_current - $total_sales_before)/$total_sales_current)*100,2);
        }
        return response()->json([
            "percentageV" => $percentageV,
            "total_sales_current" => $total_sales_current,
            "total_sales_before" => $total_sales_before,
            "sales_for_day_month" => $sales_for_day_month,
        ]);
    }

    public function sale_x_month_of_year(Request $request) {

        $year = $request->year;

        $sales_x_month_of_year_current = DB::table("proformas")->where("proformas.deleted_at",NULL)
                                        ->where("proformas.state_proforma",2)
                                        ->where("proformas.state_payment",3)
                                        ->whereYear("proformas.created_at",$year)
                                        ->selectRaw("
                                            DATE_FORMAT(proformas.created_at,'%Y-%m') as created_at_format,
                                            ROUND(SUM(proformas.total),2) as total_sales,
                                            COUNT(*) as count_contratos
                                        ")
                                        ->groupBy("created_at_format")
                                        ->get();

        $sales_x_month_of_year_before = DB::table("proformas")->where("proformas.deleted_at",NULL)
                                        ->where("proformas.state_proforma",2)
                                        ->where("proformas.state_payment",3)
                                        ->whereYear("proformas.created_at",$year - 1)
                                        ->selectRaw("
                                            DATE_FORMAT(proformas.created_at,'%Y-%m') as created_at_format,
                                            ROUND(SUM(proformas.total),2) as total_sales,
                                            COUNT(*) as count_contratos
                                        ")
                                        ->groupBy("created_at_format")
                                        ->get();

        return response()->json([
            "total_sales_year_current" => round($sales_x_month_of_year_current->sum("total_sales"),2),
            "total_sales_year_before" => round($sales_x_month_of_year_before->sum("total_sales"),2),
            "sales_x_month_of_year_before" => $sales_x_month_of_year_before,
            "sales_x_month_of_year_current" => $sales_x_month_of_year_current,
            "months_name" => array("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"),
        ]);

    }

    public function sale_x_segment_client(Request $request) {
        $year = $request->year;
        $month = $request->month;
        $sucursale_deliverie_id =$request->sucursale_deliverie_id;

        $sales_segment_clients = DB::table("proformas")->where("proformas.deleted_at",NULL)
                                    ->join("proforma_deliveries","proforma_deliveries.proforma_id","=","proformas.id")
                                    ->join("client_segments","proformas.client_segment_id","=","client_segments.id")
                                    ->where("proformas.state_proforma",2)
                                    ->where("proformas.state_payment",3)
                                    ->whereYear("proformas.created_at",$year)
                                    ->whereMonth("proformas.created_at",$month);
        if($sucursale_deliverie_id){
            $sales_segment_clients->where("proforma_deliveries.sucursale_deliverie_id",$sucursale_deliverie_id);
        }
        $sales_segment_clients = $sales_segment_clients->selectRaw("
                                    proformas.client_segment_id as client_segment_id,
                                    client_segments.name as client_segment_name,
                                    ROUND(SUM(proformas.total)) as total_sales,
                                    COUNT(*) as count_contratos
                                ")
                                ->groupBy("client_segment_id","client_segment_name")
                                ->orderBy("total_sales","desc")
                                ->get();

        return response()->json([
            "total_sales_segment_client" => $sales_segment_clients->sum("total_sales"),
            "sales_segment_clients" => $sales_segment_clients,
        ]);

    }

    public function asesor_most_sales(Request $request) {
        $year = $request->year;//date("Y");
        $month = $request->month;//date("m");

        $asesor_most_sales = DB::table("proformas")->where("proformas.deleted_at",NULL)
                                ->join("users","proformas.user_id","=","users.id")
                                ->where("proformas.state_proforma",2)
                                ->where("proformas.state_payment",3)
                                ->whereYear("proformas.created_at",$year)
                                ->whereMonth("proformas.created_at",$month)
                                ->selectRaw("
                                    proformas.user_id as asesor_id,
                                    CONCAT(users.name,' ',IFNULL(users.surname,'')) as asesor,
                                    users.gender as gender,
                                    ROUND(SUM(proformas.total),2) as total_sales,
                                    COUNT(*) as count_contratos
                                ")
                                ->groupBy("asesor_id","asesor","gender")
                                ->orderBy("total_sales","desc")
                                ->take(1)
                                ->get()->first();

        $date_last = Carbon::parse($year.'-'.$month.'-01')->subMonth();

        $asesor_total_sales_month_before = DB::table("proformas")->where("proformas.deleted_at",NULL)
                                ->where("proformas.state_proforma",2)
                                ->where("proformas.state_payment",3)
                                ->whereYear("proformas.created_at",$date_last->format("Y"))
                                ->whereMonth("proformas.created_at",$date_last->format("m"))
                                ->where("proformas.user_id",$asesor_most_sales->asesor_id)
                                ->sum("proformas.total");

        $asesor_total_sales_month_current = $asesor_most_sales->total_sales;

        $percentageV = 0;
        if($asesor_total_sales_month_current > 0){
            $percentageV = round((($asesor_total_sales_month_current - $asesor_total_sales_month_before)/$asesor_total_sales_month_current)*100,2);
        }

        $start_week = Carbon::now()->startOfWeek();
        $end_week =Carbon::now()->endOfWeek();

        $asesor_sales_week = DB::table("proformas")->where("proformas.deleted_at",NULL)
                            ->where("proformas.state_proforma",2)
                            ->where("proformas.state_payment",3)
                            ->where("proformas.user_id",$asesor_most_sales->asesor_id)
                            ->whereYear("proformas.created_at",$year)
                            ->whereMonth("proformas.created_at",$month)
                            // ->whereBetween("proformas.created_at",[ $start_week->format("Y-m-d")." 00:00:00" , $end_week->format("Y-m-d")." 23:59:59"])
                            ->selectRaw("
                                DATE_FORMAT(proformas.created_at,'%Y-%m-%d') as created_format,
                                DATE_FORMAT(proformas.created_at,'%d') as day,
                                ROUND(SUM(proformas.total),2) as total_sales,
                                COUNT(*) as count_contratos
                            ")
                            ->groupBy('created_format','day')
                            ->orderBy("total_sales","desc")
                            ->take(7)
                            ->get();
        Carbon::setLocale('es');
        return response()->json([
            "start_week" => $start_week,
            "end_week" => $end_week,
            "asesor_sales_week" => $asesor_sales_week,
            "percentageV" => $percentageV,
            "asesor_total_sales_month_before" => $asesor_total_sales_month_before,
            "asesor_total_sales_month_current" => $asesor_total_sales_month_current,
            "asesor_most_sales" => $asesor_most_sales,
            "month_name" => Carbon::parse($year.'-'.$month.'-01')->monthName,
        ]);
    }

    public function categories_most_sales(Request $request){
        $year = $request->year;
        $month = $request->month;

        $categories_most_sales = DB::table("proformas")->where("proformas.deleted_at",NULL)
                                    ->join("proforma_details","proforma_details.proforma_id","=","proformas.id")
                                    ->where("proforma_details.deleted_at",NULL)
                                    ->join("product_categories","proforma_details.product_categorie_id","=","product_categories.id")
                                    ->where("proformas.state_proforma",2)
                                    ->where("proformas.state_payment",3)
                                    ->whereYear("proformas.created_at",$year)
                                    ->whereMonth("proformas.created_at",$month)
                                    ->selectRaw("
                                        proforma_details.product_categorie_id as categorie_id,
                                        product_categories.name as categorie_name,
                                        ROUND(SUM(proforma_details.total),2) as total_sales,
                                        SUM(proforma_details.quantity) as count_products
                                    ")
                                    ->groupBy("categorie_id","categorie_name")
                                    ->orderBy("total_sales","desc")
                                    ->get();

        $categories = $categories_most_sales->take(4);
        $categorie_products = collect([]);
        foreach ($categories as $key => $categorie) {

            $query_products = DB::table("proformas")->where("proformas.deleted_at",NULL)
                                    ->join("proforma_details","proforma_details.proforma_id","=","proformas.id")
                                    ->where("proforma_details.deleted_at",NULL)
                                    ->join("products","proforma_details.product_id","=","products.id")
                                    ->where("proformas.state_proforma",2)
                                    ->where("proformas.state_payment",3)
                                    ->whereYear("proformas.created_at",$year)
                                    ->whereMonth("proformas.created_at",$month)
                                    ->where("proforma_details.product_categorie_id",$categorie->categorie_id)
                                    ->selectRaw("
                                        proforma_details.product_id as product_id,
                                        products.title as product_name,
                                        products.sku as product_sku,
                                        products.imagen as product_imagen,
                                        ROUND(AVG(proforma_details.subtotal),2) as sub_total_sales,
                                        ROUND(SUM(proforma_details.total),2) as total_sales,
                                        SUM(proforma_details.quantity) as count_products
                                    ")
                                    ->groupBy("product_id","product_name","product_imagen","product_sku")
                                    ->orderBy("total_sales","desc")
                                    ->take(5)
                                    ->get();

            $categorie_products->push([
                "name" => $categorie->categorie_name,
                "id" => $categorie->categorie_id,
                "products" => $query_products->map(function($product) {
                    $link = "";
                    if(str_contains($product->product_imagen,"https://") || str_contains($product->product_imagen,"http://")){
                        $link = $product->product_imagen;
                    }else{
                        $link =  env('APP_URL').'storage/'.$product->product_imagen;
                    }
                    $product->product_imagen = $link;//env("APP_URL")."storage/".$product->product_imagen;
                    return $product;
                }),
            ]);
        }
        return response()->json([
            "categorie_products" => $categorie_products,
            "categories_most_sales" => $categories_most_sales,
        ]);

    }
}
