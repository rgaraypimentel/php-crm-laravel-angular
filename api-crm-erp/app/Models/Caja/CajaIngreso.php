<?php

namespace App\Models\Caja;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CajaIngreso extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        "caja_sucursale_id",
        "description",
        "amount"
    ];
    public function setCreatedAtAttribute($value) {
        date_default_timezone_set("America/Lima");
        $this->attributes["created_at"] = Carbon::now();
    }
    public function setUpdatedAtAttribute($value) {
        date_default_timezone_set("America/Lima");
        $this->attributes["updated_at"] = Carbon::now();
    }

    public function caja_sucursale() {
        return $this->belongsTo(CajaSucursale::class,"caja_sucursale_id");
    }
}
