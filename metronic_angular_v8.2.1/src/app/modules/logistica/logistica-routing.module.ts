import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'abastecimiento',
    loadChildren: () => import('./abastecimiento-compras/abastecimiento-compras.module').then((m) => m.AbastecimientoComprasModule),
  },
  {
    path: 'almacen',
    loadChildren: () => import('./almacen/almacen.module').then((m) => m.AlmacenModule),
  },
  {
    path: 'despacho',
    loadChildren: () => import('./despacho/despacho.module').then((m) => m.DespachoModule),
  },
  {
    path: 'recepcion-mercaderia',
    loadChildren: () => import('./recepcion-mercaderia/recepcion-mercaderia.module').then((m) => m.RecepcionMercaderiaModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogisticaRoutingModule { }
