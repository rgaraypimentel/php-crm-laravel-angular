<?php

namespace App\Http\Resources\Caja\CajaHistorie;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class CajaHistorieCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "data" => CajaHistorieResource::collection($this->collection)
        ];
    }
}
