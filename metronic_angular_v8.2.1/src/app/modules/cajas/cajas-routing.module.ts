import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CajasComponent } from './cajas.component';
import { ListsCajaProcessComponent } from './lists-caja-process/lists-caja-process.component';

const routes: Routes = [
  {
    path:'',
    component: CajasComponent,
    children: [
      {
        path:'gestion',
        component: ListsCajaProcessComponent
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CajasRoutingModule { }
