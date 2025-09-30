import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LotesComponent } from './lotes.component';
import { ListLotesComponent } from './list-lotes/list-lotes.component';

const routes: Routes = [
  {
    path: '',
    component: LotesComponent,
    children: [
      {
        path: 'listado',
        component: ListLotesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LotesRoutingModule { }
