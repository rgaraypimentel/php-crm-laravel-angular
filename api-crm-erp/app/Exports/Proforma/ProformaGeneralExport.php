<?php

namespace App\Exports\Proforma;

use App\Models\Proforma\Proforma;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\FromCollection;

class ProformaGeneralExport implements FromView
{
    public $request;
    public function __construct($request) {
        $this->request = $request;
    }
    /**
    * @return \Illuminate\Support\Collection
    */
    public function view(): View
    {
        $search = $this->request->search;
        $client_segment_id = $this->request->client_segment_id;
        $asesor_id = $this->request->asesor_id;
        $product_categorie_id = $this->request->product_categorie_id;
        $search_client = $this->request->search_client;
        $search_product = $this->request->search_product;
        $start_date = $this->request->start_date;
        $end_date = $this->request->end_date;
        $state_proforma = $this->request->state_proforma;

        $proformas = Proforma::filterAdvance($search,$client_segment_id,$asesor_id,
                                    $product_categorie_id,$search_client,$search_product,
                                    $start_date,$end_date,$state_proforma)
                                    ->orderBy("id","desc")->get();


        return view("proforma.proforma_general",[
            "proformas" => $proformas,
        ]);
    }
}
