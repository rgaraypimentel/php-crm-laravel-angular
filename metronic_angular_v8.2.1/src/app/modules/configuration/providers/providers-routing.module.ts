import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProvidersComponent } from './providers.component';
import { ListProvidersComponent } from './list-providers/list-providers.component';

const routes: Routes = [
  {
    path: '',
    component:ProvidersComponent,
    children: [
      {
        path:'list',
        component: ListProvidersComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProvidersRoutingModule { }
