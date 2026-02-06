<?php

namespace App\Models\Client;

use App\Models\Configuration\ClientSegment;
use App\Models\Configuration\Sucursale;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Client extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        "name",
        "surname",
        "full_name",
        "client_segment_id",
        "phone",
        "email",
        "type",
        "type_document",
        "n_document",
        "birthdate",
        "sucursale_id",
        "asesor_id",
        "is_parcial",
        "address",
        "ubigeo_region",
        "ubigeo_provincia",
        "ubigeo_distrito",
        "region",
        "provincia",
        "origen",
        "distrito",
        "state",
        "sexo",
    ];

    public function setCreatedAtAttribute($value) {
        date_default_timezone_set("America/Lima");
        $this->attributes["created_at"] = Carbon::now();
    }
    public function setUpdatedAtAttribute($value) {
        date_default_timezone_set("America/Lima");
        $this->attributes["updated_at"] = Carbon::now();
    }

    public function client_segment(){
        return $this->belongsTo(ClientSegment::class);
    }

    public function asesor(){
        return $this->belongsTo(User::class,"asesor_id");
    }

    public function sucursale(){
        return $this->belongsTo(Sucursale::class,"sucursale_id");
    }

    public function scopeFilterAdvance($query,$search,$client_segment_id,$type,$asesor_id){

        if($search){
            $query->where(DB::raw("CONCAT(clients.full_name,' ',clients.phone,' ',clients.n_document)"),"like","%".$search."%");
            // "full_name","like","%".$search."%"
            //         ->orWhere("phone","like","%".$search."%")
            //         ->orWhere("n_document","like","%".$search."%");
        }
        if($client_segment_id){
            $query->where("client_segment_id",$client_segment_id);
        }
        if($type){
            $query->where("type",$type);
        }
        if($asesor_id){
            $query->where("asesor_id",$asesor_id);
        }
        return $query;
    }

    public function scopeFilterProforma($query,$n_document,$full_name,$phone){
        if($n_document){
            $query->where("n_document","like","%".$n_document."%");
        }
        if($full_name){
            $query->where("full_name","like","%".$full_name."%");
        }
        if($phone){
            $query->where("phone","like","%".$phone."%");
        }
        return $query;
    }
}
