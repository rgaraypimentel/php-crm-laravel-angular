<?php

namespace App\Http\Resources\Caja\Proforma;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProformaCajaResource extends JsonResource
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
            "user_id" => $this->resource->user_id,
            "asesor" => [
                "id" => $this->resource->asesor->id,
                "full_name" => $this->resource->asesor->name.' '.$this->resource->asesor->surname,
            ],
            "client_id" => $this->resource->client_id,
            "client" => [
                "id" => $this->resource->client->id,
                "full_name" =>  $this->resource->client->full_name,
                // "client_segment" => $this->resource->client->client_segment,
                "client_segment" => [
                    "id" => $this->resource->client_segment->id,
                    "name" => $this->resource->client_segment->name,
                ],
                "phone" => $this->resource->client->phone,
                "type" => $this->resource->client->type,
                "n_document" => $this->resource->client->n_document,
                "is_parcial" => $this->resource->client->is_parcial,
            ],
            "client_segment_id" => $this->resource->client_segment_id,
            "client_segment" => [
                "id" => $this->resource->client_segment->id,
                "name" => $this->resource->client_segment->name,
            ],
            "sucursale_id" => $this->resource->sucursale_id,
            "sucursale" => [
                "id" => $this->resource->sucursale->id,
                "name" => $this->resource->sucursale->name,
            ],
            "subtotal" => round($this->resource->subtotal,2),
            "discount" => $this->resource->discount,
            "total" => round($this->resource->total,2),
            "igv" => round($this->resource->igv,2),
            "state_proforma" => $this->resource->state_proforma,
            "state_payment" => $this->resource->state_payment,
            "debt" => round($this->resource->debt,2),
            "paid_out" => round($this->resource->paid_out,2),
            "date_validation" => $this->resource->date_validation,
            "date_pay_complete" => $this->resource->date_pay_complete,
            "description" => $this->resource->description,
            "created_at" => $this->resource->created_at->format("Y-m-d h:i:A"),
            "proforma_deliverie" => [
                "id" => $this->resource->proforma_deliverie->id,
                "sucursale_deliverie_id" => $this->resource->proforma_deliverie->sucursale_deliverie_id,
                "sucursal_deliverie" => [
                    "id" => $this->resource->proforma_deliverie->sucursal_deliverie->id,
                    "name" => $this->resource->proforma_deliverie->sucursal_deliverie->name,
                ],
                "date_entrega" => Carbon::parse($this->resource->proforma_deliverie->date_entrega)->format("Y-m-d"),
                "date_envio"  => Carbon::parse($this->resource->proforma_deliverie->date_envio)->format("Y/m/d"),
            ],
            "pagos" => $this->resource->proforma_payments->map(function($payment) {
                return [
                    "id" => $payment->id,
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
