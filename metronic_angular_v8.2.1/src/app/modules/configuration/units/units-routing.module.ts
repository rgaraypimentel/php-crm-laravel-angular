import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnitsComponent } from './units.component';
import { ListUnitsComponent } from './list-units/list-units.component';

const routes: Routes = [
  {
    path: '',
    component: UnitsComponent,
    children: [
      {
        path: 'list',
        component: ListUnitsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnitsRoutingModule { }
