<?php

namespace App\Models\Commission;

use App\Models\Configuration\ClientSegment;
use App\Models\Configuration\ProductCategorie;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Commission extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        "week",
        "product_categorie_id",
        "client_segment_id",
        "position",
        "amount",
        "percentage",
        "state"
    ];

    public function setCreatedAtAttribute($value) {
        date_default_timezone_set("America/Lima");
        $this->attributes["created_at"] = Carbon::now();
    }
    public function setUpdatedAtAttribute($value) {
        date_default_timezone_set("America/Lima");
        $this->attributes["updated_at"] = Carbon::now();
    }

    public function categorie() {
        return $this->belongsTo(ProductCategorie::class,"product_categorie_id");
    }

    public function client_segment() {
        return $this->belongsTo(ClientSegment::class,"client_segment_id");
    }
}
