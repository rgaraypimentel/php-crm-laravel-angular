<?php

namespace App\Http\Controllers\Proforma;

use App\Exports\Proforma\ProformaDetailExport;
use App\Exports\Proforma\ProformaGeneralExport;
use App\Http\Controllers\Controller;
use App\Http\Resources\Product\ProductCollection;
use App\Http\Resources\Proforma\ProformaCollection;
use App\Http\Resources\Proforma\ProformaResource;
use App\Models\Client\Client;
use Barryvdh\DomPDF\Facade\PDF;
use App\Models\Configuration\ClientSegment;
use App\Models\Configuration\MethodPayment;
use App\Models\Configuration\ProductCategorie;
use App\Models\Configuration\SucursaleDeliverie;
use App\Models\Configuration\Warehouse;
use App\Models\Product\Product;
use App\Models\Product\ProductWarehouse;
use App\Models\Proforma\Proforma;
use App\Models\Proforma\ProformaDeliverie;
use App\Models\Proforma\ProformaDetail;
use App\Models\Proforma\ProformaPayment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ProformaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;
        $client_segment_id = $request->client_segment_id;
        $asesor_id = $request->asesor_id;
        $product_categorie_id = $request->product_categorie_id;
        $search_client = $request->search_client;
        $search_product = $request->search_product;
        $start_date = $request->start_date;
        $end_date = $request->end_date;
        $state_proforma = $request->state_proforma;

        $proformas = Proforma::filterAdvance($search,$client_segment_id,$asesor_id,
                                    $product_categorie_id,$search_client,$search_product,
                                    $start_date,$end_date,$state_proforma)
                                    ->orderBy("id","desc")->paginate(25);

        return response()->json([
            "total" => $proformas->total(),
            "proformas" => ProformaCollection::make($proformas),
        ]);
    }

    public function export_proforma_general(Request $request){
        return Excel::download(new ProformaGeneralExport($request),'proformas'.uniqid().'.xlsx');
    }

    public function export_proforma_details(Request $request){
        return Excel::download(new ProformaDetailExport($request),'proformas'.uniqid().'.xlsx');
    }

    public function proforma_pdf($id){

        $proforma = Proforma::findOrFail($id);

        $pdf = PDF::loadView("proforma.proforma_pdf",compact("proforma"));

        return $pdf->stream("proforma".$proforma->id.'-'.uniqid().'.pdf');
    }

    public function search_clients(Request $request){
        $n_document = $request->get("n_document");
        $full_name = $request->get("full_name");
        $phone = $request->get("phone");

        $clients = Client::filterProforma($n_document,$full_name,$phone)->where("state",1)->orderBy("id","desc")->get();

        return response()->json([
            "clients" => $clients->map(function($client){
                return [
                    "id" => $client->id,
                    "full_name" =>  $client->full_name,
                    "client_segment" => $client->client_segment,
                    "phone" => $client->phone,
                    "type" => $client->type,
                    "n_document" => $client->n_document,
                    "is_parcial" => $client->is_parcial,
                ];
            })
        ]);
    }
    public function search_products(Request $request){
        $search = $request->get("search");
        $products = Product::where(DB::raw("CONCAT(products.title,' ',products.sku)"),"like","%".$search."%")->orderBy("id","desc")->get();

        return response()->json([
            "products" => ProductCollection::make($products),
        ]);
    }
    public function config(){
        $client_segments = ClientSegment::where("state",1)->get();
        $asesores = User::whereHas("roles",function($q) {
            $q->where("name","like","%asesor%");
        })->get();//->where("state",1)
        $sucursale_deliveries = SucursaleDeliverie::where("state",1)->get();
        $method_payments = MethodPayment::where("state",1)->where("method_payment_id",NULL)->get();
        date_default_timezone_set("America/Lima");
        $today = now()->format("Y/m/d");
        $product_categories = ProductCategorie::where("state",1)->get();
        $warehouses = Warehouse::where("state",1)->orderBy("id","desc")->get();
        return response()->json([
            "client_segments" => $client_segments,
            "product_categories" => $product_categories,
            "asesores" => $asesores->map(function($user) {
                return [
                    "id" => $user->id,
                    "full_name" => $user->name.' '.$user->surname,
                ];
            }),
            "warehouses" => $warehouses,
            "sucursale_deliveries" => $sucursale_deliveries->map(function($sucursale_del) {
                return [
                    "id" => $sucursale_del->id,
                    "name" => $sucursale_del->name,
                ];
            }),
            "method_payments" => $method_payments->map(function($method_payment) {
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
            "today" => $today,
        ]);
    }

    public function eval_disponibilidad(Request $request,$id){
        $unit_id = $request->get("unit_id");
        $previo_count_product = $request->get("quantity");
        $product_id = $id;
        $message = null;
        $user = auth('api')->user();
        $sucursale_name = $user->sucursale->name;

        $product = Product::findOrFail($product_id);
        // CANTIDAD DE PRODUCTOS PREVISTO PARA ATENDER O DESPACHAR
        $count_product = ProformaDetail::where("product_id",$product_id)
                                    ->where("unit_id",$unit_id)
                                    ->whereHas("proforma",function($q) {
                                        $q->where("state_proforma",2)
                                        ->where("state_despacho",1);
                                    })
                                    ->sum("quantity");

        $warehouse = Warehouse::where("name","like","%".$sucursale_name."%")->first();
        if(!$warehouse){
            return response()->json([
                "message" => "No se reconocio el almacen con la sucursale de origen",
            ]);
        }
        $warehouse_id = $warehouse->id;
        $product_warehouse = ProductWarehouse::where("product_id",$product_id)
                            ->where("unit_id",$unit_id)
                            ->where("warehouse_id",$warehouse_id)
                            ->first();
        if(!$product_warehouse){
            $message = "El producto NO ESTA PARA disponibilidad imediata de atención y el tiempo de abastecimiento es ( ".($product->tiempo_de_abastecimiento+1)." ) dias";
        }
        if($product_warehouse && $product_warehouse->stock < ($count_product + $previo_count_product)){
            $message = "El producto no cuenta con una disponibilidad imediata de atención y el tiempo de abastecimiento es ( ".$product->tiempo_de_abastecimiento." ) dias";
        }
        return response()->json([
            "message" => $message,
        ]);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            DB::beginTransaction();
            $client = Client::findOrFail($request->client_id);
            $proforma = Proforma::create([
                "user_id" => auth('api')->user()->id,
                "client_id" => $request->client_id,
                "client_segment_id" => $request->client_segment_id,
                "sucursale_id" => auth('api')->user()->sucursale_id,
                "subtotal" => $request->subtotal,
                // "discount" => $request->discount,
                "total" => $request->total,
                "igv" => $request->igv,
                "debt" => $request->debt,
                "paid_out" => $request->paid_out,
                "description" => $request->description,
                "state_proforma" => $client->is_parcial == 2 ? 2 : 1,
            ]);

            $DETAIL_PROFORMAS = json_decode($request->DETAIL_PROFORMAS,true);

            foreach ($DETAIL_PROFORMAS as $key => $DETAIL) {
                ProformaDetail::create([
                    "proforma_id" => $proforma->id,
                    "product_id" => $DETAIL["product"]["id"],
                    "product_categorie_id" => $DETAIL["product"]["product_categorie_id"],
                    "description" => $DETAIL["description"],
                    "unit_id" => $DETAIL["unidad_product"],
                    "quantity" => $DETAIL["quantity"],
                    "price_unit" => $DETAIL["price_unit"],
                    "discount" => $DETAIL["discount"],
                    "subtotal" => $DETAIL["subtotal"],
                    "impuesto" => $DETAIL["impuesto"],
                    "total" => $DETAIL["total"],
                ]);
            }

            ProformaDeliverie::create([
                "proforma_id" => $proforma->id,
                "sucursale_deliverie_id" => $request->sucursale_deliverie_id,
                "date_entrega" => $request->date_entrega,
                "date_envio" => Carbon::parse($request->date_entrega)->subDay(2),
                "address" => $request->address,
                "ubigeo_region" => $request->ubigeo_region,
                "ubigeo_provincia" => $request->ubigeo_provincia,
                "ubigeo_distrito" => $request->ubigeo_distrito,
                "region" => $request->region,
                "provincia" => $request->provincia,
                "distrito" => $request->distrito,
                "agencia" => $request->agencia,
                "full_name_encargado" => $request->full_name_encargado,
                "documento_encargado" => $request->documento_encargado,
                "telefono_encargado" => $request->telefono_encargado,
            ]);
            $vaucher = "";

            if($request->hasFile("payment_file")){
                $vaucher = Storage::putFile("proformas",$request->file("payment_file"));
            }
            if($request->method_payment_id){
                ProformaPayment::create([
                    "proforma_id" => $proforma->id,
                    "method_payment_id" => $request->method_payment_id,
                    "amount" => $request->amount_payment,
                    "vaucher" => $vaucher,
                    "banco_id" => $request->banco_id
                ]);
            }
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            throw new HttpException(500,$th->getMessage());
        }

        return response()->json([
            "message" => 200,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $proforma = Proforma::findOrFail($id);

        return response()->json([
            "proforma" => ProformaResource::make($proforma),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $proforma = Proforma::findOrFail($id);
        $proforma->update($request->all());
        $proforma->proforma_deliverie->update([
            "sucursale_deliverie_id" => $request->sucursale_deliverie_id,
            "date_entrega" => $request->date_entrega,
            "date_envio" => Carbon::parse($request->date_entrega)->subDay(2),
            "address" => $request->address,
            "ubigeo_region" => $request->ubigeo_region,
            "ubigeo_provincia" => $request->ubigeo_provincia,
            "ubigeo_distrito" => $request->ubigeo_distrito,
            "region" => $request->region,
            "provincia" => $request->provincia,
            "distrito" => $request->distrito,
            "agencia" => $request->agencia,
            "full_name_encargado" => $request->full_name_encargado,
            "documento_encargado" => $request->documento_encargado,
            "telefono_encargado" => $request->telefono_encargado,
        ]);
        return response()->json([
            "message" => 200,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $proforma = Proforma::findOrFail($id);
        // VALIDACION POR PROFORMA
        $proforma->delete();
        return response()->json([
            "message" => 200,
        ]);
    }
}
