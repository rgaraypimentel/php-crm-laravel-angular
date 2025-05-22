<?php

namespace App\Http\Resources\Transport;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransportResource extends JsonResource
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
            "warehouse_start_id" => $this->resource->warehouse_start_id,
            "warehouse_start" => [
                "id" => $this->resource->warehouse_start->id,
                "name" => $this->resource->warehouse_start->name,
            ],
            "warehouse_end_id" => $this->resource->warehouse_end_id,
            "warehouse_end" => [
                "id" => $this->resource->warehouse_end->id,
                "name" => $this->resource->warehouse_end->name,
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
            "date_emision" => Carbon::parse($this->resource->date_emision)->format("Y-m-d"),
            "description" => $this->resource->description,
            "date_entrega" => $this->resource->date_entrega ? Carbon::parse($this->resource->date_entrega)->format("Y-m-d h:i A") : NULL,
            "total" => $this->resource->total,
            "importe" => $this->resource->importe,
            "igv" => $this->resource->igv,
            "details" => $this->resource->details->map(function($detail){
                return [
                    "id" => $detail->id,
                    "transport_id"  => $detail->transport_id,
                    "product_id"  => $detail->product_id,
                    "product" => [
                        "id" => $detail->product->id,
                        "title" => $detail->product->title,
                        "warehouses" => $detail->product->warehouses->map(function($warehouse) {
                            return [
                                "id" => $warehouse->id,
                                "unit" => $warehouse->unit,
                                "warehouse" => $warehouse->warehouse,
                                "quantity" => $warehouse->stock,
                            ];
                        }),
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
                    "encargado_entrega" => $detail->encargado_entrega ? [
                        "id" => $detail->encargado_entrega->id,
                        "full_name" => $detail->encargado_entrega->name.' '.$detail->encargado_entrega->surname,
                    ]: NULL,
                    "date_entrega"  => $detail->date_entrega ? Carbon::parse($detail->date_entrega)->format("Y-m-d h:i A") : NULL,

                    "user_salida"  => $detail->user_salida,
                    "encargado_salida" => $detail->encargado_salida ? [
                        "id" => $detail->encargado_salida->id,
                        "full_name" => $detail->encargado_salida->name.' '.$detail->encargado_salida->surname,
                    ]: NULL,
                    "date_salida"  => $detail->date_salida ? Carbon::parse($detail->date_salida)->format("Y-m-d h:i A") : NULL,
                ];
            }),
        ];
    }
}
