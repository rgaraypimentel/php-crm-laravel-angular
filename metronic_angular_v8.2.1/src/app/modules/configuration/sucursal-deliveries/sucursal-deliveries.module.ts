import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SucursalDeliveriesRoutingModule } from './sucursal-deliveries-routing.module';
import { SucursalDeliveriesComponent } from './sucursal-deliveries.component';
import { ListSucursalDeliverieComponent } from './list-sucursal-deliverie/list-sucursal-deliverie.component';
import { EditSucursalDeliverieComponent } from './edit-sucursal-deliverie/edit-sucursal-deliverie.component';
import { CreateSucursalDeliverieComponent } from './create-sucursal-deliverie/create-sucursal-deliverie.component';
import { DeleteSucursalDeliverieComponent } from './delete-sucursal-deliverie/delete-sucursal-deliverie.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    SucursalDeliveriesComponent,
    ListSucursalDeliverieComponent,
    EditSucursalDeliverieComponent,
    CreateSucursalDeliverieComponent,
    DeleteSucursalDeliverieComponent
  ],
  imports: [
    CommonModule,
    SucursalDeliveriesRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ]
})
export class SucursalDeliveriesModule { }
