<?php

namespace App\Models\Caja;

use App\Models\Configuration\Sucursale;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Caja extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        "sucursale_id",
        "type",
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

    public function sucursale() {
        return $this->belongsTo(Sucursale::class,"sucursale_id");
    }
}
