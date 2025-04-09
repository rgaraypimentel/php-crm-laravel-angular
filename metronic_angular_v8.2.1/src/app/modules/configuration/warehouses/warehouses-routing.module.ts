import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarehousesComponent } from './warehouses.component';
import { ListWarehouseComponent } from './list-warehouse/list-warehouse.component';

const routes: Routes = [
  {
    path: '',
    component: WarehousesComponent,
    children: [
      {
        path: 'list',
        component: ListWarehouseComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehousesRoutingModule { }
