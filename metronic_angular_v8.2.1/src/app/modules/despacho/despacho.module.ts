import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DespachoRoutingModule } from './despacho-routing.module';
import { DespachoComponent } from './despacho.component';
import { DetailContractsDespachoComponent } from './detail-contracts-despacho/detail-contracts-despacho.component';
import { ListContractsDespachoComponent } from './list-contracts-despacho/list-contracts-despacho.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    DespachoComponent,
    DetailContractsDespachoComponent,
    ListContractsDespachoComponent
  ],
  imports: [
    CommonModule,
    DespachoRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ]
})
export class DespachoModule { }
