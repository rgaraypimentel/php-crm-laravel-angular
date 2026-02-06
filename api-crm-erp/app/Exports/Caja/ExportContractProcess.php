<?php

namespace App\Exports\Caja;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\FromCollection;

class ExportContractProcess implements FromView
{
    public $caja_histories;
    public function __construct($caja_histories) {
        $this->caja_histories = $caja_histories;
    }
    /**
    * @return \Illuminate\Support\Collection
    */
    public function view(): View
    {
        return view("caja.excel_contract_process",[
            "caja_histories" => $this->caja_histories,
        ]);
    }
}

