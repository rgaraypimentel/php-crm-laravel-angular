import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComissionsComponent } from './comissions.component';

const routes: Routes = [
  {
    path:'',
    component: ComissionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComissionsRoutingModule { }
