<?php

namespace App\Http\Controllers\Transport;

use App\Http\Controllers\Controller;
use App\Models\Transport\Transport;
use App\Models\Transport\TransportDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;

class TransportDetailController extends Controller
{
    public function store(Request $request){
        $product = $request->product;
        $unit = $request->unit;
        $transport_detail = TransportDetail::create([
            "transport_id" => $request->transport_id,
            "product_id" => $product["id"],
            "unit_id" => $unit["id"],
            // "description",
            "quantity" => $request->quantity,
            "price_unit" => $request->price_unit,
            "total" => $request->total,
        ]);

        $total = $request->total_purchase;
        $importe = $request->importe;
        $igv = $request->igv;

        $transport = Transport::findOrFail($request->transport_id);
        $transport->update([
            "total" => $total,
            "importe" => $importe,
            "igv" => $igv,
        ]);
        return response()->json([
            "transport_detail" => [
                "id" => $transport_detail->id,
                "transport_id"  => $transport_detail->transport_id,
                "product_id"  => $transport_detail->product_id,
                "product" => [
                    "id" => $transport_detail->product->id,
                    "title" => $transport_detail->product->title,
                ],
                "unit_id"  => $transport_detail->unit_id,
                "unit" => [
                    "id" => $transport_detail->unit->id,
                    "name" => $transport_detail->unit->name,
                ],
                "description"  => $transport_detail->description,
                "quantity"  => $transport_detail->quantity,
                "price_unit"  => $transport_detail->price_unit,
                "total"  => $transport_detail->total,
                "state"  => $transport_detail->state,
                "user_entrega"  => $transport_detail->user_entrega,
                "encargado_entrega" => $transport_detail->encargado_entrega ? [
                    "id" => $transport_detail->encargado_entrega->id,
                    "full_name" => $transport_detail->encargado_entrega->name.' '.$transport_detail->encargado_entrega->surname,
                ]: NULL,
                "date_entrega"  => $transport_detail->date_entrega ? Carbon::parse($transport_detail->date_entrega)->format("Y-m-d h:i A") : NULL,

                "user_salida"  => $transport_detail->user_salida,
                "encargado_salida" => $transport_detail->encargado_salida ? [
                    "id" => $transport_detail->encargado_salida->id,
                    "full_name" => $transport_detail->encargado_salida->name.' '.$transport_detail->encargado_salida->surname,
                ]: NULL,
                "date_salida"  => $transport_detail->date_salida ? Carbon::parse($transport_detail->date_salida)->format("Y-m-d h:i A") : NULL,
            ],
            "total" => $total,
            "importe" => $importe,
            "igv" => $igv,
        ]);
    }
    public function update(Request $request,$id){
        $product = $request->product;
        $unit = $request->unit;
        $transport_detail = TransportDetail::findOrFail($id);
        $transport_detail->update([
            "product_id" => $product["id"],
            "unit_id" => $unit["id"],
            // "description",
            "quantity" => $request->quantity,
            "price_unit" => $request->price_unit,
            "total" => $request->total,
        ]);

        $total = $request->total_purchase;
        $importe = $request->importe;
        $igv = $request->igv;

        $transport = Transport::findOrFail($request->transport_id);
        $transport->update([
            "total" => $total,
            "importe" => $importe,
            "igv" => $igv,
        ]);
        return response()->json([
            "transport_detail" => [
                "id" => $transport_detail->id,
                "transport_id"  => $transport_detail->transport_id,
                "product_id"  => $transport_detail->product_id,
                "product" => [
                    "id" => $transport_detail->product->id,
                    "title" => $transport_detail->product->title,
                ],
                "unit_id"  => $transport_detail->unit_id,
                "unit" => [
                    "id" => $transport_detail->unit->id,
                    "name" => $transport_detail->unit->name,
                ],
                "description"  => $transport_detail->description,
                "quantity"  => $transport_detail->quantity,
                "price_unit"  => $transport_detail->price_unit,
                "total"  => $transport_detail->total,
                "state"  => $transport_detail->state,
                "user_entrega"  => $transport_detail->user_entrega,
                "encargado_entrega" => $transport_detail->encargado_entrega ? [
                    "id" => $transport_detail->encargado_entrega->id,
                    "full_name" => $transport_detail->encargado_entrega->name.' '.$transport_detail->encargado_entrega->surname,
                ]: NULL,
                "date_entrega"  => $transport_detail->date_entrega ? Carbon::parse($transport_detail->date_entrega)->format("Y-m-d h:i A") : NULL,

                "user_salida"  => $transport_detail->user_salida,
                "encargado_salida" => $transport_detail->encargado_salida ? [
                    "id" => $transport_detail->encargado_salida->id,
                    "full_name" => $transport_detail->encargado_salida->name.' '.$transport_detail->encargado_salida->surname,
                ]: NULL,
                "date_salida"  => $transport_detail->date_salida ? Carbon::parse($transport_detail->date_salida)->format("Y-m-d h:i A") : NULL,
            ],
            "total" => $total,
            "importe" => $importe,
            "igv" => $igv,
        ]);
    }
    public function destroy(Request $request,$id){
        $transport_detail = TransportDetail::findOrFail($id);
        $transport_detail->delete();

        $total = $request->get("total");
        $importe = $request->get("importe");
        $igv = $request->get("igv");
        $transport = Transport::findOrFail($request->get("transport_id"));
        $transport->update([
            "total" => $total,
            "importe" => $importe,
            "igv" => $igv,
        ]);

        return response()->json([
            "message" => 200,
            "total" => $total,
            "importe" => $importe,
            "igv" => $igv,
        ]);
    }
}
