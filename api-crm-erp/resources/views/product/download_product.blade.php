<table>
    <thead>
        <tr>
            <th>Id</th>
            <th>Imagen</th>
            <th width="60">Titulo</th>
            <th width="25">Categoria</th>
            <th width="10">Precio general</th>
            <th width="15">SKU</th>
            <th width="20">Disponibilidad</th>
            <th width="20">Tipo de impuesto</th>
            <th width="15">Umbral</th>
            <th width="15">Unidad Umbral</th>
            <th width="15">Peso</th>
            <th width="15">Ancho</th>
            <th width="15">Alto</th>
            <th width="15">Largo</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($products as $key => $product)
            <tr>
                <td>{{ $key + 1 }}</td>
                <td>{{ $product->imagen }}</td>
                <td>{{ $product->title }}</td>
                <td>{{ $product->product_categorie->name }}</td>
                <td >{{ $product->price_general }}</td>
                <td>{{ $product->sku }}</td>
                <td>
                    @php
                        $disponibilidad = "";
                        switch ($product->disponibilidad) {
                            case 1:
                                $disponibilidad = "Vender los productos sin stock";
                                break;
                            case 2:
                                $disponibilidad = "No vender los productos sin stock";
                                break;
                            case 3:
                                $disponibilidad = "Proyectar con los contratos que se tenga";
                                break;
                            default:
                                # code...
                                break;
                        }
                    @endphp
                    {{ $disponibilidad }}
                </td>
                <td>
                    @php
                        $type_tax_selected = "";
                        switch ($product->tax_selected) {
                            case 1:
                                $type_tax_selected = "Tax Free";
                                break;
                            case 2:
                                $type_tax_selected = "Taxable Goods";
                                break;
                            case 3:
                                $type_tax_selected = "Downloadable Product";
                                break;
                            default:
                                # code...
                                break;
                        }
                    @endphp
                    {{ $type_tax_selected }}
                </td>
                <td>{{ $product->umbral ?? 0 }} Dias</td>
                <td>{{ $product->umbral_unit ? $product->umbral_unit->name : '---' }}</td>
                <td>{{ $product->weight }}</td>
                <td>{{ $product->width }}</td>
                <td>{{ $product->height }}</td>
                <td>{{ $product->length }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
