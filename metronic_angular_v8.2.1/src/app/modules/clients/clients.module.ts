import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import { ClientsComponent } from './clients.component';
import { ListClientsComponent } from './list-clients/list-clients.component';
import { DeleteClientsComponent } from './delete-clients/delete-clients.component';
import { EditClientsCompanyComponent } from './edit-clients-company/edit-clients-company.component';
import { EditClientsPersonComponent } from './edit-clients-person/edit-clients-person.component';
import { CreateClientsPersonComponent } from './create-clients-person/create-clients-person.component';
import { CreateClientsCompanyComponent } from './create-clients-company/create-clients-company.component';
import { ImportClientsComponent } from './import-clients/import-clients.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    ClientsComponent,
    ListClientsComponent,
    DeleteClientsComponent,
    EditClientsCompanyComponent,
    EditClientsPersonComponent,
    CreateClientsPersonComponent,
    CreateClientsCompanyComponent,
    ImportClientsComponent
  ],
  imports: [
    CommonModule,
    ClientsRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ]
})
export class ClientsModule { }
