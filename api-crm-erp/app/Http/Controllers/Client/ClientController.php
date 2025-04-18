<?php

namespace App\Http\Controllers\Client;

use App\Exports\Client\ExportClient;
use App\Http\Controllers\Controller;
use App\Http\Resources\Client\ClientCollection;
use App\Http\Resources\Client\ClientResource;
use App\Imports\ClientsImport;
use App\Models\Client\Client;
use App\Models\Configuration\ClientSegment;
use App\Models\User;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;
        $client_segment_id = $request->client_segment_id;
        $type = $request->type;
        $asesor_id = $request->asesor_id;
        // where("full_name","like","%".$search."%")->
        $clients = Client::filterAdvance($search,$client_segment_id,$type,$asesor_id)->orderBy("id","desc")->paginate(25);

        return response()->json([
            "total" => $clients->total(),
            "clients" => ClientCollection::make($clients),
        ]);
    }

    public function config(){

        $client_segments = ClientSegment::where("state",1)->get();
        $asesores = User::whereHas("roles",function($q) {
            $q->where("name","like","%asesor%");
        })->get();//->where("state",1)
        return response()->json([
            "client_segments" => $client_segments,
            "asesores" => $asesores->map(function($user) {
                return [
                    "id" => $user->id,
                    "full_name" => $user->name.' '.$user->surname,
                ];
            })
        ]);
    }

    public function export_clients(Request $request){
        $search = $request->get("search");
        $client_segment_id = $request->get("client_segment_id");
        $type = $request->get("type");
        $asesor_id = $request->get("asesor_id");

        $clients = Client::filterAdvance($search,$client_segment_id,$type,$asesor_id)->orderBy("id","desc")->get();
        return Excel::download(new ExportClient($clients),"clientes_descargados.xlsx");
    }

    public function import_clients(Request $request){
        $request->validate([
            "import_file" => 'required|file|mimes:xls,xlsx,csv'
        ]);
        $path = $request->file("import_file");

        $data = Excel::import(new ClientsImport,$path);

        return response()->json([
            "message" => 200
        ]);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $is_exits_client = Client::where("full_name",$request->full_name)->first();
        if($is_exits_client){
            return response()->json([
                "message" => 403,
                "message_text" => "Los datos del cliente ya existe"
            ]);
        }
        if(!$request->asesor_id){
            $request->request->add(["asesor_id" => auth()->user()->id]);
        }
        $request->request->add(["sucursale_id" => auth()->user()->sucursale_id]);
        $client = Client::create($request->all());
        return response()->json([
            "message" => 200,
            "client" => ClientResource::make($client),
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
        $is_exits_client = Client::where("full_name",$request->full_name)
                            ->where("id","<>",$id)->first();
        if($is_exits_client){
            return response()->json([
                "message" => 403,
                "message_text" => "Los datos del cliente ya existe"
            ]);
        }
        $client = Client::findOrFail($id);
        $client->update($request->all());
        return response()->json([
            "message" => 200,
            "client" => ClientResource::make($client),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $client = Client::findOrFail($id);
        // VALIDACION POR PROFORMA
        $client->delete();
        return response()->json([
            "message" => 200,
        ]);
    }
}
