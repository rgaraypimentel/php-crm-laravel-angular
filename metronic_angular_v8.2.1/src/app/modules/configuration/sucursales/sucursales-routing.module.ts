import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SucursalesComponent } from './sucursales.component';
import { ListSucursalComponent } from './list-sucursal/list-sucursal.component';

const routes: Routes = [
  {
    path:'',
    component: SucursalesComponent,
    children:[
      {
        path: 'list',
        component: ListSucursalComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SucursalesRoutingModule { }
