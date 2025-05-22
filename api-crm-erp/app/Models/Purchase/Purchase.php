<?php

namespace App\Models\Purchase;

use App\Models\Configuration\Provider;
use App\Models\configuration\Warehouse;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Purchase extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        "warehouse_id",
        "user_id",
        "state",
        "provider_id",
        "date_emision",
        "type_comprobant",
        "n_comprobant",
        "description",
        "date_entrega",
        "total",
        "importe",
        "igv"
    ];

    public function setCreatedAtAttribute($value) {
        date_default_timezone_set("America/Lima");
        $this->attributes["created_at"] = Carbon::now();
    }
    public function setUpdatedAtAttribute($value) {
        date_default_timezone_set("America/Lima");
        $this->attributes["updated_at"] = Carbon::now();
    }

    public function warehouse(){
        return $this->belongsTo(Warehouse::class,"warehouse_id");
    }

    public function user(){
        return $this->belongsTo(User::class,"user_id");
    }

    public function provider(){
        return $this->belongsTo(Provider::class,"provider_id");
    }

    public function details(){
        return $this->hasMany(PurchaseDetail::class);
    }

    public function detail_entregados(){
        return $this->hasMany(PurchaseDetail::class)->where("state",2);
    }

    public function scopeFilterAdvance($query,$warehouse_id,$n_orden,$provider_id,$n_comprobant,$start_date,$end_date,$search_product){
        if($warehouse_id){
            $query->where("warehouse_id",$warehouse_id);
        }
        if($n_orden){
            $query->where("id",$n_orden);
        }
        if($provider_id){
            $query->where("provider_id",$provider_id);
        }
        if($n_comprobant){
            $query->where("n_comprobant",$n_comprobant);
        }
        if($start_date && $end_date){
            $query->whereBetween("date_emision",[
                Carbon::parse($start_date)->format("Y-m-d")." 00:00:00",
                Carbon::parse($end_date)->format("Y-m-d")." 23:59:59",
            ]);
        }
        if($search_product){
            $query->whereHas("details",function($subq) use($search_product){
                $subq->whereHas("product",function($subq2) use($search_product){
                    $subq2->where("title","like","%".$search_product."%");
                });
            });
        }
        return $query;
    }use HasFactory;
}
