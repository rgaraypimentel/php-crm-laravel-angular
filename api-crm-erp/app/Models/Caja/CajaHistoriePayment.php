<?php

namespace App\Models\Caja;

use App\Models\Proforma\ProformaPayment;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CajaHistoriePayment extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        "caja_historie_id",
        "proforma_payment_id",
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

    public function caja_historie(){
        return $this->belongsTo(CajaHistorie::class,"caja_historie_id");
    }

    public function proforma_payment(){
        return $this->belongsTo(ProformaPayment::class,"proforma_payment_id");
    }
}
