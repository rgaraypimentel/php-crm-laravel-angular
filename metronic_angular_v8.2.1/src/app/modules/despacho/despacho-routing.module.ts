import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DespachoComponent } from './despacho.component';
import { ListContractsDespachoComponent } from './list-contracts-despacho/list-contracts-despacho.component';

const routes: Routes = [
  {
    path: '',
    component: DespachoComponent,
    children:[
      {
        path: 'listado',
        component: ListContractsDespachoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DespachoRoutingModule { }
