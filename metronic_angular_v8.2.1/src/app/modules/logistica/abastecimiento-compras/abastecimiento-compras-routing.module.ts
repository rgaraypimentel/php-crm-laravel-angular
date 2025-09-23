import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbastecimientoComprasComponent } from './abastecimiento-compras.component';
import { CreateAbastecimientoComponent } from './create-abastecimiento/create-abastecimiento.component';
import { ListAbastecimientoComponent } from './list-abastecimiento/list-abastecimiento.component';
import { NegociacionProveedoresComponent } from './negociacion-proveedores/negociacion-proveedores.component';

const routes: Routes = [{
  path: '',
    component: AbastecimientoComprasComponent,
    children: [
      {
        path: 'list',
        component: ListAbastecimientoComponent
      },
      {
        path: 'registro',
        component: CreateAbastecimientoComponent
      },
      {
        path: 'list-costos',
        component: NegociacionProveedoresComponent
      },
    ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AbastecimientoComprasRoutingModule { }
