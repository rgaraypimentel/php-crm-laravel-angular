import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnitsRoutingModule } from './units-routing.module';
import { UnitsComponent } from './units.component';
import { CreateUnitsComponent } from './create-units/create-units.component';
import { EditUnitsComponent } from './edit-units/edit-units.component';
import { ListUnitsComponent } from './list-units/list-units.component';
import { DeleteUnitsComponent } from './delete-units/delete-units.component';
import { DeleteTransformsUnitsComponent } from './delete-transforms-units/delete-transforms-units.component';
import { CreateTransformsUnitsComponent } from './create-transforms-units/create-transforms-units.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    UnitsComponent,
    CreateUnitsComponent,
    EditUnitsComponent,
    ListUnitsComponent,
    DeleteUnitsComponent,
    DeleteTransformsUnitsComponent,
    CreateTransformsUnitsComponent
  ],
  imports: [
    CommonModule,
    UnitsRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ]
})
export class UnitsModule { }
