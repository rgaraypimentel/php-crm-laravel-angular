<?php

namespace App\Http\Resources\Client;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
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
            "name" => $this->resource->name,
            "surname" => $this->resource->surname,
            "full_name" => $this->resource->full_name,
            "client_segment_id" => $this->resource->client_segment_id,
            "client_segment" =>  $this->resource->client_segment ? [
                "id" => $this->resource->client_segment->id,
                "name" => $this->resource->client_segment->name,
            ]: NULL,
            "phone" => $this->resource->phone,
            "email" => $this->resource->email,
            "type" => $this->resource->type,
            "type_document" => $this->resource->type_document,
            "n_document" => $this->resource->n_document,
            "birthdate" => $this->resource->birthdate ? Carbon::parse($this->resource->birthdate)->format("Y-m-d") : NULL,
            "sucursale_id" => $this->resource->sucursale_id,
            "sucursale" => $this->resource->sucursale ? [
                "id" => $this->resource->sucursale->id,
                "name" => $this->resource->sucursale->name,
            ]: NULL,
            "asesor_id" => $this->resource->asesor_id,
            "sucursale" => $this->resource->asesor ? [
                "id" => $this->resource->asesor->id,
                "full_name" => $this->resource->asesor->name.' '.$this->resource->asesor->surname,
            ]: NULL,
            "is_parcial" => $this->resource->is_parcial,
            "address" => $this->resource->address,
            "origen" => $this->resource->origen,
            "sexo" => $this->resource->sexo,
            "ubigeo_region" => $this->resource->ubigeo_region,
            "ubigeo_provincia" => $this->resource->ubigeo_provincia,
            "ubigeo_distrito" => $this->resource->ubigeo_distrito,
            "region" => $this->resource->region,
            "provincia" => $this->resource->provincia,
            "distrito" => $this->resource->distrito,
            "state" => $this->resource->state,
            "created_at" => $this->resource->created_at->format("Y-m-d h:i A"),
        ];
    }
}
