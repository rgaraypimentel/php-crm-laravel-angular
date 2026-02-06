import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KardexRoutingModule } from './kardex-routing.module';
import { KardexComponent } from '../kardex/kardex.component';
import { ListKardexComponent } from './list-kardex/list-kardex.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    KardexComponent,
    ListKardexComponent
  ],
  imports: [
    CommonModule,
    KardexRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ]
})
export class KardexModule { }
