import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CajasRoutingModule } from './cajas-routing.module';
import { CajasComponent } from './cajas.component';
import { CajaAperturaComponent } from './caja-apertura/caja-apertura.component';
import { CajaCierreComponent } from './caja-cierre/caja-cierre.component';
import { ListsCajaProcessComponent } from './lists-caja-process/lists-caja-process.component';
import { CajaClientsContractsComponent } from './caja-clients-contracts/caja-clients-contracts.component';
import { CajaReportDayComponent } from './caja-report-day/caja-report-day.component';
import { CajaHistoryComponent } from './caja-history/caja-history.component';
import { CajaNewPaymentComponent } from './caja-clients-contracts/caja-new-payment/caja-new-payment.component';
import { CajaEditPaymentComponent } from './caja-clients-contracts/caja-edit-payment/caja-edit-payment.component';
import { CajaEgresoCreateComponent } from './caja-egreso-create/caja-egreso-create.component';
import { CajaEgresoDeleteComponent } from './caja-egreso-create/caja-egreso-delete/caja-egreso-delete.component';
import { CajaEgresoEditComponent } from './caja-egreso-create/caja-egreso-edit/caja-egreso-edit.component';
import { ShowDetailsPaymentsComponent } from './lists-caja-process/show-details-payments/show-details-payments.component';
import { CajaIngresoCreateComponent } from './caja-ingreso-create/caja-ingreso-create.component';
import { CajaIngresoEditComponent } from './caja-ingreso-create/caja-ingreso-edit/caja-ingreso-edit.component';
import { CajaIngresoDeleteComponent } from './caja-ingreso-create/caja-ingreso-delete/caja-ingreso-delete.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    CajasComponent,
    CajaAperturaComponent,
    CajaCierreComponent,
    ListsCajaProcessComponent,
    CajaClientsContractsComponent,
    CajaReportDayComponent,
    CajaHistoryComponent,
    CajaNewPaymentComponent,
    CajaEditPaymentComponent,
    CajaIngresoCreateComponent,
    CajaIngresoEditComponent,
    CajaIngresoDeleteComponent,
    CajaEgresoCreateComponent,
    CajaEgresoDeleteComponent,
    CajaEgresoEditComponent,
    ShowDetailsPaymentsComponent
  ],
  imports: [
    CommonModule,
    CajasRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ]
})
export class CajasModule { }
