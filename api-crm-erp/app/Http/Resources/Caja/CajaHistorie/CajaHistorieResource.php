<?php

namespace App\Http\Resources\Caja\CajaHistorie;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Caja\Proforma\ProformaCajaResource;

class CajaHistorieResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->resource->id,
            "caja_sucursale_id" => $this->resource->caja_sucursale_id,
            "proforma_id" => $this->resource->proforma_id,
            "proforma" => ProformaCajaResource::make($this->resource->proforma),
            "amount" => $this->resource->amount,
            "created_at" => $this->resource->created_at->format("Y-m-d h:i A"),
            "pagos" => $this->resource->caja_payments->map(function($caja_payment) {
                $payment = $caja_payment->proforma_payment;
                return [
                    "id" => $caja_payment->id,
                    "amount_edit" => $caja_payment->amount,
                    "method_payment_id" => $payment->method_payment_id,
                    "banco_id" => $payment->banco_id,
                    "method_payment" => [
                        "id" =>  $payment->method_payment->id,
                        "name" =>$payment->method_payment->name,
                    ],
                    "amount" => $payment->amount,
                    "date_validation" => $payment->date_validation,
                    "n_transaccion" => $payment->n_transaccion,
                    "verification" => $payment->verification,
                    "user_verification" => $payment->user_verific ? [
                        "id" => $payment->user_verific->id,
                        "full_name" => $payment->user_verific->name . ' ' .$payment->user_verific->surname,
                    ] : NULL,
                    "imagen" => $payment->vaucher ? env("APP_URL")."storage/".$payment->vaucher : NULL,
                ];
            })
        ];
    }
}
