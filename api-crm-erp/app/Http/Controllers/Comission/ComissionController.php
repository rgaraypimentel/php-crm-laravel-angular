<?php

namespace App\Http\Controllers\Comission;

use App\Http\Controllers\Controller;
use App\Models\Commission\Commission;
use App\Models\Configuration\ClientSegment;
use App\Models\Configuration\ProductCategorie;
use App\Models\Proforma\Proforma;
use App\Models\Proforma\ProformaDetail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ComissionController extends Controller
{
    public function config() {

        $comission_categories = Commission::select("product_categorie_id")
                                            ->where("product_categorie_id","<>",NULL)
                                            ->get();
        $categorie_ids = $comission_categories->pluck("product_categorie_id");
        $categories = ProductCategorie::whereIn("id",$categorie_ids)->get();

        $comission_segment_clients = Commission::select("client_segment_id")
                                            ->where("client_segment_id","<>",NULL)
                                            ->get();
        $categorie_ids = $comission_segment_clients->pluck("client_segment_id");
        $segment_clients = ClientSegment::whereIn("id",$categorie_ids)->get();

        $year = date("Y");
        $month = date("m");
        return response()->json([
            "segment_clients" => $segment_clients,
            "categories" => $categories,
            "year" => $year,
            "month" => $month,
        ]);
    }

    public function comission_asesor(Request $request){

        $year = $request->year;
        $month = $request->month;
        $categories = $request->categories;//[1,2,6]
        $segment_clients = $request->segment_clients;//[1,2,6]
        // dd($categories);
        // OBTENER TODOS LOS ASESORES COMERCIALES EN EL SISTEMA
        $asesores = User::where("role_id",2)->get();//->where("state",1)

        $asesor_comission = collect([]);
        foreach ($asesores as $key => $asesor) {

            // TOTAL DE CONTRATOS FACTURADOS DEL MES Y AÑO SELECCIONADO DEL ASESOR
            $total_ventas = Proforma::where("user_id",$asesor->id)
                                        ->where("state_proforma",2)
                                        ->whereYear("created_at",$year)
                                        ->whereMonth("created_at",$month)
                                        ->sum("total");

            // COMISION X CATEGORIA
            $categorie_comission = collect([]);
            foreach ($categories as $categorie) {
                // TOTAL DE VENTAS POR CATEGORIA DEL MES Y AÑO SELECCIONADO DEL ASESOR
                $product_categorie = ProductCategorie::findOrFail($categorie);
                $total_ventas_x_categoria = ProformaDetail::where("product_categorie_id",$categorie)
                                                            ->whereYear("created_at",$year)
                                                            ->whereMonth("created_at",$month)
                                                            ->whereHas("proforma",function($q) use($asesor){
                                                                $q->where("user_id",$asesor->id)->where("state_proforma",2);
                                                            })->sum("total");//3300
                $percentage = 0;
                $ganancia = 0;
                // OBTENER LOS MONTOS DE COMISION QUE SE DEBEN SUPERAR PARA ALCANZAR LA COMISION
                $comissions = Commission::where("product_categorie_id",$categorie)
                                        ->where("state",1)
                                        ->orderBy("amount","asc")
                                        ->get();//[2000 -> 2%, 3000 ->4%, 5000 -> 5%]
                foreach ($comissions as $comission) {
                    // ASIGNACIÓN DE LA COMISIÓN
                    if($total_ventas_x_categoria >= $comission->amount){
                        $percentage = $comission->percentage;
                    }
                }
                $ganancia = $total_ventas_x_categoria*$percentage*0.01;
                $categorie_comission->push([
                    "categorie_id" => $categorie,
                    "name" => $product_categorie->name,
                    "total_ventas_x_categoria" => round($total_ventas_x_categoria,2),
                    "percentage" => $percentage,
                    "ganancia" => round($ganancia,2),
                ]);
            }
            // END - COMISSION X CATEGORIA

            // COMISION X SEGMENTO DE CLIENTE
            $segment_client_comission = collect([]);
            foreach ($segment_clients as $segment_client) {

                $client_segment = ClientSegment::findOrFail($segment_client);
                // EL TOTAL DE VENTAS POR SEGMENTO DE CLIENTE DEL AÑO Y MES SELECCIONADO DEL ASESOR
                $total_ventas_x_segment_client = Proforma::where("client_segment_id",$segment_client)
                                                            ->where("user_id",$asesor->id)
                                                            ->whereYear("created_at",$year)
                                                            ->whereMonth("created_at",$month)
                                                            ->where("state_proforma",2)
                                                            ->sum("total");//4500
                $percentage = 0;
                $ganancia = 0;
                // OBTENER LOS MONTOS DE COMISION QUE SE DEBEN SUPERAR PARA ALCANZAR EL PORCENTAJE DE COMISION
                $comissions = Commission::where("client_segment_id",$segment_client)
                                            ->where("state",1)
                                            ->orderBy("amount","asc")
                                            ->get();//[2000 -> 1.5%, 3500 -> 2.5% , 5000 -> 3.8%]

                foreach ($comissions as $comission) {
                    // ASIGNACION DE COMISION
                    if($total_ventas_x_segment_client >= $comission->amount){
                        $percentage = $comission->percentage;
                    }
                }
                $ganancia = $total_ventas_x_segment_client*$percentage*0.01;
                $segment_client_comission->push([
                    "client_segment_id" => $segment_client,
                    "name" => $client_segment->name,
                    "total_ventas_x_segment_client" => round($total_ventas_x_segment_client,2),
                    "percentage" => $percentage,
                    "ganancia" =>round($ganancia,2)
                ]);
            }
            // END - COMISION X SEGMENTO DE CLIENTE

            // COMISION X SEMANA
                // 1 SEMANA - FECHA DESDE 1 AL 7
                // 2 SEMANA - FECHA DESDE 8 AL 14
                // 3 SEMANA - FECHA DESDE 15 AL 21
                // 4 SEMANA - FECHA DESDE EL 22 AL 31
                // dd($year."-".$month."-1 00:00:00",
                // $year."-".$month."-7 23:59:59");
                // SEMANA 1
                // TOTAL DE VENTAS DE LA SEMANA 1
                $total_ventas_semana_1 = Proforma::where("user_id",$asesor->id)
                                                    ->where("state_proforma",2)
                                                    ->whereBetween("created_at",[
                                                        $year."-".$month."-01 00:00:00",//Y-M-D h:i:s
                                                        $year."-".$month."-07 23:59:59",//Y-M-D h:i:s
                                                    ])->sum("total");
                // RANGOS A SUPERAR DE LA SEMANA 1 PARA LA COMISION
                $comission_semana_1 = Commission::where("week","SEMANA 1")
                                                ->where("state",1)
                                                ->orderBy("amount","asc")
                                                ->get();
                $percentage_semana_1 = 0;
                $ganancia_semana_1 = 0;
                foreach ($comission_semana_1 as $comission_semana) {
                    // ASIGNAR UNA COMISION
                    if($total_ventas_semana_1 >= $comission_semana->amount){
                        $percentage_semana_1 = $comission_semana->percentage;
                    }
                }
                // GANANCIA OBTENIDA DE LA SEMANA 1
                $ganancia_semana_1 = $total_ventas_semana_1*$percentage_semana_1*0.01;

                // TOTAL DE VENTAS DE LA SEMANA 2
                $total_ventas_semana_2 = Proforma::where("user_id",$asesor->id)
                                                    ->where("state_proforma",2)
                                                    ->whereBetween("created_at",[
                                                        $year."-".$month."-08 00:00:00",//Y-M-D h:i:s
                                                        $year."-".$month."-14 23:59:59",//Y-M-D h:i:s
                                                    ])->sum("total");
                // RANGOS A SUPERAR DE LA SEMANA 2 PARA LA COMISION
                $comission_semana_2 = Commission::where("week","SEMANA 2")
                                                ->where("state",1)
                                                ->orderBy("amount","asc")
                                                ->get();
                $percentage_semana_2 = 0;
                $ganancia_semana_2 = 0;
                foreach ($comission_semana_2 as $comission_semana) {
                    // ASIGNAR UNA COMISION
                    if($total_ventas_semana_2 >= $comission_semana->amount){
                        $percentage_semana_2 = $comission_semana->percentage;
                    }
                }
                // GANANCIA OBTENIDA DE LA SEMANA 2
                $ganancia_semana_2 = $total_ventas_semana_2*$percentage_semana_2*0.01;
                // TOTAL DE VENTAS DE LA SEMANA 3
                $total_ventas_semana_3 = Proforma::where("user_id",$asesor->id)
                                                    ->where("state_proforma",2)
                                                    ->whereBetween("created_at",[
                                                        $year."-".$month."-15 00:00:00",//Y-M-D h:i:s
                                                        $year."-".$month."-21 23:59:59",//Y-M-D h:i:s
                                                    ])->sum("total");
                // RANGOS A SUPERAR DE LA SEMANA 3 PARA LA COMISION
                $comission_semana_3 = Commission::where("week","SEMANA 3")
                                                ->where("state",1)
                                                ->orderBy("amount","asc")
                                                ->get();
                $percentage_semana_3 = 0;
                $ganancia_semana_3 = 0;
                foreach ($comission_semana_3 as $comission_semana) {
                    // ASIGNAR UNA COMISION
                    if($total_ventas_semana_3 >= $comission_semana->amount){
                        $percentage_semana_3 = $comission_semana->percentage;
                    }
                }
                // GANANCIA OBTENIDA DE LA SEMANA 3
                $ganancia_semana_3 = $total_ventas_semana_3*$percentage_semana_3*0.01;
                // TOTAL DE VENTAS DE LA SEMANA 4
                $total_ventas_semana_4 = Proforma::where("user_id",$asesor->id)
                                                    ->where("state_proforma",2)
                                                    ->whereBetween("created_at",[
                                                        $year."-".$month."-22 00:00:00",//Y-M-D h:i:s
                                                        $year."-".$month."-31 23:59:59",//Y-M-D h:i:s
                                                    ])->sum("total");
                // RANGOS A SUPERAR DE LA SEMANA 4 PARA LA COMISION
                $comission_semana_4 = Commission::where("week","SEMANA 4")
                                                ->where("state",1)
                                                ->orderBy("amount","asc")
                                                ->get();
                $percentage_semana_4 = 0;
                $ganancia_semana_4 = 0;
                foreach ($comission_semana_4 as $comission_semana) {
                    // ASIGNAR UNA COMISION
                    if($total_ventas_semana_4 >= $comission_semana->amount){
                        $percentage_semana_4 = $comission_semana->percentage;
                    }
                }
                // GANANCIA OBTENIDA DE LA SEMANA 4
                $ganancia_semana_4 = $total_ventas_semana_4*$percentage_semana_4*0.01;
            // END - COMISION X SEMANA

            // COMISION X FECHA DE VERIFICACION
                // TOTAL DE VENTAS POR FECHA DE VERIFICACION
                $total_ventas_x_fecha_de_verificacion = Proforma::where("user_id",$asesor->id)
                                                                ->where("state_proforma",2)
                                                                ->whereYear("created_at",$year)
                                                                ->whereMonth("created_at",$month)
                                                                ->where(DB::raw('DATEDIFF(date_pay_complete,date_validation)'),"<=",12)
                                                                ->sum("total");
            // END - COMISION X FECHA DE VERIFICACION
            $asesor_comission->push([
                "asesor_id" => $asesor->id,
                "full_name" => $asesor->name. ' '.$asesor->surname,
                "total_ventas" => round($total_ventas,2),
                "posicion" => 0,
                "percentage_posicion" => 0,
                "ganancia_posicion" => 0,
                "categorie_comission" => $categorie_comission,
                "segment_client_comission" => $segment_client_comission,

                "total_ventas_semana_1" => round($total_ventas_semana_1,2),
                "percentage_semana_1" => $percentage_semana_1,
                "ganancia_semana_1" => round($ganancia_semana_1,2),

                "total_ventas_semana_2" => round($total_ventas_semana_2,2),
                "percentage_semana_2" => $percentage_semana_2,
                "ganancia_semana_2" => round($ganancia_semana_2,2),

                "total_ventas_semana_3" => round($total_ventas_semana_3,2),
                "percentage_semana_3" => $percentage_semana_3,
                "ganancia_semana_3" => round($ganancia_semana_3,2),

                "total_ventas_semana_4" => round($total_ventas_semana_4,2),
                "percentage_semana_4" => $percentage_semana_4,
                "ganancia_semana_4" => round($ganancia_semana_4,2),

                "total_ventas_x_fecha_de_verificacion" => round($total_ventas_x_fecha_de_verificacion,2),
                "percentage_x_fecha_de_verificacio" => 5,
                "ganancia_x_fecha_de_verificacio" => round($total_ventas_x_fecha_de_verificacion*5*0.01,2),

                "total_ganancia" => round($categorie_comission->sum("ganancia"),2) + round($segment_client_comission->sum("ganancia"),2) +
                round($ganancia_semana_1,2) + round($ganancia_semana_2,2) + round($ganancia_semana_3,2) + round($ganancia_semana_4,2) +
                                round($total_ventas_x_fecha_de_verificacion*5*0.01,2),
            ]);
        }

        $asesores_comisiones = collect([]);
        $position = 1;
        // dd($asesor_comission->sortByDesc("total_ventas"));
        foreach ($asesor_comission->sortByDesc("total_ventas") as $key => $asesor_comi) {
            $position_text = "";
            switch ($position) {
                case 1:
                    $position_text = "1ro";
                    break;
                case 2:
                    $position_text = "2do";
                break;
                case 3:
                    $position_text = "3ro";
                    break;
                case 4:
                    $position_text = "4to";
                    break;
                case 5:
                    $position_text = "5to";
                    break;
                default:
                    $position_text = "5to";
                    break;
            }
            $comission = Commission::where("position",$position_text)->first();

            $asesor_comi["posicion"] = $position;
            $asesor_comi["percentage_posicion"] = $comission->percentage;
            $asesor_comi["ganancia_posicion"] = round($asesor_comi["total_ventas"]*$comission->percentage*0.01,2);

            $asesor_comi["total_ganancia"] = round($asesor_comi["total_ganancia"] + $asesor_comi["ganancia_posicion"],2);
            $asesores_comisiones->push($asesor_comi);
            $position ++;
        }
        return response()->json([
            "asesores_comisiones" => $asesores_comisiones,
        ]);
    }
}
