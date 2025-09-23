import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentasRoutingModule } from './ventas-routing.module';
import { FacturacionComponent } from './facturacion/facturacion.component';
import { VentasComponent } from './ventas.component';
import { CreateFacturaComponent } from './facturacion/create-factura/create-factura.component';
import { ListVentasComponent } from './list-ventas/list-ventas.component';
import { CreateVentasComponent } from './create-ventas/create-ventas.component';


@NgModule({
  declarations: [
    FacturacionComponent,
    VentasComponent,
    CreateFacturaComponent,
    ListVentasComponent,
    CreateVentasComponent,
  ],
  imports: [
    CommonModule,
    VentasRoutingModule
  ]
})
export class VentasModule { }
