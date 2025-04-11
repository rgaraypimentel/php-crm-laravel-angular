<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Configuration\ClientSegment;
use App\Models\Configuration\ProductCategorie;
use App\Models\Configuration\Provider;
use App\Models\Configuration\Sucursale;
use App\Models\configuration\Unit;
use App\Models\configuration\Warehouse;
use App\Models\Product\Product;
use App\Models\Product\ProductWallet;
use App\Models\Product\ProductWarehouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;
        // $product_categorie_id = $request->product_categorie_id;
        // $disponibilidad = $request->disponibilidad;
        // $tax_selected = $request->tax_selected;

        // $sucursale_price_multiple = $request->sucursale_price_multiple;
        // $client_segment_price_multiple = $request->client_segment_price_multiple;
        // $almacen_warehouse = $request->almacen_warehouse;
        // $unit_warehouse = $request->unit_warehouse;
        // $state_stock = $request->state_stock;
        // // where("title","like","%".$search."%")
        // $products = Product::filterAdvance($search,$product_categorie_id,$disponibilidad,$tax_selected,
        // $sucursale_price_multiple,$client_segment_price_multiple,$almacen_warehouse,$unit_warehouse,$state_stock)
        //             ->orderBy("id","desc")
        //             ->paginate(25);

        // $num_products_agotado = Product::where("state_stock",3)->count();
        // $num_products_por_agotar = Product::where("state_stock",2)->count();

        $products = Product::where("title","like","%".$search."%")->orderBy("id","desc")->paginate(25);

        return response()->json([
            "total" => $products->total(),
            "products" => $products,
            // "products" => ProductCollection::make($products),
            // "num_products_agotado" => $num_products_agotado,
            // "num_products_por_agotar" => $num_products_por_agotar,
        ]);
    }

    public function config() {
        $almacens = Warehouse::where("state",1)->get();
        $sucursales = Sucursale::where("state",1)->get();
        $units = Unit::where("state",1)->get();
        $segments_clients = ClientSegment::where("state",1)->get();
        $categories = ProductCategorie::where("state",1)->get();
        $providers = Provider::where("state",1)->get();

        return response()->json([
            "almacens" => $almacens,
            "sucursales" => $sucursales,
            "units" => $units,
            "segments_clients" => $segments_clients,
            "categories" => $categories,
            "providers" => $providers,
        ]);
    }

    // public function export_products(Request $request) {

    //     $search = $request->get("search");
    //     $product_categorie_id = $request->get("product_categorie_id");
    //     $disponibilidad = $request->get("disponibilidad");
    //     $tax_selected = $request->get("tax_selected");

    //     $sucursale_price_multiple = $request->get("sucursale_price_multiple");
    //     $client_segment_price_multiple = $request->get("client_segment_price_multiple");
    //     $almacen_warehouse = $request->get("almacen_warehouse");
    //     $unit_warehouse = $request->get("unit_warehouse");
    //     $state_stock = $request->get("state_stock");

    //     $products = Product::filterAdvance($search,$product_categorie_id,$disponibilidad,$tax_selected,
    //     $sucursale_price_multiple,$client_segment_price_multiple,$almacen_warehouse,$unit_warehouse,$state_stock)
    //                 ->orderBy("id","desc")->get();

    //     return Excel::download(new DownloadProduct($products),"productos_descargados.xlsx");
    // }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $is_exits_product = Product::where("title",$request->title)->first();
        if($is_exits_product){
            return response()->json([
                "message" => 403,
                "message_text" => "El nombre del producto ya existe"
            ]);
        }

        if($request->hasFile("product_imagen")){
            $path = Storage::putFile("products",$request->file("product_imagen"));
            $request->request->add(["imagen" => $path]);
        }

        $product = Product::create($request->all());

        $WAREHOUSES_PRODUCT = json_decode($request->WAREHOUSES_PRODUCT,true);
        foreach ($WAREHOUSES_PRODUCT as $key => $WAREHOUSES_PROD) {
            ProductWarehouse::create([
                "product_id" => $product->id,
                "unit_id" => $WAREHOUSES_PROD["unit"]["id"],//WAREHOUSES_PROD.unit.id
                "warehouse_id" => $WAREHOUSES_PROD["warehouse"]["id"],
                "stock" => $WAREHOUSES_PROD["quantity"]
            ]);
        }
        $WALLETS_PRODUCT = json_decode($request->WALLETS_PRODUCT,true);
        foreach ($WALLETS_PRODUCT as $key => $WALLETS_PROD) {
            ProductWallet::create([
                "product_id" => $product->id,
                "unit_id" => $WALLETS_PROD["unit"]["id"],
                "client_segment_id" => isset($WALLETS_PROD["client_segment"]) ? $WALLETS_PROD["client_segment"]["id"] : NULL,
                "sucursale_id" => isset($WALLETS_PROD["sucursale"]) ? $WALLETS_PROD["sucursale"]["id"] : NULL,
                "price" => $WALLETS_PROD["price_general"]
            ]);
        }

        return response()->json([
            "message" => 200,
        ]);
    }

    // public function import_product(Request $request)
    // {
    //     $request->validate([
    //         "import_file" => 'required|file|mimes:xls,xlsx,csv'
    //     ]);
    //     $path = $request->file("import_file");

    //     $data = Excel::import(new ProductsImport,$path);

    //     return response()->json([
    //         "message" => 200
    //     ]);
    // }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::findOrFail($id);

        return response()->json([
            "product" => $product,
        ]);
        // return response()->json([
        //     "product" => ProductResource::make($product),
        // ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $is_exits_product = Product::where("title",$request->title)
                            ->where("id","<>",$id)->first();
        if($is_exits_product){
            return response()->json([
                "message" => 403,
                "message_text" => "El nombre del producto ya existe"
            ]);
        }
        $product = Product::findOrFail($id);

        if($request->hasFile("product_imagen")){
            if($product->imagen){
                Storage::delete($product->imagen);
            }
            $path = Storage::putFile("products",$request->file("product_imagen"));
            $request->request->add(["imagen" => $path]);
        }

        $product->update($request->all());
        return response()->json([
            "message" => 200,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        // VALIDACION POR PROFORMA
        $product->delete();
        return response()->json([
            "message" => 200,
        ]);
    }
}
