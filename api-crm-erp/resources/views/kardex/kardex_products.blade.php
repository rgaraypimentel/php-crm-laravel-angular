
@php
function getNameUnit($kardex_product,$unit_id){
    $unit = null;
    foreach ($kardex_product["units"] as $key => $unit) {
        if($unit->id == $unit_id){
            $unit = $unit;
            break;
        }
    }
    return $unit ? $unit->name : '';
}
@endphp

@foreach ($kardex_products as $kardex_product)
    <table>
        <thead>
            <th colspan="5"> <b> PRODUCTO:</b> {{ $kardex_product["title"] }}</th>
            <th colspan="2"> <b>SKU:</b>  {{ $kardex_product["sku"] }}</th>
            <th colspan="3"> <b>Categoria:</b>  {{ $kardex_product["categoria"] }}</th>
        </thead>
    </table>
    <table>
        <thead>
            <tr>
                <th rowspan="1" colspan="2"></th>
                <th colspan="3" class="entrada">Entrada</th>
                <th colspan="3" class="salida">Salida</th>
                <th colspan="3" class="existencias">Existencias</th>
            </tr>
            <tr>
                <th rowspan="2">Fecha</th>
                <th rowspan="2">Detalle</th>
                <th colspan="9" class="subheader">{{ $kardex_product["unit_first"]->name }}</th>
                <!-- <th colspan="3" class="subheader">UNIDAD</th>
                <th colspan="3" class="subheader">UNIDAD</th> -->
            </tr>
            <tr>
                <th>Cantidad</th>
                <th>V/Unitario</th>
                <th>V/Total</th>
                <th>Cantidad</th>
                <th>V/Unitario</th>
                <th>V/Total</th>
                <th>Cantidad</th>
                <th>V/Unitario</th>
                <th>V/Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($kardex_product["movimient_units"] as $movimient_unit)
                @if ($movimient_unit["unit_id"] == $kardex_product["unit_first"]->id)
                    @foreach ($movimient_unit["movimients"] as $movimient)
                        <tr >
                            <td>{{ $movimient["fecha"] }}</td>
                            <td>{{ $movimient["detalle"] }}</td>
                            @if ($movimient["ingreso"])
                                <td>{{ $movimient["ingreso"]["quantity"] }}</td>
                                <td>{{ $movimient["ingreso"]["price_unit"] }}</td>
                                <td>{{ $movimient["ingreso"]["total"] }}</td>
                            @else 
                            <td></td>
                            <td></td>
                            <td></td>
                            @endif

                            @if ($movimient["salida"])
                                <td>{{ $movimient["salida"]["quantity"] }}</td>
                                <td>{{ $movimient["salida"]["price_unit"] }}</td>
                                <td>{{ $movimient["salida"]["total"] }}</td>
                            @else 
                            <td></td>
                            <td></td>
                            <td></td>
                            @endif

                            <td>{{ $movimient["existencia"]["quantity"] }}</td>
                            <td>{{ $movimient["existencia"]["price_unit"] }}</td>
                            <td>{{ $movimient["existencia"]["total"] }}</td>
                        </tr>
                    @endforeach
                @endif
            @endforeach
            @foreach ($kardex_product["movimient_units"] as $movimient_unit)
                @if ($movimient_unit["unit_id"] != $kardex_product["unit_first"]->id)
                    <tr class="new-row">
                        <td colspan="2"></td>
                        <td colspan="9"><b>{{ getNameUnit($kardex_product,$movimient_unit["unit_id"]) }}</b></td>
                        <!-- <td colspan="3"><b>CAJA</b></td>
                        <td colspan="3"><b>CAJA</b></td> -->
                    </tr>
                    <tr class="new-row">
                        <td><b>Fecha</b></td>
                        <td><b>Detalle</b></td>
                        <td><b>Cantidad</b></td>
                        <td><b>V/Unitario</b></td>
                        <td><b>V/Total</b></td>
                        <td><b>Cantidad</b></td>
                        <td><b>V/Unitario</b></td>
                        <td><b>V/Total</b></td>
                        <td><b>Cantidad</b></td>
                        <td><b>V/Unitario</b></td>
                        <td><b>V/Total</b></td>
                    </tr>
        
                    @foreach ($movimient_unit["movimients"] as $movimient)
                        <tr >
                            <td>{{ $movimient["fecha"] }}</td>
                            <td>{{ $movimient["detalle"] }}</td>
                            @if ($movimient["ingreso"])
                                <td>{{ $movimient["ingreso"]["quantity"] }}</td>
                                <td>{{ $movimient["ingreso"]["price_unit"] }}</td>
                                <td>{{ $movimient["ingreso"]["total"] }}</td>
                            @else 
                            <td></td>
                            <td></td>
                            <td></td>
                            @endif

                            @if ($movimient["salida"])
                                <td>{{ $movimient["salida"]["quantity"] }}</td>
                                <td>{{ $movimient["salida"]["price_unit"] }}</td>
                                <td>{{ $movimient["salida"]["total"] }}</td>
                            @else 
                            <td></td>
                            <td></td>
                            <td></td>
                            @endif

                            <td>{{ $movimient["existencia"]["quantity"] }}</td>
                            <td>{{ $movimient["existencia"]["price_unit"] }}</td>
                            <td>{{ $movimient["existencia"]["total"] }}</td>
                        </tr>
                    @endforeach
                @endif
            @endforeach
        </tbody>
    </table>
@endforeach
