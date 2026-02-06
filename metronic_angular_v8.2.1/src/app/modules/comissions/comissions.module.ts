import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComissionsRoutingModule } from './comissions-routing.module';
import { ComissionsComponent } from './comissions.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    ComissionsComponent
  ],
  imports: [
    CommonModule,
    ComissionsRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ]
})
export class ComissionsModule { }
