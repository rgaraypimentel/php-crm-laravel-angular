<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class ConsultaRucService
{
    public function obtenerDatos($numero)
    {
        return Http::withHeaders([
            'Authorization' => 'Bearer ' . env('APIS_NET_TOKEN'),
        ])->get(env('APIS_NET_URL') . '/ruc', [
            'numero' => $numero
        ]);
    }
}