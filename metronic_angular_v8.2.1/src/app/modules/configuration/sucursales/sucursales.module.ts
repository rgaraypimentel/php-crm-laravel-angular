import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SucursalesRoutingModule } from './sucursales-routing.module';
import { SucursalesComponent } from './sucursales.component';
import { CreateSucursalComponent } from './create-sucursal/create-sucursal.component';
import { EditSucursalComponent } from './edit-sucursal/edit-sucursal.component';
import { DeleteSucursalComponent } from './delete-sucursal/delete-sucursal.component';
import { ListSucursalComponent } from './list-sucursal/list-sucursal.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    SucursalesComponent,
    CreateSucursalComponent,
    EditSucursalComponent,
    DeleteSucursalComponent,
    ListSucursalComponent
  ],
  imports: [
    CommonModule,
    SucursalesRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ]
})
export class SucursalesModule { }
