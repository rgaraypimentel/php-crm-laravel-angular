import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AbastecimientoComprasRoutingModule } from './abastecimiento-compras-routing.module';
import { AbastecimientoComprasComponent } from './abastecimiento-compras.component';
import { CreateAbastecimientoComponent } from './create-abastecimiento/create-abastecimiento.component';
import { ListAbastecimientoComponent } from './list-abastecimiento/list-abastecimiento.component';
import { EditAbastecimientoComponent } from './edit-abastecimiento/edit-abastecimiento.component';
import { DeleteAbastecimientoComponent } from './delete-abastecimiento/delete-abastecimiento.component';
import { NegociacionProveedoresComponent } from './negociacion-proveedores/negociacion-proveedores.component';


@NgModule({
  declarations: [
    AbastecimientoComprasComponent,
    CreateAbastecimientoComponent,
    ListAbastecimientoComponent,
    EditAbastecimientoComponent,
    DeleteAbastecimientoComponent,
    NegociacionProveedoresComponent
  ],
  imports: [
    CommonModule,
    AbastecimientoComprasRoutingModule
  ]
})
export class AbastecimientoComprasModule { }
