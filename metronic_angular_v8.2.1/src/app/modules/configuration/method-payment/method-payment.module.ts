import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MethodPaymentRoutingModule } from './method-payment-routing.module';
import { MethodPaymentComponent } from './method-payment.component';
import { CreateMethodPaymentComponent } from './create-method-payment/create-method-payment.component';
import { EditMethodPaymentComponent } from './edit-method-payment/edit-method-payment.component';
import { ListMethodPaymentComponent } from './list-method-payment/list-method-payment.component';
import { DeleteMethodPaymentComponent } from './delete-method-payment/delete-method-payment.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    MethodPaymentComponent,
    CreateMethodPaymentComponent,
    EditMethodPaymentComponent,
    ListMethodPaymentComponent,
    DeleteMethodPaymentComponent
  ],
  imports: [
    CommonModule,
    MethodPaymentRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ]
})
export class MethodPaymentModule { }
