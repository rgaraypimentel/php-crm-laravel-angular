import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SucursalDeliveriesComponent } from './sucursal-deliveries.component';
import { ListSucursalDeliverieComponent } from './list-sucursal-deliverie/list-sucursal-deliverie.component';

const routes: Routes = [{
  path: '',
  component: SucursalDeliveriesComponent,
  children: [{
    path: 'list',
    component: ListSucursalDeliverieComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SucursalDeliveriesRoutingModule { }
