<?php

namespace App\Models\Proforma;

use App\Models\Configuration\MethodPayment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProformaPayment extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        "proforma_id",
        "method_payment_id",
        "banco_id",
        "amount",
        "date_validation",
        "n_transaccion",
        "vaucher",

        "verification",
        "user_verification"
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

    public function method_payment(){
        return $this->belongsTo(MethodPayment::class,"method_payment_id");
    }

    public function banco(){
        return $this->belongsTo(MethodPayment::class,"banco_id");
    }

    public function user_verific(){
        return $this->belongsTo(User::class,"user_verification");
    }
}
