import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductCategoriesComponent } from './product-categories.component';
import { ListProductCategorieComponent } from './list-product-categorie/list-product-categorie.component';

const routes: Routes = [
  {
    path: '',
    component: ProductCategoriesComponent,
    children: [
      {
        path: 'list',
        component: ListProductCategorieComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductCategoriesRoutingModule { }
