import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GComissionsRoutingModule } from './g-comissions-routing.module';
import { GComissionsComponent } from './g-comissions.component';
import { CreateWeekComissionComponent } from './create-week-comission/create-week-comission.component';
import { EditWeekComissionComponent } from './edit-week-comission/edit-week-comission.component';
import { ListWeekComissionComponent } from './list-week-comission/list-week-comission.component';
import { DeleteWeekComissionComponent } from './delete-week-comission/delete-week-comission.component';
import { ListCategorieComissionComponent } from './list-categorie-comission/list-categorie-comission.component';
import { CreateCategorieComissionComponent } from './list-categorie-comission/create-categorie-comission/create-categorie-comission.component';
import { EditCategorieComissionComponent } from './list-categorie-comission/edit-categorie-comission/edit-categorie-comission.component';
import { DeleteCategorieComissionComponent } from './list-categorie-comission/delete-categorie-comission/delete-categorie-comission.component';
import { ListPositionComissionComponent } from './list-position-comission/list-position-comission.component';
import { CreatePositionComissionComponent } from './list-position-comission/create-position-comission/create-position-comission.component';
import { EditPositionComissionComponent } from './list-position-comission/edit-position-comission/edit-position-comission.component';
import { DeletePositionComissionComponent } from './list-position-comission/delete-position-comission/delete-position-comission.component';
import { ListSegmentClientComissionComponent } from './list-segment-client-comission/list-segment-client-comission.component';
import { CreateSegmentClientComissionComponent } from './list-segment-client-comission/create-segment-client-comission/create-segment-client-comission.component';
import { DeleteSegmentClientComissionComponent } from './list-segment-client-comission/delete-segment-client-comission/delete-segment-client-comission.component';
import { EditSegmentClientComissionComponent } from './list-segment-client-comission/edit-segment-client-comission/edit-segment-client-comission.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    GComissionsComponent,
    CreateWeekComissionComponent,
    EditWeekComissionComponent,
    ListWeekComissionComponent,
    DeleteWeekComissionComponent,
    ListCategorieComissionComponent,
    CreateCategorieComissionComponent,
    EditCategorieComissionComponent,
    DeleteCategorieComissionComponent,
    ListPositionComissionComponent,
    CreatePositionComissionComponent,
    EditPositionComissionComponent,
    DeletePositionComissionComponent,
    ListSegmentClientComissionComponent,
    CreateSegmentClientComissionComponent,
    DeleteSegmentClientComissionComponent,
    EditSegmentClientComissionComponent,
  ],
  imports: [
    CommonModule,
    GComissionsRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ]
})
export class GComissionsModule { }
