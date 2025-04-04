import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesComponent } from './roles.component';
import { ListRolesComponent } from './list-roles/list-roles.component';
import { EditRolesComponent } from './edit-roles/edit-roles.component';
import { DeleteRolesComponent } from './delete-roles/delete-roles.component';
import { CreateRolesComponent } from './create-roles/create-roles.component';

const routes: Routes = [
  {
    path:'',
    component:RolesComponent,
    children:
    [
      {
        path: 'list',
        component: ListRolesComponent
      },
      
    ]  
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
