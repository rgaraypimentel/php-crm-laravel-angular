<?php

namespace App\Http\Resources\Product;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $units = collect([]);
        foreach ($this->resource->wallets->groupBy("unit_id") as $unit_only) {
            $units->push($unit_only[0]->unit);
        }
        return [
            "id" => $this->resource->id,
            "title" => $this->resource->title,
            "sku" => $this->resource->sku,
            "product_categorie_id" => $this->resource->product_categorie_id,
            "product_categorie" => [
                "id" => $this->resource->product_categorie->id,
                "name" => $this->resource->product_categorie->name,
            ],
            "imagen" => $this->resource->product_imagen,// env("APP_URL")."storage/".$this->resource->imagen,
            "price_general" => $this->resource->price_general,
            "description" => $this->resource->description,
            "specifications" => $this->resource->specifications ? json_decode($this->resource->specifications) : [],
            "min_discount" => $this->resource->min_discount,
            "max_discount" => $this->resource->max_discount,
            "is_gift" => $this->resource->is_gift,
            "umbral" => $this->resource->umbral,
            "state" => $this->resource->state,
            "state_stock" => $this->resource->state_stock,
            "umbral_unit_id" => $this->resource->umbral_unit_id,
            "umbral_unit" => $this->resource->umbral_unit ? [
                "id" => $this->resource->umbral_unit->id,
                "name" => $this->resource->umbral_unit->name
            ] : NULL,
            "disponibilidad" => $this->resource->disponibilidad,
            "tiempo_de_abastecimiento"=> $this->resource->tiempo_de_abastecimiento,
            "provider_id"=> $this->resource->provider_id,
            "provider"=> $this->resource->provider ? [
                "id" => $this->resource->provider->id,
                "full_name" => $this->resource->provider->full_name,
            ]: NULL,
            "is_discount"=> $this->resource->is_discount,
            "tax_selected"=> $this->resource->tax_selected,
            "importe_iva"=> $this->resource->importe_iva,
            "weight"=> $this->resource->weight,
            "width"=> $this->resource->width,
            "height"=> $this->resource->height,
            "length"=> $this->resource->length,
            "wallets" => $this->resource->wallets->map(function ($wallet) {
                return [
                    "id" => $wallet->id,
                    "unit" => $wallet->unit,
                    "sucursale" => $wallet->sucursale,
                    "client_segment" => $wallet->client_segment,
                    "price_general" => $wallet->price,
                    "sucursale_price_multiple" =>  $wallet->sucursale ?  $wallet->sucursale->id : NULL,
                    "client_segment_price_multiple" => $wallet->client_segment ? $wallet->client_segment->id : NULL,
                ];
            }),
            "warehouses" =>$this->resource->warehouses->map(function ($warehouse) {
                return [
                    "id" => $warehouse->id,
                    "unit" => $warehouse->unit,
                    "warehouse" => $warehouse->warehouse,
                    "quantity" => $warehouse->stock,
                ];
            }),
            "units" => $units,
        ];
    }
}
