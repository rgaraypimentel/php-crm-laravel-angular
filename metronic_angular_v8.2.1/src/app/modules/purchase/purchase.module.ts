import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseRoutingModule } from './purchase-routing.module';
import { PurchaseComponent } from './purchase.component';
import { ListsPurchasesComponent } from './lists-purchases/lists-purchases.component';
import { EditPurchaseComponent } from './edit-purchase/edit-purchase.component';
import { DeletePurchaseComponent } from './delete-purchase/delete-purchase.component';
import { CreatePurchaseComponent } from './create-purchase/create-purchase.component';
import { EditItemPurchaseComponent } from './components/edit-item-purchase/edit-item-purchase.component';
import { DeleteItemPurchaseComponent } from './components/delete-item-purchase/delete-item-purchase.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { DetailStockMinimoComponent } from './detail-stock-minimo/detail-stock-minimo.component';


@NgModule({
  declarations: [
    PurchaseComponent,
    ListsPurchasesComponent,
    EditPurchaseComponent,
    DeletePurchaseComponent,
    CreatePurchaseComponent,
    EditItemPurchaseComponent,
    DeleteItemPurchaseComponent,
    DetailStockMinimoComponent
  ],
  imports: [
    CommonModule,
    PurchaseRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ]
})
export class PurchaseModule { }
