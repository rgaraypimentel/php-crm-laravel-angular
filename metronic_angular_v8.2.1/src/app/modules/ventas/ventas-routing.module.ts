import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacturacionComponent } from './facturacion/facturacion.component';
import { ProformasComponent } from '../proformas/proformas.component';
import { CreateFacturaComponent } from './facturacion/create-factura/create-factura.component';
import { VentasComponent } from './ventas.component';
import { ListVentasComponent } from './list-ventas/list-ventas.component';
import { CreateVentasComponent } from './create-ventas/create-ventas.component';

const routes: Routes = [
  {
    path: '',
    component: VentasComponent,
    children: [
      {
        path:'facturacion',
        component: FacturacionComponent
      },
      {
        path:'crear-factura',
        component: CreateFacturaComponent
      },
      {
        path:'listar-ventas',
        component: ListVentasComponent
      },
      {
        path:'registro',
        component: CreateVentasComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
