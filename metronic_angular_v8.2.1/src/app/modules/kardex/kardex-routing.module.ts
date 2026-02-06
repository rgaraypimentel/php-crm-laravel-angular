import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KardexComponent } from './kardex.component';
import { ListKardexComponent } from './list-kardex/list-kardex.component';

const routes: Routes = [
  {
    path:'',
    component: KardexComponent,
    children: [
      {
        path:'reporte',
        component: ListKardexComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KardexRoutingModule { }
