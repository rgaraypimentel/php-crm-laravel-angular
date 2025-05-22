<?php

namespace App\Models\Purchase;

use App\Models\configuration\Unit;
use App\Models\Product\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PurchaseDetail extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        "purchase_id",
        "product_id",
        "unit_id",
        "description",
        "quantity",
        "price_unit",
        "total",
        "state",
        "user_entrega",
        "date_entrega",
    ];

    public function setCreatedAtAttribute($value) {
        date_default_timezone_set("America/Lima");
        $this->attributes["created_at"] = Carbon::now();
    }
    public function setUpdatedAtAttribute($value) {
        date_default_timezone_set("America/Lima");
        $this->attributes["updated_at"] = Carbon::now();
    }

    public function purchase() {
        return $this->belongsTo(Purchase::class,"purchase_id");
    }

    public function unit(){
        return $this->belongsTo(Unit::class,"unit_id");
    }

    public function product(){
        return $this->belongsTo(Product::class,"product_id");
    }

    public function encargado(){
        return $this->belongsTo(User::class,"user_entrega");
    }
}
