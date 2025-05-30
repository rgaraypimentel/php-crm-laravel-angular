<?php

namespace App\Exports\Kardex;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromView;

class ExportKardex implements FromView
{
    public $kardex_products;
    public function __construct($kardex_products) {
        $this->kardex_products = $kardex_products;
    }
    /**
    * @return \Illuminate\Support\Collection
    */
    public function view(): View
    {
        return view("kardex.kardex_products",[
            "kardex_products" => $this->kardex_products,
        ]);
    }
}
