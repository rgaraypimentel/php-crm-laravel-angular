<table>
    <thead>
        <tr>
            <th width="15">N° Proforma</th>
            <th width="45">Producto</th>
            <th width="25">Categoria de Producto</th>
            <th width="20">Unidad</th>
            <th width="20">Precio Unitario</th>
            <th width="15">Descuento</th>
            <th width="20">Subtotal</th>
            <th width="15">Impuesto</th>
            <th width="15">Cantidad</th>
            <th width="15">Total</th>
            <th width="45">Descripción</th>
            <th width="20">Descripción</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($proforma_details as $key => $proforma_detail)
            <tr>
                <td>{{ $proforma_detail->proforma->id }}</td>
                <td>{{ $proforma_detail->product->title }}</td>
                <td>{{ $proforma_detail->product_categorie->name }}</td>
                <td>{{ $proforma_detail->unit->name }}</td>
                <td>{{ $proforma_detail->price_unit }} PEN</td>
                <td>{{ $proforma_detail->discount }} PEN</td>
                <td>{{ $proforma_detail->subtotal }} PEN</td>
                <td>{{ $proforma_detail->impuesto }} PEN</td>
                <td>{{ $proforma_detail->quantity }} </td>
                <td>{{ $proforma_detail->total }} PEN</td>
                <td>{{ $proforma_detail->description }}</td>
                <td>{{ $proforma_detail->created_at->format("Y-m-d h:i A") }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
