<?php

namespace App\Http\Resources\Purchase;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseResource extends JsonResource
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
            "warehouse_id" => $this->resource->warehouse_id,
            "warehouse" => [
                "id" => $this->resource->warehouse->id,
                "name" => $this->resource->warehouse->name,
            ],
            "user_id" => $this->resource->user_id,
            "user" => [
                "id" => $this->resource->user->id,
                "full_name" => $this->resource->user->name.' '.$this->resource->user->surname,
                "sucursale" => [
                    "id" => $this->resource->user->sucursale->id,
                    "name" => $this->resource->user->sucursale->name,
                ]
            ],
            "state" => $this->resource->state,
            "provider_id" => $this->resource->provider_id,
            "provider" => [
                "id" => $this->resource->provider->id,
                "full_name" => $this->resource->provider->full_name,
            ],
            "date_emision" => Carbon::parse($this->resource->date_emision)->format("Y-m-d"),
            "type_comprobant" => $this->resource->type_comprobant,
            "n_comprobant" => $this->resource->n_comprobant,
            "description" => $this->resource->description,
            "date_entrega" => $this->resource->date_entrega ? Carbon::parse($this->resource->date_entrega)->format("Y-m-d h:i A") : NULL,
            "total" => $this->resource->total,
            "importe" => $this->resource->importe,
            "igv" => $this->resource->igv,
            "details" => $this->resource->details->map(function($detail){
                return [
                    "id" => $detail->id,
                    "purchase_id"  => $detail->purchase_id,
                    "product_id"  => $detail->product_id,
                    "product" => [
                        "id" => $detail->product->id,
                        "title" => $detail->product->title,
                    ],
                    "unit_id"  => $detail->unit_id,
                    "unit" => [
                        "id" => $detail->unit->id,
                        "name" => $detail->unit->name,
                    ],
                    "description"  => $detail->description,
                    "quantity"  => $detail->quantity,
                    "price_unit"  => $detail->price_unit,
                    "total"  => $detail->total,
                    "state"  => $detail->state,
                    "user_entrega"  => $detail->user_entrega,
                    "encargado" => $detail->encargado ? [
                        "id" => $detail->encargado->id,
                        "full_name" => $detail->encargado->name.' '.$detail->encargado->surname,
                    ]: NULL,
                    "date_entrega"  => $detail->date_entrega ? Carbon::parse($detail->date_entrega)->format("Y-m-d h:i A") : NULL,
                ];
            }),
        ];
    }
}
