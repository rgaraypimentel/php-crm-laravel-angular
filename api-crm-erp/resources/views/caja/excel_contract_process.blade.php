<table>
    <thead>
        <tr>
            <th width="15">N° Proforma</th>
            <th width="45">Cliente</th>
            <th width="20">Total</th>
            <th width="15">Deuda</th>
            <th width="20">Pagado</th>
            <th width="15">Estado de pago</th>
            <th width="15" style="background-color: #ffdca5;">Monto Procesado</th>
            <th width="20">Fecha de Proceso</th>
            <th width="20">Asesor</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($caja_histories as $key => $caja_historie)
            @php
                $proforma = $caja_historie->proforma;
            @endphp
            <tr>
                <td>{{ $proforma->id }}</td>
                <td>{{ $proforma->client->full_name }}</td>

                <td>{{ $proforma->total }} PEN</td>
                <td>{{ $proforma->debt }} PEN</td>
                <td>{{ $proforma->paid_out }} PEN</td>

                <td>
                    @switch($proforma->state_payment)
                        @case(1)
                            PENDIENTE
                            @break
                        @case(2)
                            PARCIAL
                            @break
                        @case(3)
                            TOTAL
                            @break
                        @default
                    @endswitch
                </td>
                <td style="background-color: #ffdca5;">{{ $caja_historie->amount }} PEN</td>
                <td>{{ $caja_historie->created_at->format("Y-m-d h:i A") }}</td>
                <td>{{ $proforma->asesor->name.' '.$proforma->asesor->surname }}</td>
            </tr>
            @foreach ($caja_historie->caja_payments as $caja_payment)
            @php
                $payment = $caja_payment->proforma_payment;
            @endphp
                <tr>
                    <td></td>
                    <td></td>
                    <td>Metodo de pago: </td>
                    <td> {{ $payment->method_payment->name }} </td>
                    <td></td>
                    <td> Monto: </td>
                    <td style="background: #b9e2ff">{{ $caja_payment->amount }} PEN</td>

                    <td>U. Verificación: </td>
                    <td>{{ $payment->user_verific ? $payment->user_verific->name.' '.$payment->user_verific->name : '' }} </td>
                </tr>
            @endforeach
        @endforeach
    </tbody>
</table>
