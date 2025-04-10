import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { SucursalesModule } from './sucursales/sucursales.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { SucursalDeliveriesModule } from './sucursal-deliveries/sucursal-deliveries.module';
import { MethodPaymentModule } from './method-payment/method-payment.module';
import { ClientSegmentModule } from './client-segment/client-segment.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { ProvidersModule } from './providers/providers.module';
import { UnitsModule } from './units/units.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,

    SucursalesModule,
    WarehousesModule,
    SucursalDeliveriesModule,
    MethodPaymentModule,
    ClientSegmentModule,
    ProductCategoriesModule,
    ProvidersModule,
    UnitsModule,
  ]
})
export class ConfigurationModule { }
