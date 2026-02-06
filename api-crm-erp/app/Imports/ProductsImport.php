<?php

namespace App\Imports;

use App\Models\Product\Product;
use App\Models\Configuration\Unit;
use App\Models\Product\ProductWallet;
use App\Models\Configuration\Sucursale;
use App\Models\Configuration\Warehouse;
use Maatwebsite\Excel\Concerns\ToModel;
use App\Models\Product\ProductWarehouse;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use App\Models\Configuration\ProductCategorie;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class ProductsImport implements ToModel,WithHeadingRow,WithValidation
{
    use Importable, SkipsErrors;
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        // CREAR PRODUCTO


        $categorie = ProductCategorie::where("name",$row["categorie"])->first();
        if(!$categorie){
            return Product::first();
        }
        $umbral_unit = Unit::where("name",$row["umbral_unit"])->first();

        $disponibilidad = "";
        switch ($row["disponibilidad"]) {
            case "Vender los productos sin stock":
                $disponibilidad = 1;
                break;
            case "No vender los productos sin stock":
                $disponibilidad = 2;
                break;
            case "Proyectar con los contratos que se tenga":
                $disponibilidad = 3;
                break;
            default:
                # code...
                break;
        }

        $tax_selected = "";
        switch ($row["tax_selected"]) {
            case "Tax Free":
                $tax_selected = 1;
                break;
            case "Taxable Goods":
                $tax_selected = 2;
                break;
            case "Downloadable Product":
                $tax_selected = 3;
                break;
            default:
                # code...
                break;
        }

        $product = Product::create([
            "title" => $row["title"],
            "sku" => $row["sku"],
            "product_categorie_id" => $categorie->id,
            "imagen" => $row["imagen"],
            "price_general" => $row["price"],
            "description" => $row["description"],
            "is_gift" => $row["is_gift"],
            "umbral" => $row["umbral"] ,
            "umbral_unit_id" => $umbral_unit ? $umbral_unit->id : NULL,
            "disponibilidad" => $disponibilidad,
            "state" => $row["state"] == 'ACTIVO' ? 1 : 2,
            "tax_selected" => $tax_selected,
            "importe_iva" => $row["importe_iva"],
            "weight" => $row["peso"],
            "width" => $row["ancho"],
        ]);

        // PUEDO CREAR UN EXISTENCIA DEL PRODUCTO

        $unit = Unit::where("name",$row["unidad_warehouse"])->first();
        $warehouse = Warehouse::where("name",$row["almacen_warehouse"])->first();
        if($unit && $warehouse){
            ProductWarehouse::create([
                "product_id" => $product->id,
                "unit_id" =>$unit->id ,
                "warehouse_id" => $warehouse->id,
                "stock" => $row["stock_warehouse"],
            ]);
        }

        // PUEDO CREAR UN PRECIO MULTIPLE DEL PRODUCTO

        $unit = Unit::where("name",$row["unidad_price_multiple"])->first();
        $sucursale = Sucursale::where("name",$row["sucursal_price_multiple"])->first();
        if($unit){
            ProductWallet::create([
                "product_id" => $product->id,
                "unit_id" => $unit->id,
                "sucursale_id" => $sucursale ? $sucursale->id : NULL,
                "price" => $row["price_multiple"],
            ]);
        }

        return $product;
    }

    public function rules() : array
    {
        return [
            '*.title' => ['required'],
            '*.categorie' => ['required'],
            '*.price' => ['required'],
            '*.imagen' => ['required'],
            '*.sku' => ['required'],
            '*.disponibilidad' => ['required'],
            '*.state' => ['required'],
            '*.tax_selected' => ['required'],
            '*.importe_iva' => ['required'],
            '*.unidad_warehouse'=> ['required'],
            '*.almacen_warehouse'=> ['required'],
            '*.stock_warehouse'=> ['required'],
            '*.unidad_price_multiple'=> ['required'],
            '*.sucursal_price_multiple'=> ['required'],
            '*.price_multiple'=> ['required'],
        ];
    }
}
