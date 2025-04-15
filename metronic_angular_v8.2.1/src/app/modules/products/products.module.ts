import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ListProductComponent } from './list-product/list-product.component';
import { DeleteProductComponent } from './delete-product/delete-product.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { DeleteWarehouseProductComponent } from './warehouse/delete-warehouse-product/delete-warehouse-product.component';
import { EditWarehouseProductComponent } from './warehouse/edit-warehouse-product/edit-warehouse-product.component';
import { DeleteWalletPriceProductComponent } from './wallet/delete-wallet-price-product/delete-wallet-price-product.component';
import { EditWalletPriceProductComponent } from './wallet/edit-wallet-price-product/edit-wallet-price-product.component';
import { ImportProductsComponent } from './import-products/import-products.component';


@NgModule({
  declarations: [
    ProductsComponent,
    CreateProductComponent,
    EditProductComponent,
    ListProductComponent,
    DeleteProductComponent,
    DeleteWarehouseProductComponent,
    EditWarehouseProductComponent,
    DeleteWalletPriceProductComponent,
    EditWalletPriceProductComponent,
    ImportProductsComponent,
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ]
})
export class ProductsModule { }
