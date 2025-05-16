<?php

namespace App\Http\Controllers\Caja;

use App\Exports\Caja\ExportContractProcess;
use App\Http\Controllers\Controller;
use App\Http\Resources\Caja\CajaHistorie\CajaHistorieCollection;
use App\Http\Resources\Caja\Proforma\ProformaCajaCollection;
use App\Http\Resources\Caja\Proforma\ProformaCajaResource;
use App\Models\Caja\Caja;
use App\Models\Caja\CajaHistorie;
use App\Models\Caja\CajaHistoriePayment;
use App\Models\Caja\CajaSucursale;
use App\Models\Configuration\MethodPayment;
use App\Models\Configuration\Sucursale;
use App\Models\Proforma\Proforma;
use App\Models\Proforma\ProformaPayment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;

class CajaSucursaleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function config(Request $request){

        $sucursale_id = $request->sucursale_id;

        $caja = Caja::where("sucursale_id",$sucursale_id)->where("type",1)->first();

        $caja_sucursale = CajaSucursale::where("caja_id",$caja->id)->where("state",1)->first();

        $method_payments = MethodPayment::where("method_payment_id",NULL)->where("state",1)->get();

        $sucursales = Sucursale::where("state",1)->get();
        return response()->json([
            "caja" => [
                "id" => $caja->id,
                "amount" => $caja->amount,
                "sucursale" => [
                    "id" => $caja->sucursale->id,
                    "name" => $caja->sucursale->name,
                ],
                "type" => $caja->type,
            ],
            "caja_sucursale" => $caja_sucursale,
            "created_at_apertura" => $caja_sucursale ? $caja_sucursale->created_at->format("Y-m-d h:i A") : NULL,
            "method_payments" => $method_payments->map(function($method_payment){
                return [
                    "id" => $method_payment->id,
                    "name" => $method_payment->name,
                    "bancos" => $method_payment->method_payments->map(function($children) {
                        return [
                            "id" => $children->id,
                            "name" => $children->name,
                        ];
                    })
                ];
            }),
            "sucursales" => $sucursales->map(function($sucursale) {
                return [
                    "id" => $sucursale->id,
                    "name" => $sucursale->name
                ];
            })
        ]);
    }

    public function apertura_caja(Request $request){
        $caja_id = $request->caja_id;
        $amount_initial = $request->amount_initial;

        $caja_sucursale = CajaSucursale::where("caja_id",$caja_id)->where("state",1)->first();
        if(!$caja_sucursale){
            $caja_sucursale = CajaSucursale::create([
                "user_id" => auth('api')->user()->id,
                "caja_id" => $caja_id,
                "efectivo_initial" => $amount_initial,
                "efectivo_finish" => $amount_initial,
            ]);
        }

        $caja_sucursale = CajaSucursale::findOrFail($caja_sucursale->id);
        return response()->json([
            "caja_sucursale" =>  $caja_sucursale,
            "created_at_apertura" => $caja_sucursale ? $caja_sucursale->created_at->format("Y-m-d h:i A") : NULL,
        ]);
    }

    public function search_proformas(Request $request,$client_id){
        $n_proforma = $request->get("n_proforma");
        $state_payment = $request->get("state_payment");

        $proformas = Proforma::filterShort($n_proforma,$state_payment)->where("client_id",$client_id)->orderBy("state_proforma","asc")->get();

        return response()->json([
            "proformas" => ProformaCajaCollection::make($proformas),
        ]);
    }

    public function updated_payment(Request $request,$id){

        $proforma_payment = ProformaPayment::findOrFail($id);//100 - 80
        if($request->hasFile("payment_file")){
            if($proforma_payment->vaucher){
                Storage::delete($proforma_payment->vaucher);
            }
            $path = Storage::putFile("proformas",$request->file("payment_file"));
            $request->request->add(["vaucher" => $path]);
        }
        if($request->verification == 2){
            $request->request->add(["user_verification" => auth('api')->user()->id]);
        }
        $proforma = Proforma::findOrFail($proforma_payment->proforma_id);//500
        $debt_current = $proforma->debt;
        $paid_out_current = $proforma->paid_out;//500
        //500 - 100 + 80 = 480
        if(($paid_out_current - $proforma_payment->amount) + $request->amount > $proforma->total){
            return response()->json([
                "message" => 403,
                "message_text" => "El nuevo monto que se quiere editar supera a la deuda de la proforma"
            ]);
        }
        $proforma->update([
            "debt" => $debt_current + $proforma_payment->amount - $request->amount,
            "paid_out" => $paid_out_current - $proforma_payment->amount + $request->amount,
        ]);

        $proforma_payment->update($request->all());

        return response()->json([
            "payment" => [
                "id" => $proforma_payment->id,
                "method_payment_id" => $proforma_payment->method_payment_id,
                "banco_id" => $proforma_payment->banco_id,
                "method_payment" => [
                    "id" =>  $proforma_payment->method_payment->id,
                    "name" =>$proforma_payment->method_payment->name,
                ],
                "amount" => $proforma_payment->amount,
                "date_validation" => $proforma_payment->date_validation,
                "verification" => $proforma_payment->verification,
                "user_verification" => $proforma_payment->user_verific ? [
                    "id" => $proforma_payment->user_verific->id,
                    "full_name" => $proforma_payment->user_verific->name . ' ' .$proforma_payment->user_verific->surname,
                ] : NULL,
                "n_transaccion" => $proforma_payment->n_transaccion,
                "imagen" => $proforma_payment->vaucher ? env("APP_URL")."storage/".$proforma_payment->vaucher : NULL,
            ],
            "proforma" => [
                "debt" => $proforma->debt,
                "paid_out"  => $proforma->paid_out,
            ]
        ]);
    }

    public function created_payment(Request $request){
        if($request->hasFile("payment_file")){
            $path = Storage::putFile("proformas",$request->file("payment_file"));
            $request->request->add(["vaucher" => $path]);
        }
        if($request->verification == 2){
            $request->request->add(["user_verification" => auth('api')->user()->id]);
        }
        $proforma = Proforma::findOrFail($request->proforma_id);
        $debt_current = $proforma->debt;
        $paid_out_current = $proforma->paid_out;
        if($paid_out_current + $request->amount > $proforma->total){
            return response()->json([
                "message" => 403,
                "message_text" => "El nuevo monto que se quiere ingresa supera a la deuda de la proforma"
            ]);
        }

        $proforma_payment = ProformaPayment::create($request->all());
        $proforma->update([
            "debt" => $debt_current - $proforma_payment->amount,
            "paid_out" => $paid_out_current + $proforma_payment->amount,
        ]);
        return response()->json([
            "payment" => [
                "id" => $proforma_payment->id,
                "method_payment_id" => $proforma_payment->method_payment_id,
                "banco_id" => $proforma_payment->banco_id,
                "method_payment" => [
                    "id" =>  $proforma_payment->method_payment->id,
                    "name" =>$proforma_payment->method_payment->name,
                ],
                "amount" => $proforma_payment->amount,
                "date_validation" => $proforma_payment->date_validation,
                "verification" => $proforma_payment->verification,
                "user_verification" => $proforma_payment->user_verific ? [
                    "id" => $proforma_payment->user_verific->id,
                    "full_name" => $proforma_payment->user_verific->name . ' ' .$proforma_payment->user_verific->surname,
                ] : NULL,
                "n_transaccion" => $proforma_payment->n_transaccion,
                "imagen" => $proforma_payment->vaucher ? env("APP_URL")."storage/".$proforma_payment->vaucher : NULL,
            ],
            "proforma" => [
                "debt" => $proforma->debt,
                "paid_out"  => $proforma->paid_out,
            ]
        ]);
    }

    public function process_payment(Request $request){
        $proforma_id = $request->proforma_id;
        $caja_sucursale_id = $request->caja_sucursale_id;

        // PAGOS VERIFICADOS QUE NO SE HAYAN PROCESADO
        $proforma_payments = ProformaPayment::where("proforma_id",$proforma_id)
                                ->where("verification",2)
                                ->where("date_validation",NULL)
                                ->get();
        // VALIDAMOS QUE HAYAN PAGOS POR PROCESAR
        if($proforma_payments->count() > 0){

            // REGISTRO DE LA PROFORMA QUE SE HA PROCESADO
            $caja_historie = CajaHistorie::create([
                "caja_sucursale_id" => $caja_sucursale_id,
                "proforma_id" => $proforma_id,
                "amount" => $proforma_payments->sum("amount"),
            ]);
            $sum_efectivo = 0;
            // LISTA DE PAGOS POR PROCESAR
            foreach ($proforma_payments as $proforma_payment) {
                // IDENTIFICAR LOS EFECTIVOS
                if($proforma_payment->method_payment_id == 1){
                    // ES EFECTIVO
                    $sum_efectivo += $proforma_payment->amount;
                }
                // DETALLE DE LOS PAGOS QUE SE HAN PROCESADO
                CajaHistoriePayment::create([
                    "caja_historie_id" => $caja_historie->id,
                    "proforma_payment_id" => $proforma_payment->id,
                    "amount" => $proforma_payment->amount,
                ]);
                date_default_timezone_set("America/Lima");
                $proforma_payment->update([
                    "date_validation" => now(),
                ]);
            }

            $caja_sucursale = CajaSucursale::findOrFail($caja_sucursale_id);

            $efectivo_initial = $caja_sucursale->efectivo_initial ;
            $ingresos = $caja_sucursale->ingresos ;
            $egresos = $caja_sucursale->egresos ;
            $efectivo_process = $caja_sucursale->efectivo_process;
            $efectivo_finish = $caja_sucursale->efectivo_finish;
            // CALCULAR EL NUEVO EFECTIVO FINAL EN CAJA
            $caja_sucursale->update([
                "efectivo_process" => $efectivo_process +  $sum_efectivo,
                "efectivo_finish" => $efectivo_initial + $ingresos + ($efectivo_process + $sum_efectivo) - $egresos,
            ]);

            $proforma = Proforma::findOrFail($proforma_id);
            $state_payment = 2;
            if($proforma->debt == 0){
                $state_payment = 3;
            }
            $proforma->update([
                "state_proforma" => 2,
                "state_payment" => $state_payment,
            ]);
            return response()->json([
                "caja_sucursale" => $caja_sucursale,
                "proforma" => ProformaCajaResource::make($proforma)
            ]);
        }else{
            return response()->json([
                "message" => 403,
                "message_text" => "NO hay pagos por procesar"
            ]);
        }
    }

    public function contract_process(Request $request){

        $caja_sucursale_id = $request->caja_sucursale_id;
        $n_proforma = $request->n_proforma;
        $search_client = $request->search_client;

        $caja_histories = CajaHistorie::filterAdvance($n_proforma,$search_client)->where("caja_sucursale_id",$caja_sucursale_id)->orderBy("id","desc")->get();

        return response()->json([
            "contract_process" => CajaHistorieCollection::make($caja_histories) ,
        ]);
    }

    public function report_caja_day($caja_sucursale_id){

        $method_payments = MethodPayment::where("method_payment_id",NULL)->where("state",1)->get();

        $method_payment_total_amount = collect([]);
        foreach ($method_payments as $method_payment) {

            $amount_total_process = CajaHistoriePayment::whereHas("caja_historie",function($subq) use($caja_sucursale_id){
                $subq->where("caja_sucursale_id",$caja_sucursale_id);
            })->whereHas("proforma_payment",function($sub) use($method_payment){
                $sub->where("method_payment_id",$method_payment->id);
            })
            ->sum("amount");

            $method_payment_total_amount->push([
                "id" => $method_payment->id,
                "name" => $method_payment->name,
                "amount_total_process" => $amount_total_process,
            ]);
        }

        return response()->json([
            "method_payment_total_amount" => $method_payment_total_amount,
        ]);
    }

    public function cierre_caja(Request $request){

        $caja_sucursale_id = $request->caja_sucursale_id;
        $amount_caja_fuerte = $request->amount_caja_fuerte;

        $caja_sucursale = CajaSucursale::find($caja_sucursale_id);
        date_default_timezone_set("America/Lima");
        $caja_sucursale->update([
            "state" => 2,
            "user_close" => auth('api')->user()->id,
            "date_close" => now(),
        ]);

        $caja_chica = Caja::find($caja_sucursale->caja_id);
        $caja_chica->update([
            "amount" => $caja_sucursale->efectivo_finish - $amount_caja_fuerte
        ]);

        $caja_fuerte = Caja::where("sucursale_id",$caja_chica->sucursale_id)->where("type",2)->first();
        $caja_fuerte->update([
            "amount" => $caja_fuerte->amount + $amount_caja_fuerte,
        ]);

        return response()->json([
            "message" => 200,
        ]);
    }

    public function report_caja(Request $request) {

        $type_option = $request->type_option;
        $start_date = $request->start_date;
        $end_date = $request->end_date;
        $sucursale_id = $request->sucursale_id;

        // filtrar por caja
        if($type_option == 1){

            $caja_sucursales = CajaSucursale::whereBetween("created_at",[
                Carbon::parse($start_date)->format("Y-m-d")." 00:00:00",
                Carbon::parse($end_date)->format("Y-m-d")." 23:59:59"
            ])->whereHas("caja",function($subq) use($sucursale_id){
                $subq->where("sucursale_id",$sucursale_id);
            })->get();

            return response()->json([
                "caja_sucursales" => $caja_sucursales->map(function($caja_sucursale) {
                    return [
                        "id" => $caja_sucursale->id,
                        "user" => [
                            "id" => $caja_sucursale->user_apertura->id,
                            "full_name" => $caja_sucursale->user_apertura->name.' '.$caja_sucursale->user_apertura->surname,
                        ],
                        "caja" => [
                            "id" => $caja_sucursale->caja->id,
                            "name" => $caja_sucursale->caja->sucursale->name,
                        ],
                        "state" => $caja_sucursale->state,
                        "user_close" => $caja_sucursale->user_close ? [
                            "id" => $caja_sucursale->user_cierre->id,
                            "full_name" => $caja_sucursale->user_cierre->name.' '.$caja_sucursale->user_cierre->surname,
                        ]: NULL,
                        "date_close" => $caja_sucursale->date_close ? Carbon::parse($caja_sucursale->date_close)->format("Y-m-d h:i A") : NULL ,
                        "efectivo_initial" => $caja_sucursale->efectivo_initial,
                        "ingresos" => $caja_sucursale->ingresos,
                        "egresos" => $caja_sucursale->egresos,
                        "efectivo_process" => $caja_sucursale->efectivo_process,
                        "efectivo_finish" => $caja_sucursale->efectivo_finish,
                        "created_at" => $caja_sucursale->created_at->format("Y-m-d h:i A"),
                    ];
                }),
            ]);
        }else{
            // tipo 2 , vamos a filtrar por contrato procesados

            $caja_histories = CajaHistorie::whereBetween("created_at",[
                Carbon::parse($start_date)->format("Y-m-d")." 00:00:00",
                Carbon::parse($end_date)->format("Y-m-d")." 23:59:59"
            ])->whereHas("caja_sucursale",function($q) use($sucursale_id){
                $q->whereHas("caja",function($subq) use($sucursale_id){
                    $subq->where("sucursale_id",$sucursale_id);
                });
            })->paginate(25);

            return response()->json([
                "total" => $caja_histories->total(),
                "contract_process" => CajaHistorieCollection::make($caja_histories) ,
            ]);
        }
    }
    public function export_report_caja(Request $request) {

        $start_date = $request->get("start_date");
        $end_date = $request->get("end_date");
        $sucursale_id = $request->get("sucursale_id");

        // tipo 2 , vamos a filtrar por contrato procesados

        $caja_histories = CajaHistorie::whereBetween("created_at",[
            Carbon::parse($start_date)->format("Y-m-d")." 00:00:00",
            Carbon::parse($end_date)->format("Y-m-d")." 23:59:59"
        ])->whereHas("caja_sucursale",function($q) use($sucursale_id){
            $q->whereHas("caja",function($subq) use($sucursale_id){
                $subq->where("sucursale_id",$sucursale_id);
            });
        })->get();


        return Excel::download(new ExportContractProcess($caja_histories),"contratos_procesados".uniqid().".xlsx");

    }
}
