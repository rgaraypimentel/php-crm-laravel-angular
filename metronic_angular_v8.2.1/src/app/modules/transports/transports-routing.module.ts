import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransportsComponent } from './transports.component';
import { CreateTransportsComponent } from './create-transports/create-transports.component';
import { EditTransportsComponent } from './edit-transports/edit-transports.component';
import { ListTransportsComponent } from './list-transports/list-transports.component';

const routes: Routes = [
  {
    path: '',
    component: TransportsComponent,
    children: [
      {
        path:'registro',
        component: CreateTransportsComponent
      },
      {
        path:'listado',
        component: ListTransportsComponent
      },
      {
        path:'listado/editar/:id',
        component: EditTransportsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransportsRoutingModule { }
