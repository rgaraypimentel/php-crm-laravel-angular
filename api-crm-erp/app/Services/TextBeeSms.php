<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\RequestException;

class TextBeeSms
{
    public function send(string $phone, string $message): array
    {
        $baseUrl  = rtrim(config('textbee.base_url'), '/');
        $apiKey   = config('textbee.api_key');
        $deviceId = config('textbee.device_id');

        $url = "{$baseUrl}/gateway/devices/{$deviceId}/send-sms";

        try {
            $resp = Http::withHeaders([
                    'x-api-key'     => $apiKey,
                    'Content-Type'  => 'application/json',
                ])
                ->post($url, [
                    'recipients' => [$phone],
                    'message'    => $message,
                ])
                ->throw()
                ->json();

            // Normalizamos un poco la respuesta esperada
            $data = $resp['data'] ?? [];
            return [
                'id'        => $data['_id']    ?? null,
                'status'    => $data['status'] ?? null,
                'raw'       => $resp,
            ];
        } catch (RequestException $e) {
            return [
                'id'     => null,
                'status' => 'ERROR',
                'raw'    => [
                    'code' => optional($e->response)->status(),
                    'body' => optional($e->response)->json(),
                    'msg'  => $e->getMessage(),
                ],
            ];
        }
    }
}
