<?php

namespace App\Models\Caja;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CajaSucursale extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        "user_id",
        "caja_id",
        "state",
        "user_close",
        "date_close",
        "efectivo_initial",
        "ingresos",
        "egresos",
        "efectivo_process",
        "efectivo_finish"
    ];
    public function setCreatedAtAttribute($value) {
        date_default_timezone_set("America/Lima");
        $this->attributes["created_at"] = Carbon::now();
    }
    public function setUpdatedAtAttribute($value) {
        date_default_timezone_set("America/Lima");
        $this->attributes["updated_at"] = Carbon::now();
    }

    public function user_apertura(){
        return $this->belongsTo(User::class,"user_id");
    }

    public function user_cierre(){
        return $this->belongsTo(User::class,"user_close");
    }

    public function caja(){
        return $this->belongsTo(Caja::class,"caja_id");
    }

    public function histories(){
        return $this->hasMany(CajaHistorie::class,"caja_sucursale_id");
    }
}
