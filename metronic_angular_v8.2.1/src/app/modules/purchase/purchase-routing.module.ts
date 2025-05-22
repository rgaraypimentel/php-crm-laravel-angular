import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePurchaseComponent } from './create-purchase/create-purchase.component';
import { EditPurchaseComponent } from './edit-purchase/edit-purchase.component';
import { ListsPurchasesComponent } from './lists-purchases/lists-purchases.component';
import { PurchaseComponent } from './purchase.component';

const routes: Routes = [

  {
    path: '',
    component: PurchaseComponent,
    children: [
      {
        path:'registro',
        component: CreatePurchaseComponent
      },
      {
        path:'listado',
        component: ListsPurchasesComponent
      },
      {
        path:'listado/editar/:id',
        component: EditPurchaseComponent
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
