<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Configuration\ProductCategorie;

class ProductCategorieController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get("search");

        $categories = ProductCategorie::where("name","like","%".$search."%")->orderBy("id","desc")->paginate(25);

        return response()->json([
            "total" => $categories->total(),
            "categories" => $categories->map(function($categorie) {
                return [
                    "id" => $categorie->id,
                    "name" => $categorie->name,
                    "state" => $categorie->state,
                    "imagen" => $categorie->imagen ? env("APP_URL")."storage/".$categorie->imagen : NULL,
                    "created_at" => $categorie->created_at->format("Y-m-d h:i A")
                ];
            }),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $is_exits_categorie = ProductCategorie::where("name",$request->name)->first();
        if($is_exits_categorie){
            return response()->json([
                "message" => 403,
                "message_text" => "El nombre de la categoria ya existe"
            ]);
        }

        if($request->hasFile("categorie_imagen")){
            $path = Storage::putFile("categories",$request->file("categorie_imagen"));
            $request->request->add(["imagen" => $path]);
        }

        $categorie = ProductCategorie::create($request->all());
        return response()->json([
            "message" => 200,
            "categorie" => [
                "id" => $categorie->id,
                "name" => $categorie->name,
                "state" => $categorie->state ?? 1,
                "imagen" => $categorie->imagen ? env("APP_URL")."storage/".$categorie->imagen : NULL,
                "created_at" => $categorie->created_at->format("Y-m-d h:i A")
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
        $is_exits_categorie = ProductCategorie::where("name",$request->name)
                            ->where("id","<>",$id)->first();
        if($is_exits_categorie){
            return response()->json([
                "message" => 403,
                "message_text" => "El nombre de la categoria ya existe"
            ]);
        }
        $categorie = ProductCategorie::findOrFail($id);

        if($request->hasFile("categorie_imagen")){
            if($categorie->imagen){
                Storage::delete($categorie->imagen);
            }
            $path = Storage::putFile("categories",$request->file("categorie_imagen"));
            $request->request->add(["imagen" => $path]);
        }
    
        $categorie->update($request->all());
        return response()->json([
            "message" => 200,
            "categorie" => [
                "id" => $categorie->id,
                "name" => $categorie->name,
                "state" => $categorie->state,
                "imagen" => $categorie->imagen ? env("APP_URL")."storage/".$categorie->imagen : NULL,
                "created_at" => $categorie->created_at->format("Y-m-d h:i A")
            ],
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $categorie = ProductCategorie::findOrFail($id);
        // VALIDACION POR PRODUCTO
        $categorie->delete();
        return response()->json([
            "message" => 200,
        ]);
    }
}
