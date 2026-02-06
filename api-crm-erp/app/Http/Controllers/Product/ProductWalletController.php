<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Product\ProductWallet;
use Illuminate\Http\Request;

class ProductWalletController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $product_wallet = ProductWallet::create([
            "product_id" => $request->product_id,
            "unit_id" => $request->unit_id,
            "client_segment_id" => $request->client_segment_id,
            "sucursale_id"=> $request->sucursale_id,
            "price" => $request->price_general,
        ]);

        return response()->json([
            "message" => 200,
            "product_wallet" => [
                "id" => $product_wallet->id,
                "unit" => $product_wallet->unit,
                "sucursale" => $product_wallet->sucursale,
                "client_segment" => $product_wallet->client_segment,
                "price_general" => $product_wallet->price,
                "sucursale_price_multiple" =>  $product_wallet->sucursale ?  $product_wallet->sucursale->id : NULL,
                "client_segment_price_multiple" => $product_wallet->client_segment ? $product_wallet->client_segment->id : NULL,
            ]
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product_wallet = ProductWallet::findOrFail($id);

        $product_wallet->update([
            // "product_id" => $request->product_id,
            "unit_id" => $request->unit_id,
            "client_segment_id" => $request->client_segment_id,
            "sucursale_id"=> $request->sucursale_id,
            "price" => $request->price_general,
        ]);

        return response()->json([
            "message" => 200,
            "product_wallet" => [
                "id" => $product_wallet->id,
                "unit" => $product_wallet->unit,
                "sucursale" => $product_wallet->sucursale,
                "client_segment" => $product_wallet->client_segment,
                "price_general" => $product_wallet->price,
                "sucursale_price_multiple" =>  $product_wallet->sucursale ?  $product_wallet->sucursale->id : NULL,
                "client_segment_price_multiple" => $product_wallet->client_segment ? $product_wallet->client_segment->id : NULL,
            ]
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product_wallet = ProductWallet::findOrFail($id);
        $product_wallet->delete();

        return response()->json([
            "message" => 200
        ]);
    }
}
