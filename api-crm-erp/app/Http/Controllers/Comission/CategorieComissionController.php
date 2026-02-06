<?php

namespace App\Http\Controllers\Comission;

use App\Http\Controllers\Controller;
use App\Models\Commission\Commission;
use App\Models\Configuration\ProductCategorie;
use Illuminate\Http\Request;

class CategorieComissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get("search");

        $categorie_commissions = Commission::whereHas("categorie",function($suq) use($search){
            $suq->where("name","like","%".$search."%");
        })->orderBy("id","desc")->paginate(25);

        $categorias = ProductCategorie::where("state",1)->get();
        return response()->json([
            "total" => $categorie_commissions->total(),
            "categorie_commissions" => $categorie_commissions->map(function($categorie_commission) {
                return [
                    "id" => $categorie_commission->id,
                    "product_categorie_id" => $categorie_commission->product_categorie_id,
                    "categorie" => [
                        "id" =>  $categorie_commission->categorie->id,
                        "name" =>  $categorie_commission->categorie->name,
                    ],
                    "state" => $categorie_commission->state,
                    "amount" => $categorie_commission->amount,
                    "percentage" => $categorie_commission->percentage,
                    "created_at" => $categorie_commission->created_at->format("Y-m-d h:i A")
                ];
            }),
            "categorias" => $categorias,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $categorie_commission = Commission::create($request->all());
        return response()->json([
            "message" => 200,
            "categorie_commission" => [
                "id" => $categorie_commission->id,
                "product_categorie_id" => $categorie_commission->product_categorie_id,
                "categorie" => [
                    "id" =>  $categorie_commission->categorie->id,
                    "name" =>  $categorie_commission->categorie->name,
                ],
                "state" => 1,//$categorie_commission->state,
                "amount" => $categorie_commission->amount,
                "percentage" => $categorie_commission->percentage,
                "created_at" => $categorie_commission->created_at->format("Y-m-d h:i A")
            ],
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
        $categorie_commission = Commission::findOrFail($id);
        $categorie_commission->update($request->all());
        return response()->json([
            "message" => 200,
            "categorie_commission" => [
                "id" => $categorie_commission->id,
                "product_categorie_id" => $categorie_commission->product_categorie_id,
                "categorie" => [
                    "id" =>  $categorie_commission->categorie->id,
                    "name" =>  $categorie_commission->categorie->name,
                ],
                "state" => $categorie_commission->state,
                "amount" => $categorie_commission->amount,
                "percentage" => $categorie_commission->percentage,
                "created_at" => $categorie_commission->created_at->format("Y-m-d h:i A")
            ],
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $categorie_commission = Commission::findOrFail($id);
        $categorie_commission->delete();
        return response()->json([
            "message" => 200,
        ]);
    }
}
