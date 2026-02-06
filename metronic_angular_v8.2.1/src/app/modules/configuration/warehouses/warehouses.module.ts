import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WarehousesRoutingModule } from './warehouses-routing.module';
import { WarehousesComponent } from './warehouses.component';
import { CreateWarehouseComponent } from './create-warehouse/create-warehouse.component';
import { EditWarehouseComponent } from './edit-warehouse/edit-warehouse.component';
import { ListWarehouseComponent } from './list-warehouse/list-warehouse.component';
import { DeleteWarehouseComponent } from './delete-warehouse/delete-warehouse.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    WarehousesComponent,
    CreateWarehouseComponent,
    EditWarehouseComponent,
    ListWarehouseComponent,
    DeleteWarehouseComponent
  ],
  imports: [
    CommonModule,
    WarehousesRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ]
})
export class WarehousesModule { }
