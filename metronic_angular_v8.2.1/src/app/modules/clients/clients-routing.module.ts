import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientsComponent } from './clients.component';
import { ListClientsComponent } from './list-clients/list-clients.component';

const routes: Routes = [
  {
    path: '',
    component: ClientsComponent,
    children: [
      {
        path: 'list',
        component: ListClientsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
