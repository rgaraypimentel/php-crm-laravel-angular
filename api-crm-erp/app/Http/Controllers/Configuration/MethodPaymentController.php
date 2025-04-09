<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Configuration\MethodPayment;

class MethodPaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get("search");

        $method_payments = MethodPayment::where("name","like","%".$search."%")->orderBy("id","desc")->paginate(25);

        return response()->json([
            "total" => $method_payments->total(),
            "method_payments" => $method_payments->map(function($method_pay) {
                return [
                    "id" => $method_pay->id,
                    "name" => $method_pay->name,
                    "method_payment_id" => $method_pay->method_payment_id,
                    "method_payment" => $method_pay->method_payment,
                    "method_payments" => $method_pay->method_payments,
                    "state" => $method_pay->state,
                    "created_at" => $method_pay->created_at->format("Y-m-d h:i A")
                ];
            }),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $is_exits_method_payment = MethodPayment::where("name",$request->name)->first();
        if($is_exits_method_payment){
            return response()->json([
                "message" => 403,
                "message_text" => "El nombre del metodo de pago ya existe"
            ]);
        }
        $method_pay = MethodPayment::create($request->all());
        return response()->json([
            "message" => 200,
            "method_payment" => [
                "id" => $method_pay->id,
                "name" => $method_pay->name,
                "method_payment_id" => $method_pay->method_payment_id,
                "method_payment" => $method_pay->method_payment,
                "state" => $method_pay->state ?? 1,
                "created_at" => $method_pay->created_at->format("Y-m-d h:i A")
            ],
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
        $is_exits_method_payment = MethodPayment::where("name",$request->name)
                            ->where("id","<>",$id)->first();
        if($is_exits_method_payment){
            return response()->json([
                "message" => 403,
                "message_text" => "El nombre del metodo de pago ya existe"
            ]);
        }
        $method_pay = MethodPayment::findOrFail($id);
        $method_pay->update($request->all());
        return response()->json([
            "message" => 200,
            "method_payment" => [
                "id" => $method_pay->id,
                "name" => $method_pay->name,
                "method_payment_id" => $method_pay->method_payment_id,
                "method_payment" => $method_pay->method_payment,
                "state" => $method_pay->state,
                "created_at" => $method_pay->created_at->format("Y-m-d h:i A")
            ],
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $method_pay = MethodPayment::findOrFail($id);
        // VALIDACION POR PROFORMA
        $method_pay->delete();
        return response()->json([
            "message" => 200,
        ]);
    }
}
