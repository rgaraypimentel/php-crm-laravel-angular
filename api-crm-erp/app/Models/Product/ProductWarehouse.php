<?php

namespace App\Models\Product;

use App\Models\Configuration\Unit;
use App\Models\Configuration\Warehouse;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductWarehouse extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        "product_id",
        "unit_id",
        "warehouse_id",
        "stock"
    ];
    public function setCreatedAtAttribute($value) {
        date_default_timezone_set("America/Lima");
        $this->attributes["created_at"] = Carbon::now();
    }
    public function setUpdatedAtAttribute($value) {
        date_default_timezone_set("America/Lima");
        $this->attributes["updated_at"] = Carbon::now();
    }

    public function product(){
        return $this->belongsTo(Product::class,"product_id");
    }

    public function unit(){
        return $this->belongsTo(Unit::class,"unit_id");
    }

    public function warehouse(){
        return $this->belongsTo(Warehouse::class,"warehouse_id");
    }
}
