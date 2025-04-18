<table>
    <thead>
        <tr>
            <th>Id</th>
            <th width="45">Nombre Completo/Razon Social</th>
            <th width="15">Tipo de documento</th>
            <th width="15">N° de documento</th>
            <th width="20">Segmento de cliente</th>
            <th width="15">Telefono</th>
            <th width="20">Correo electronico</th>
            <th width="15">Origen</th>
            <th width="15">Region</th>
            <th width="20">Provincia</th>
            <th width="20">Distrito</th>
            <th width="20">Sucursal</th>
            <th width="35">Dirección</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($clients as $key => $client)
            <tr>
                <td>{{ $key + 1 }}</td>
                <td>{{ $client->full_name }}</td>
                <td>{{ $client->type_document }}</td>
                <td>{{ $client->n_document }}</td>
                <td>{{ $client->client_segment->name }}</td>
                <td>{{ $client->phone }}</td>
                <td>{{ $client->email }}</td>
                <td>{{ $client->origen }}</td>
                <td>{{ $client->region }}</td>
                <td>{{ $client->provincia }}</td>
                <td>{{ $client->distrito }}</td>
                <td>{{ $client->sucursale?->name }}</td>
                <td>{{ $client->address }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
