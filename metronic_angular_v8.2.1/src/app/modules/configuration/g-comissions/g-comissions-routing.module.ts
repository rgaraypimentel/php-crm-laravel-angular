import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GComissionsComponent } from './g-comissions.component';

const routes: Routes = [
  {
    path: '',
    component: GComissionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GComissionsRoutingModule { }
