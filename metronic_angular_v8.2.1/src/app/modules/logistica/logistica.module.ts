import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogisticaRoutingModule } from './logistica-routing.module';
import { AbastecimientoComprasModule } from './abastecimiento-compras/abastecimiento-compras.module';
import { AlmacenModule } from './almacen/almacen.module';
import { RecepcionMercaderiaModule } from './recepcion-mercaderia/recepcion-mercaderia.module';
import { DespachoModule } from './despacho/despacho.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    LogisticaRoutingModule,

    AbastecimientoComprasModule,
    AlmacenModule,
    DespachoModule,
    RecepcionMercaderiaModule,

  ]
})
export class LogisticaModule { }
