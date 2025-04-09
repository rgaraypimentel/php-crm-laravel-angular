<?php

namespace App\Models\Configuration;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MethodPayment extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        "name",
        "method_payment_id",
        "state",
    ];

    public function setCreatedAtAttribute($value) {
        date_default_timezone_set("America/Lima");
        $this->attributes["created_at"] = Carbon::now();
    }
    public function setUpdatedAtAttribute($value) {
        date_default_timezone_set("America/Lima");
        $this->attributes["updated_at"] = Carbon::now();
    }

    // PADRE
    public function method_payment(){
        return $this->belongsTo(MethodPayment::class,"method_payment_id");
    }
    // hijos
    public function method_payments(){
        return $this->hasMany(MethodPayment::class,"method_payment_id");
    }
}
