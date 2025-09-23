import { Routes } from '@angular/router';

const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'builder',
    loadChildren: () => import('./builder/builder.module').then((m) => m.BuilderModule),
  },
  {
    path: 'crafted/pages/profile',
    loadChildren: () => import('../modules/profile/profile.module').then((m) => m.ProfileModule),
    // data: { layout: 'light-sidebar' },
  },
  {
    path: 'crafted/account',
    loadChildren: () => import('../modules/account/account.module').then((m) => m.AccountModule),
    // data: { layout: 'dark-header' },
  },
  {
    path: 'crafted/pages/wizards',
    loadChildren: () => import('../modules/wizards/wizards.module').then((m) => m.WizardsModule),
    // data: { layout: 'light-header' },
  },
  {
    path: 'crafted/widgets',
    loadChildren: () => import('../modules/widgets-examples/widgets-examples.module').then((m) => m.WidgetsExamplesModule),
    // data: { layout: 'light-header' },
  },
  {
    path: 'apps/chat',
    loadChildren: () => import('../modules/apps/chat/chat.module').then((m) => m.ChatModule),
    // data: { layout: 'light-sidebar' },
  },
  {
    path: 'apps/users',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'apps/roles',
    loadChildren: () => import('./role/role.module').then((m) => m.RoleModule),
  },
  {
    path: 'apps/permissions',
    loadChildren: () => import('./permission/permission.module').then((m) => m.PermissionModule),
  },
  //mis roles localhos:4200/roles/list
  {
    path: 'roles',
    loadChildren: () => import('../modules/roles/roles.module').then((m) => m.RolesModule),
  },
  {
    path: 'usuarios',
    loadChildren: () => import('../modules/users/users.module').then((m) => m.UsersModule),
  },
  // MIS MODULOS localhost:4200/configuraciones/sucursales/list
  {
    path: 'configuraciones',
    loadChildren: () => import('../modules/configuration/configuration.module').then((m) => m.ConfigurationModule),
  },
  {
    path: 'productos',
    loadChildren: () => import('../modules/products/products.module').then((m) => m.ProductsModule),
  },
  {
    path: 'clientes',
    loadChildren: () => import('../modules/clients/clients.module').then((m) => m.ClientsModule),
  },
  {
    path: 'proformas',
    loadChildren: () => import('../modules/proformas/proformas.module').then((m) => m.ProformasModule),
  },
  {
    path: 'caja',
    loadChildren: () => import('../modules/cajas/cajas.module').then((m) => m.CajasModule),
  },
  {
    path: 'cronograma-de-envios',
    loadChildren: () => import('../modules/cronograma-proformas/cronograma-proformas.module').then((m) => m.CronogramaProformasModule),
  },
  {
    path: 'comisiones-asesores',
    loadChildren: () => import('../modules/comissions/comissions.module').then((m) => m.ComissionsModule),
  },
  {
    path: 'compras',
    loadChildren: () => import('../modules/purchase/purchase.module').then((m) => m.PurchaseModule),
  },
  {
    path: 'transportes',
    loadChildren: () => import('../modules/transports/transports.module').then((m) => m.TransportsModule),
  },
  {
    path: 'conversiones',
    loadChildren: () => import('../modules/conversions/conversions.module').then((m) => m.ConversionsModule),
  },
  {
    path: 'despacho',
    loadChildren: () => import('../modules/despacho/despacho.module').then((m) => m.DespachoModule),
  },
  {
    path: 'kardex',
    loadChildren: () => import('../modules/kardex/kardex.module').then((m) => m.KardexModule),
  },
  {
    path: 'logistica',
    loadChildren: () => import('../modules/logistica/logistica.module').then((m) => m.LogisticaModule),
  },  
  {
    path: 'ventas',
    loadChildren: () => import('../modules/ventas/ventas.module').then((m) => m.VentasModule),
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
