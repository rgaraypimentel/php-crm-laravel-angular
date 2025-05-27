<?php

namespace App\Models\Proforma;

use App\Models\Configuration\ProductCategorie;
use App\Models\configuration\Unit;
use App\Models\configuration\Warehouse;
use App\Models\Product\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProformaDetail extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        "proforma_id",
        "product_id",
        "product_categorie_id",
        "quantity",
        "price_unit",
        "discount",
        "subtotal",
        "total",
        "description",
        "unit_id",
        "impuesto",
        /* "created_at",
        "updated_at", */

        "date_entrega",
        "user_entrega",
        "warehouse_id",
    ];

    public function setCreatedAtAttribute($value) {
    date_default_timezone_set("America/Lima");
    $this->attributes["created_at"] = Carbon::now();
    }
    public function setUpdatedAtAttribute($value) {
    date_default_timezone_set("America/Lima");
    $this->attributes["updated_at"] = Carbon::now();
    }

    public function proforma(){
        return $this->belongsTo(Proforma::class,"proforma_id");
    }

    public function unit(){
        return $this->belongsTo(Unit::class,"unit_id");
    }

    public function product(){
        return $this->belongsTo(Product::class,"product_id");
    }

    public function user_despacho(){
        return $this->belongsTo(User::class,"user_entrega");
    }

    public function warehouse(){
        return $this->belongsTo(Warehouse::class,"warehouse_id");
    }

    public function product_categorie(){
        return $this->belongsTo(ProductCategorie::class,"product_categorie_id");
    }
}
