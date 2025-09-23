<?php

namespace App\Http\Controllers;

use Validator;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Tymon\JWTAuth\Facades\JWTFactory;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    /**
     * Register a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register()
    {
        // $this -> authorize ("create",User::class);
        $validator = Validator::make(request()->all(), [
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }

        $user = new User;
        $user->name = request()->name;
        $user->email = request()->email;
        $user->password = bcrypt(request()->password);
        $user->save();

        return response()->json($user, 201);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        $credentials = request(['email', 'password']);

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = auth('api')->user();

        // Si el usuario tiene 2FA habilitado, pedir OTP (no devolvemos el token pleno)
        if (!empty($user->google2fa_secret)) {

            // Invalidar el token pleno que acabamos de generar
            auth('api')->logout();

            // Crear un mfa_token de vida corta (5-10 min), SIN "sub"
            $claims  = JWTFactory::customClaims([
                'purpose' => 'mfa',
                'uid'     => $user->id,
                'amr'     => ['pwd'],   // authentication methods reference
                'exp'     => now()->addMinutes(10)->timestamp,
                'iat'     => now()->timestamp,
            ])->make();

            $mfaToken = JWTAuth::encode($claims)->get();

            // Guarda el contexto para reenvíos y verificación
            Cache::put("mfa:ctx:{$mfaToken}", [
                'user_id' => $user->id,
                'phone'   => $user->phone,   // <- ¡importante!
            ], now()->addMinutes(10));

            return response()->json([
                'mfa_required' => true,
                'mfa_token'    => $mfaToken,
                'user_hint'    => substr($user->email, 0, 2) . '***@***' . substr(strrchr($user->email, "@"), 1), // opcional
            ], 200);
        }

        // Caso normal: devolver el token pleno
        return $this->respondWithToken($token);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth('api')->user());
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth('api')->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth('api')->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public static function respondWithToken($token)
    {
        $permissions = auth("api")->user()->getAllPermissions()->map(function ($perm) {
            return $perm->name;
        });
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => [
                "full_name" => auth("api")->user()->name . ' ' . auth("api")->user()->username,
                "email" => auth("api")->user()->email,
                "avatar" => auth('api')->user()->avatar ? env("APP_URL") . "storage/" . auth('api')->user()->avatar : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                "role_name" => auth("api")->user()->role->name,
                "permissions" => $permissions,
                "sucursale_id" => auth("api")->user()->sucursale_id,
                "sucursale_name" => auth('api')->user()->sucursale->name,
                'two_factor_enabled' => !empty((auth('api')->user())->google2fa_secret),
            ]
        ]);
    }
}
