import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransportsRoutingModule } from './transports-routing.module';
import { TransportsComponent } from './transports.component';
import { ListTransportsComponent } from './list-transports/list-transports.component';
import { EditTransportsComponent } from './edit-transports/edit-transports.component';
import { DeleteTransportsComponent } from './delete-transports/delete-transports.component';
import { CreateTransportsComponent } from './create-transports/create-transports.component';
import { DeleteDetailTransportsComponent } from './components/delete-detail-transports/delete-detail-transports.component';
import { EditDetailTransportsComponent } from './components/edit-detail-transports/edit-detail-transports.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    TransportsComponent,
    ListTransportsComponent,
    EditTransportsComponent,
    DeleteTransportsComponent,
    CreateTransportsComponent,
    DeleteDetailTransportsComponent,
    EditDetailTransportsComponent
  ],
  imports: [
    CommonModule,
    TransportsRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ]
})
export class TransportsModule { }
