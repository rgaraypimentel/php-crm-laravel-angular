import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConversionsComponent } from './conversions.component';
import { ListConversionComponent } from './list-conversion/list-conversion.component';

const routes: Routes = [
  {
    path: '',
    component: ConversionsComponent,
    children: [
      {
        path: 'listado',
        component: ListConversionComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConversionsRoutingModule { }
