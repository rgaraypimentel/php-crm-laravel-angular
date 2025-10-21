<?php

namespace App\Http\Controllers\Facturacion;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\ConsultaRucService;

class ConsultaRucController extends Controller
{

    public function buscar($numero)
    {
        $rucService = new ConsultaRucService;

        $response = $rucService->obtenerDatos($numero);

        if ($response->successful()) {
            return response()->json($response->json());
        }

        return response()->json([
            'error' => 'Error consultando RUC',
            'status' => $response->status()
        ], $response->status());
    }
}
