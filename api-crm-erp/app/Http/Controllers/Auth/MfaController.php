<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use BaconQrCode\Writer;
use App\Services\TextBeeSms;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Tymon\JWTAuth\Facades\JWTFactory;
use BaconQrCode\Renderer\ImageRenderer;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Validator;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use PragmaRX\Google2FALaravel\Facade as Google2FA;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use Illuminate\Support\Facades\Log;


class MfaController extends Controller
{
    // POST /auth/mfa/setup  (JWT pleno requerido)
    public function setup(Request $request)
    {
        $user = Auth::guard('api')->user();

        // 1) Generar secreto TOTP temporal (NO BD)
        $secret = Google2FA::generateSecretKey(32);

        // 2) Guardar temporalmente en caché 5-10 min
        $cacheKey = "mfa:setup:{$user->id}";
        Cache::put($cacheKey, $secret, now()->addMinutes(10));

        // 3) Armar otpauth:// (issuer = APP_NAME, account = email)
        $issuer  = config('app.name');
        $account = $user->email;

        $otpauth = Google2FA::getQRCodeUrl(
            $issuer,
            $account,
            $secret
        );

        // 4) Generar QR SVG usando Bacon QR Code
        $renderer = new ImageRenderer(
            new RendererStyle(240), // Tamaño del QR
            new SvgImageBackEnd()   // Formato SVG
        );

        $writer = new Writer($renderer);
        $qrCodeSvg = base64_encode($writer->writeString($otpauth));

        return response()->json([
            'otpauth_url'  => $otpauth,
            'qr_svg'       => $qrCodeSvg,
            'secret_masked' => substr($secret, 0, 4) . ' •••• ' . substr($secret, -4),
        ]);
    }

    // POST /auth/mfa/enable  (JWT pleno requerido)  body: { otp }
    public function enable(Request $request)
    {
        $user = Auth::guard('api')->user();

        $validator = Validator::make($request->all(), [
            'otp' => 'required|digits:6',
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => 'OTP requerido (6 dígitos).'], 422);
        }

        $cacheKey = "mfa:setup:{$user->id}";
        $secret   = Cache::get($cacheKey);

        if (!$secret) {
            return response()->json(['message' => 'Setup expirado o no iniciado.'], 410);
        }

        // Validar OTP contra el secreto temporal
        $isValid = Google2FA::verifyKey($secret, $request->input('otp'), 1);
        if (!$isValid) {
            return response()->json(['message' => 'OTP inválido.'], 401);
        }

        // Persistir el secreto (cifrado por $casts) y limpiar cache
        $user->google2fa_secret = $secret;
        $user->save();
        Cache::forget($cacheKey);

        return response()->json(['two_factor_enabled' => true]);
    }

    // POST /auth/mfa/disable  (JWT pleno requerido)  body: { otp }
    public function disable(Request $request)
    {
        $user = Auth::guard('api')->user();

        if (empty($user->google2fa_secret)) {
            return response()->json(['message' => '2FA ya está deshabilitado.'], 400);
        }

        $validator = Validator::make($request->all(), [
            'otp' => 'required|digits:6',
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => 'OTP requerido (6 dígitos).'], 422);
        }

        // Validar OTP contra el secreto actual en BD
        $isValid = Google2FA::verifyKey($user->google2fa_secret, $request->input('otp'), 1);
        if (!$isValid) {
            return response()->json(['message' => 'OTP inválido.'], 401);
        }

        // Deshabilitar 2FA
        $user->google2fa_secret = null;
        $user->save();

        return response()->json(['two_factor_enabled' => false]);
    }

    // GET /auth/mfa/status  (JWT pleno requerido)
    public function status()
    {
        $user = Auth::guard('api')->user();
        return response()->json([
            'two_factor_enabled' => !empty($user->google2fa_secret),
        ]);
    }

    // POST /auth/mfa/verify   (público) body: { mfa_token, otp }
    public function verify(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mfa_token' => 'required|string',
            'otp'       => 'required|digits:6',
        ]);
        if ($validator->fails()) {
            return response()->json(['message' => 'mfa_token y otp son requeridos.'], 422);
        }

        try {
            $payload = JWTAuth::setToken($request->input('mfa_token'))->getPayload();

            // Debe ser un token de propósito MFA
            if (($payload->get('purpose') ?? null) !== 'mfa') {
                return response()->json(['message' => 'mfa_token inválido.'], 400);
            }

            $userId = $payload->get('uid');
            /** @var User $user */
            $user   = User::findOrFail($userId);

            if (empty($user->google2fa_secret)) {
                return response()->json(['message' => '2FA no está habilitado para este usuario.'], 400);
            }

            // Validar OTP contra el secreto persistido
            $isValid = Google2FA::verifyKey($user->google2fa_secret, $request->input('otp'), 1);
            if (!$isValid) {
                return response()->json(['message' => 'OTP inválido.'], 401);
            }

            // Si todo ok, emitimos el JWT "pleno"
            $token = Auth::guard('api')->login($user);
            return AuthController::respondWithToken($token);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'mfa_token inválido o expirado.'], 401);
        }
    }

    public function sendLoginOtpSms(Request $request, TextBeeSms $sms)
    {
        $validator = Validator::make($request->all(), [
            'mfa_token' => 'required|string',
        ]);
        if ($validator->fails()) {
            return response()->json(['error' => 'mfa_token requerido'], 422);
        }

        try {
            $payload = JWTAuth::setToken($request->input('mfa_token'))->getPayload();

            if (($payload->get('purpose') ?? null) !== 'mfa') {
                return response()->json(['error' => 'mfa_token inválido'], 400);
            }

            $userId = $payload->get('uid');
            /** @var \App\Models\User $user */
            $user = \App\Models\User::findOrFail($userId);

            // Requisitos: 2FA activo + teléfono
            if (empty($user->google2fa_secret)) {
                return response()->json(['error' => '2FA no está habilitado para este usuario'], 400);
            }
            $phone = $user->phone ?? null;
            if (empty($phone)) {
                return response()->json(['error' => 'El usuario no tiene teléfono registrado'], 422);
            }

            // --- Rate limit muy simple ---
            $rlPrefix = "mfa:otp:uid:{$user->id}";
            $cntKey   = "{$rlPrefix}:count5m";
            $lastKey  = "{$rlPrefix}:lastSent";

            $count = (int) Cache::get($cntKey, 0);
            if ($count >= 3) {
                return response()->json(['error' => 'too_many_requests', 'message' => 'Has superado el límite (3 SMS en 5 min)'], 429);
            }

            $last = Cache::get($lastKey);
            if ($last && now()->diffInSeconds($last) < 30) {
                return response()->json(['error' => 'rate_limited', 'message' => 'Espera unos segundos para reenviar'], 429);
            }

            // Generar el TOTP vigente
            $otp = Google2FA::getCurrentOtp($user->google2fa_secret);

            // Mensaje corto (evita revelar app/URL internas)
            $msg = "Tu código de acceso es: {$otp}. Expira en 30s.";

            // Enviar vía TextBee
            $gateway = $sms->send($this->formatE164($phone), $msg);

            // Actualiza rate-limit
            Cache::put($lastKey, now(), now()->addMinutes(5));
            Cache::put($cntKey, $count + 1, now()->addMinutes(5));

            // Opcional: guarda id del SMS por si luego quieres consultar/depurar
            $smsKey = "mfa:sms:last:uid:{$user->id}";
            Cache::put($smsKey, [
                'gateway_message_id' => $gateway['id'] ?? null,
                'status'             => $gateway['status'] ?? null,
                'sent_at'            => now()->toISOString(),
            ], now()->addMinutes(10));

            // Para pruebas locales, puedes exponer el OTP SOLO en local
            $debugOtp = app()->environment('local') ? $otp : null;

            return response()->json([
                'sent'       => ($gateway['status'] ?? null) !== 'ERROR',
                'to_masked'  => $this->maskPhone($phone),
                'sms'        => [
                    'id'     => $gateway['id'] ?? null,
                    'status' => $gateway['status'] ?? null,
                ],
                'approx_expires_in_seconds' => 60,
                'debug_otp' => $debugOtp, // cuidado: solo en local
            ]);
        } catch (\Throwable $e) {
            return response()->json(['error' => 'mfa_token inválido o expirado'], 401);
        }
    }

    public function sendSetupOtpSms(Request $request, TextBeeSms $sms)
    {
        $user = Auth::guard('api')->user();

        // 1) Validaciones previas
        // Se requiere que exista un setup vigente (secreto temporal en cache)
        $cacheKey = "mfa:setup:{$user->id}";
        $secret   = Cache::get($cacheKey);
        if (empty($secret)) {
            return response()->json([
                'error' => 'setup_expired',
                'message' => 'No hay un setup activo o ya expiró. Genera un nuevo QR.'
            ], 410);
        }

        // Teléfono obligatorio
        $phone = $user->phone ?? null;
        if (empty($phone)) {
            return response()->json([
                'error' => 'phone_missing',
                'message' => 'El usuario no tiene teléfono registrado.'
            ], 422);
        }

        // 2) Rate-limit específico para SETUP (separado del de login MFA)
        $rlPrefix = "mfa:setup:otp:uid:{$user->id}";
        $cntKey   = "{$rlPrefix}:count5m";
        $lastKey  = "{$rlPrefix}:lastSent";

        $count = (int) Cache::get($cntKey, 0);
        if ($count >= 3) {
            return response()->json([
                'error' => 'too_many_requests',
                'message' => 'Has superado el límite (3 SMS en 5 min)'
            ], 429);
        }
        $last = Cache::get($lastKey);
        if ($last && now()->diffInSeconds($last) < 30) {
            return response()->json([
                'error' => 'rate_limited',
                'message' => 'Espera unos segundos para reenviar'
            ], 429);
        }

        // 3) Generar el OTP con el SECRETO TEMPORAL (no el de BD)
        $otp = Google2FA::getCurrentOtp($secret);

        // 4) Enviar SMS
        $msg = "Código para activar 2FA: {$otp}.";
        $to  = $this->formatE164($phone);
        $gateway = $sms->send($to, $msg);

        // 5) Actualizar rate-limit
        Cache::put($lastKey, now(), now()->addMinutes(5));
        Cache::put($cntKey,  $count + 1, now()->addMinutes(5));

        // 6) Guardar meta (opcional)
        Cache::put("mfa:setup:sms:last:uid:{$user->id}", [
            'gateway_message_id' => $gateway['id'] ?? null,
            'status'             => $gateway['status'] ?? null,
            'to'                 => $to,
            'sent_at'            => now()->toISOString(),
        ], now()->addMinutes(10));

        // 7) Respuesta
        return response()->json([
            'sent'      => ($gateway['status'] ?? null) !== 'ERROR',
            'to_masked' => $this->maskPhone($phone),
            'sms'       => [
                'id'     => $gateway['id'] ?? null,
                'status' => $gateway['status'] ?? null,
            ],
            // ventana típica de TOTP: 30s; toleras ±30s en enable con verifyKey(..., 1)
            'approx_expires_in_seconds' => 60,
        ]);
    }

    private function formatE164(string $phone): string
    {
        // Formato E.164 simple: si no empieza con '+', asumimos Perú (+51).
        $p = preg_replace('/\D+/', '', $phone);
        if (str_starts_with($phone, '+')) {
            return '+' . $p;
        }
        // Ajusta a tu realidad de datos:
        return '+51' . $p;
    }

    private function maskPhone(string $phone): string
    {
        $clean = preg_replace('/\D+/', '', $phone);
        $len   = strlen($clean);
        if ($len <= 4) return str_repeat('*', max(0, $len));
        return str_repeat('*', $len - 4) . substr($clean, -4);
    }
}
