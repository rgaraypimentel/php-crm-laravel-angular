<?php

namespace App\Models\Product;

use App\Models\Configuration\ProductCategorie;
use App\Models\Configuration\Provider;
use App\Models\Configuration\Unit;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Product extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        "title",
        "sku",
        "product_categorie_id",
        "imagen",
        "price_general",
        "description",
        "specifications",
        "min_discount",
        "max_discount",
        "is_gift",
        "umbral",
        "umbral_unit_id",
        "disponibilidad",
        "tiempo_de_abastecimiento",
        "state",
        "state_stock",
        "provider_id",
        "is_discount",
        "tax_selected",
        "importe_iva",
        "weight",
        "width",
        "height",
        "length",
    ];

    public function setCreatedAtAttribute($value) {
        date_default_timezone_set("America/Lima");
        $this->attributes["created_at"] = Carbon::now();
    }
    public function setUpdatedAtAttribute($value) {
        date_default_timezone_set("America/Lima");
        $this->attributes["updated_at"] = Carbon::now();
    }
    public function umbral_unit(){
        return $this->belongsTo(Unit::class,"umbral_unit_id");
    }
    public function product_categorie(){
        return $this->belongsTo(ProductCategorie::class,"product_categorie_id");
    }
    public function provider(){
        return $this->belongsTo(Provider::class,"provider_id");
    }

    public function wallets(){
        return $this->hasMany(ProductWallet::class);
    }

    public function warehouses(){
        return $this->hasMany(ProductWarehouse::class);
    }

    public function getProductImagenAttribute()
    {
        $link = null;
        if($this->imagen){
            if(str_contains($this->imagen,"https://") || str_contains($this->imagen,"http://")){
                $link = $this->imagen;
            }else{
                $link =  env('APP_URL').'storage/'.$this->imagen;
            }
        }
        return $link;
    }

    public function scopeFilterAdvance($query,$search,$product_categorie_id,$disponibilidad,$tax_selected,
    $sucursale_price_multiple,$client_segment_price_multiple,$almacen_warehouse,$unit_warehouse,$state_stock){

        if($search){
            $query->where(DB::raw("CONCAT(products.title,' ',IFNULL(products.sku,''))"),"like","%".$search."%");
        }

        if($product_categorie_id){
            $query->where("product_categorie_id",$product_categorie_id);
        }

        if($disponibilidad){
            $query->where("disponibilidad",$disponibilidad);
        }

        if($tax_selected){
            $query->where("tax_selected",$tax_selected);
        }
        if($state_stock){
            $query->where("state_stock",$state_stock);
        }
        if($sucursale_price_multiple){
            $query->whereHas("wallets",function($sub) use($sucursale_price_multiple){
                $sub->where("sucursale_id",$sucursale_price_multiple);
            });
        }
        if($client_segment_price_multiple){
            $query->whereHas("wallets",function($sub) use($client_segment_price_multiple){
                $sub->where("client_segment_id",$client_segment_price_multiple);
            });
        }
        if($almacen_warehouse){
            $query->whereHas("warehouses",function($sub) use($almacen_warehouse){
                $sub->where("warehouse_id",$almacen_warehouse);
            });
        }
        if($unit_warehouse){
            $query->whereHas("warehouses",function($sub) use($unit_warehouse){
                $sub->where("unit_id",$unit_warehouse);
            });
        }
        return $query;
    }
}
