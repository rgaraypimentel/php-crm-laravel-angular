<?php

namespace App\Models\Transport;

use App\Models\configuration\Warehouse;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Transport extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        "warehouse_start_id",
        "warehouse_end_id",
        "user_id",
        "state",
        "date_emision",
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

    public function warehouse_start(){
        return $this->belongsTo(Warehouse::class,"warehouse_start_id");
    }

    public function warehouse_end(){
        return $this->belongsTo(Warehouse::class,"warehouse_end_id");
    }

    public function user(){
        return $this->belongsTo(User::class,"user_id");
    }

    public function details(){
        return $this->hasMany(TransportDetail::class);
    }

    public function detail_salida(){
        return $this->hasMany(TransportDetail::class)->where("state",2);
    }

    public function detail_entregados(){
        return $this->hasMany(TransportDetail::class)->where("state",3);
    }

    public function scopeFilterAdvance($query,$warehouse_start_id,$warehouse_end_id,$n_orden,$start_date,$end_date,$search_product){
        if($warehouse_start_id){
            $query->where("warehouse_start_id",$warehouse_start_id);
        }
        if($warehouse_end_id){
            $query->where("warehouse_end_id",$warehouse_end_id);
        }
        if($n_orden){
            $query->where("id",$n_orden);
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
    }
}
