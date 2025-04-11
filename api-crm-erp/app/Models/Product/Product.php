<?php

namespace App\Models\Product;

use App\Models\configuration\Unit;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

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
}
