import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DespachoRoutingModule } from './despacho-routing.module';
import { DespachoComponent } from './despacho.component';


@NgModule({
  declarations: [
    DespachoComponent
  ],
  imports: [
    CommonModule,
    DespachoRoutingModule
  ]
})
export class DespachoModule { }
