<table>
    <thead>
        <tr>
            <th width="15">N° Proforma</th>
            <th width="45">Cliente</th>
            <th width="25">Segmento de cliente</th>
            <th width="20">Empresa/Persona</th>
            <th width="20">Total</th>
            <th width="15">Deuda</th>
            <th width="20">Pagado</th>
            <th width="15">Estado de la proforma</th>
            <th width="15">Estado de pago</th>
            <th width="20">Asesor</th>
            <th width="20">Fecha de registro</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($proformas as $key => $proforma)
            <tr>
                <td>{{ $proforma->id }}</td>
                <td>{{ $proforma->client->full_name }}</td>
                <td>{{ $proforma->client_segment->name }}</td>
                <td>{{ $proforma->client->type == 2 ? 'EMPRESA' : 'PERSONA' }}</td>
                <td>{{ $proforma->total }} PEN</td>
                <td>{{ $proforma->debt }} PEN</td>
                <td>{{ $proforma->paid_out }} PEN</td>
                @if ($proforma->state_proforma == 1)
                <td style="background: #ff8484">{{ $proforma->state_proforma == 1 ? 'COTIZACION' : 'CONTRATO' }}</td>
                @else
                <td style="background: #80a4ff">{{ $proforma->state_proforma == 1 ? 'COTIZACION' : 'CONTRATO' }}</td>
                @endif
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
                <td>{{ $proforma->asesor->name.' '.$proforma->asesor->surname }}</td>
                <td>{{ $proforma->created_at->format("Y-m-d h:i A") }}</td>
            </tr>
        @endforeach
    </tbody>
</table>