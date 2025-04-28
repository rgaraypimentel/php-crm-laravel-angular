import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProformasComponent } from './proformas.component';
import { CreateProformaComponent } from './create-proforma/create-proforma.component';
import { EditProformaComponent } from './edit-proforma/edit-proforma.component';
import { ListProformaComponent } from './list-proforma/list-proforma.component';

const routes: Routes = [
  {
    path: '',
    component: ProformasComponent,
    children: [
      {
        path:'crear',
        component: CreateProformaComponent
      },
      {
        path: 'listado',
        component: ListProformaComponent
      },
      {
        path:'listado/edicion/:id',
        component: EditProformaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProformasRoutingModule { }
