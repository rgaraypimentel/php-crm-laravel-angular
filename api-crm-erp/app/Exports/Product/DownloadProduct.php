<?php

namespace App\Exports\Product;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromView;

class DownloadProduct implements FromView
{
    protected $products;
    public function __construct($products) {
        $this->products = $products;
    }
    /**
    * @return \Illuminate\Support\Collection
    */
    public function view(): View
    {
        return view("product.download_product",[
            "products" => $this->products,
        ]);
    }
}
