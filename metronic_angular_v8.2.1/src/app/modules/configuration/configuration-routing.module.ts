import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'sucursales',
    loadChildren: () => import('./sucursales/sucursales.module').then((m) => m.SucursalesModule),
  },
  {
    path: 'almacenes',
    loadChildren: () => import('./warehouses/warehouses.module').then((m) => m.WarehousesModule),
  },
  {
    path: 'lugar-de-entrega',
    loadChildren: () => import('./sucursal-deliveries/sucursal-deliveries.module').then((m) => m.SucursalDeliveriesModule),
  },
  {
    path: 'metodo-de-pagos',
    loadChildren: () => import('./method-payment/method-payment.module').then((m) => m.MethodPaymentModule),
  },
  {
    path: 'segmento-de-cliente',
    loadChildren: () => import('./client-segment/client-segment.module').then((m) => m.ClientSegmentModule),
  },
  {
    path: 'categoria-de-productos',
    loadChildren: () => import('./product-categories/product-categories.module').then((m) => m.ProductCategoriesModule),
  },
  {
    path: 'proveedores',
    loadChildren: () => import('./providers/providers.module').then((m) => m.ProvidersModule),
  },
  {
    path: 'unidades',
    loadChildren: () => import('./units/units.module').then((m) => m.UnitsModule),
  },
  {
    path: 'configuracion-comisiones',
    loadChildren: () => import('./g-comissions/g-comissions.module').then((m) => m.GComissionsModule),
  },
  {
    path: 'lotes',
    loadChildren: () => import('./lotes/lotes.module').then((m) => m.LotesModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
