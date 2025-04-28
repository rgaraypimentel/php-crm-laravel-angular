<?php

namespace App\Models\Proforma;

use App\Models\Configuration\SucursaleDeliverie;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProformaDeliverie extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        "proforma_id",
        "sucursale_deliverie_id",
        "date_entrega",
        "date_envio",
        "address",
        "ubigeo_region",
        "ubigeo_provincia",
        "ubigeo_distrito",
        "region",
        "provincia",
        "distrito",

        "agencia",
        "full_name_encargado",
        "documento_encargado",
        "telefono_encargado",
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

    public function sucursal_deliverie() {
        return $this->belongsTo(SucursaleDeliverie::class,"sucursale_deliverie_id");
    }
}
