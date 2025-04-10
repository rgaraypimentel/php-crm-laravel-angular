<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\UserAccessController;
use App\Http\Controllers\Configuration\UnitController;
use App\Http\Controllers\Configuration\SucursaleController;
use App\Http\Controllers\Configuration\WerehouseController;
use App\Http\Controllers\Configuration\ClientSegmentController;
use App\Http\Controllers\Configuration\MethodPaymentController;
use App\Http\Controllers\Configuration\ProductCategorieController;
use App\Http\Controllers\Configuration\ProviderController;
use App\Http\Controllers\Configuration\SucursaleDeliverieController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group([

    //'middleware' => 'auth:api',
    'prefix' => 'auth',
    // 'middleware' => ['auth:api']//'permission:publish articles|edit articles'

], function ($router) {
    Route::post('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::post('/refresh', [AuthController::class, 'refresh'])->name('refresh');
    Route::post('/me', [AuthController::class, 'me'])->name('me');
});

Route::group([
    'middleware' => 'auth:api',
], function ($router) {
    Route::resource("roles",RolePermissionController::class);
    Route::post('/users/{id}', [UserAccessController::class, 'update']);
    Route::get('/users/config', [UserAccessController::class, 'config']);
    Route::resource("users",UserAccessController::class);

    Route::resource("sucursales",SucursaleController::class);
    Route::resource("warehouses",WerehouseController::class);
    Route::resource("sucursale_deliveries",SucursaleDeliverieController::class);
    Route::resource("method_payments",MethodPaymentController::class);
    Route::resource("client_segments",ClientSegmentController::class);

    Route::post('/product_categories/{id}', [ProductCategorieController::class, 'update']);
    Route::resource("product_categories",ProductCategorieController::class);

    Route::post('/providers/{id}', [ProviderController::class, 'update']);
    Route::resource("providers",ProviderController::class);

    Route::post('/units/add-transform', [UnitController::class, 'add_transform']);
    Route::delete('/units/delete-transform/{id}', [UnitController::class, 'delete_transform']);
    Route::resource("units",UnitController::class);
});
