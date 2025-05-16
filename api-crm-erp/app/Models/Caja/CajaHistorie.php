<?php

namespace App\Models\Caja;

use App\Models\Proforma\Proforma;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CajaHistorie extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        "caja_sucursale_id",
        "proforma_id",
        "amount",
    ];
    public function setCreatedAtAttribute($value) {
        date_default_timezone_set("America/Lima");
        $this->attributes["created_at"] = Carbon::now();
    }
    public function setUpdatedAtAttribute($value) {
        date_default_timezone_set("America/Lima");
        $this->attributes["updated_at"] = Carbon::now();
    }
    public function caja_sucursale(){
        return $this->belongsTo(CajaSucursale::class,"caja_sucursale_id");
    }
    public function proforma(){
        return $this->belongsTo(Proforma::class,"proforma_id");
    }

    public function caja_payments(){
        return $this->hasMany(CajaHistoriePayment::class,"caja_historie_id");
    }

    public function scopeFilterAdvance($query,$n_proforma,$search_client){
        if($n_proforma){
            $query->where("proforma_id",$n_proforma);
        }
        if($search_client){
            $query->whereHas("proforma",function($sub) use($search_client){
                $sub->whereHas("client",function($subq) use($search_client){
                    $subq->where("full_name","like","%".$search_client."%");
                });
            });
        }
        return $query;
    }
}
