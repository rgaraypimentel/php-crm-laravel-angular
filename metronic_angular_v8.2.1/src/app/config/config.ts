import { environment } from "src/environments/environment";


export const URL_SERVICIOS = environment.URL_SERVICIOS;
export const URL_BACKEND = environment.URL_BACKEND;
export const URL_FRONTED = environment.URL_FRONTED;

export const SIDEBAR: any = [
    {
        'name': 'Roles',
        'permisos': [
            {
                name: 'Registrar',
                permiso: 'register_role',
            },
            {
                name: 'Editar',
                permiso: 'edit_role',
            },
            {
                name: 'Eliminar',
                permiso: 'delete_role',
            }
        ]
    },
    {
        'name': 'Usuarios',
        'permisos': [
            {
                name: 'Registrar',
                permiso: 'register_user',
            },
            {
                name: 'Editar',
                permiso: 'edit_user',
            },
            {
                name: 'Eliminar',
                permiso: 'delete_user',
            }
        ]
    },
    {
        'name': 'Productos',
        'permisos': [
            {
                name: 'Registrar',
                permiso: 'register_product',
            },
            {
                name:'Listado',
                permiso: 'list_product',
            },
            {
                name: 'Editar',
                permiso: 'edit_product',
            },
            {
                name: 'Eliminar',
                permiso: 'delete_product',
            },
            {
                name: 'Ver billetera de precios',
                permiso: 'show_wallet_price_product',
            },
            {
                name: 'Nuevo precio',
                permiso: 'register_wallet_price_product',
            },
            {
                name: 'Editar precio',
                permiso: 'edit_wallet_price_product',
            },
            {
                name: 'Eliminar precio',
                permiso: 'delete_wallet_price_product',
            },
        ]
    },
    {
        'name': 'Clientes',
        'permisos': [
            {
                name: 'Registrar',
                permiso: 'register_clientes',
            },
            {
                name: 'Editar',
                permiso: 'edit_clientes',
            },
            {
                name: 'Eliminar',
                permiso: 'delete_clientes',
            },
        ]
    },
    {
        'name': 'Caja',
        'permisos': [
            {
                name: 'Validar pagos',
                permiso: 'valid_payments',
            },
            {
                name: 'Reporte de caja',
                permiso: 'reports_caja',
            },
            {
                name: 'Historial de contratos procesados',
                permiso: 'record_contract_process',
            },
            {
                name: 'Egreso (Salida de efectivo)',
                permiso: 'egreso',
            },
            {
                name: 'Ingreso',
                permiso: 'ingreso',
            },
            {
                name: 'Cierre de caja',
                permiso: 'close_caja',
            },
        ]
    },
    {
        'name': 'Proforma',
        'permisos': [
            {
                name: 'Registrar',
                permiso: 'register_proforma',
            },
            {
                name:'Listado',
                permiso: 'list_proforma',
            },
            {
                name: 'Editar',
                permiso: 'edit_proforma',
            },
            {
                name: 'Eliminar',
                permiso: 'delete_proforma',
            },
        ]
    },
    {
        'name': 'Cronograma',
        'permisos': [
            {
                name: 'Disponible',
                permiso: 'cronograma',
            },
        ]
    },
    {
        'name': 'Comisiones',
        'permisos': [
            {
                name: 'Disponible',
                permiso: 'comisiones',
            },
        ]
    },
    {
        'name': 'Compras',
        'permisos': [
            {
                name: 'Registrar',
                permiso: 'register_compra',
            },
            {
                name:'Listado',
                permiso: 'list_compra',
            },
            {
                name: 'Editar',
                permiso: 'edit_compra',
            },
            {
                name: 'Eliminar',
                permiso: 'delete_compra',
            },
        ]
    },
    {
        'name': 'Transporte',
        'permisos': [
            {
                name: 'Registrar',
                permiso: 'register_transporte',
            },
            {
                name:'Listado',
                permiso: 'list_transporte',
            },
            {
                name: 'Editar',
                permiso: 'edit_transporte',
            },
            {
                name: 'Eliminar',
                permiso: 'delete_transporte',
            },
        ]
    },
    {
        'name': 'Despacho',
        'permisos': [
            {
                name: 'Disponible',
                permiso: 'despacho',
            },
        ]
    },
    {
        'name': 'Movimientos',
        'permisos': [
            {
                name: 'Disponible',
                permiso: 'movimientos',
            },
        ]
    },
    {
        'name': 'Kardex',
        'permisos': [
            {
                name: 'Disponible',
                permiso: 'kardex',
            },
        ]
    },
];