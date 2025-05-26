import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConversionsRoutingModule } from './conversions-routing.module';
import { ConversionsComponent } from './conversions.component';
import { CreateConversionComponent } from './create-conversion/create-conversion.component';
import { DeleteConversionComponent } from './delete-conversion/delete-conversion.component';
import { ListConversionComponent } from './list-conversion/list-conversion.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    ConversionsComponent,
    CreateConversionComponent,
    DeleteConversionComponent,
    ListConversionComponent
  ],
  imports: [
    CommonModule,
    ConversionsRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ]
})
export class ConversionsModule { }
