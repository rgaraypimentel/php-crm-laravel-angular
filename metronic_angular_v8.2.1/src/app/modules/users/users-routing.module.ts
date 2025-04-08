import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { ListUserComponent } from './list-user/list-user.component';

const routes: Routes = [
  {
    path:'',
    component:UsersComponent,
    children:
    [
      {
        path: 'list',
        component: ListUserComponent
      },
      
    ]  
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
