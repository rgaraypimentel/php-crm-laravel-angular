<?php

namespace App\Models\Product;

use App\Models\configuration\Unit;
use App\Models\configuration\Warehouse;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Conversion extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        "product_id",
        "warehouse_id",
        "unit_start_id",
        "unit_end_id",
        "user_id",
        "quantity_start",
        "quantity_end",
        "quantity",
        "description",
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

    public function warehouse(){
        return $this->belongsTo(Warehouse::class,"warehouse_id");
    }

    public function unit_start(){
        return $this->belongsTo(Unit::class,"unit_start_id");
    }

    public function unit_end(){
        return $this->belongsTo(Unit::class,"unit_end_id");
    }

    public function user(){
        return $this->belongsTo(User::class,"user_id");
    }

    public function scopeFilterAdvance($query,$n_orden,$warehouse_id,$unit_start_id,
    $unit_end_id,$search_product,$start_date,$end_date){
        if($n_orden){
            $query->where("id",$n_orden);
        }
        if($warehouse_id){
            $query->where("warehouse_id",$warehouse_id);
        }
        if($unit_start_id){
            $query->where("unit_start_id",$unit_start_id);
        }
        if($unit_end_id){
            $query->where("unit_end_id",$unit_end_id);
        }
        if($search_product){
            $query->whereHas("product",function($subq) use($search_product){
                $subq->where("title","like","%".$search_product."%");
            });
        }
        if($start_date && $end_date){
            $query->whereBetween("created_at",[
                Carbon::parse($start_date)->format("Y-m-d")." 00:00:00",
                Carbon::parse($end_date)->format("Y-m-d")." 23:59:59",
            ]);
        }
        return $query;
    }
}
