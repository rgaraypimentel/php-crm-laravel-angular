import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LotesRoutingModule } from './lotes-routing.module';
import { LotesComponent } from './lotes.component';
import { ListLotesComponent } from './list-lotes/list-lotes.component';
import { CreateLoteComponent } from './create-lote/create-lote.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    LotesComponent,
    ListLotesComponent,
    CreateLoteComponent
  ],
  imports: [
    CommonModule,
    LotesRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ]
})
export class LotesModule { }
