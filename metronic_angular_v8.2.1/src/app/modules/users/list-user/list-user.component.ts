import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateUserComponent } from '../create-user/create-user.component';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { UsersService } from '../service/users.service';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent {

  search:string = '';
  USERS:any = [];
  isLoading$:any;

  roles:any = [];

  totalPages:number = 0;
  currentPage:number = 1;
  constructor(
    public modalService: NgbModal,
    public usersService: UsersService,
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.usersService.isLoading$;
    this.listUsers();
    this.configAll();
  }

  listUsers(page = 1){
    this.usersService.listUsers(page,this.search).subscribe((resp:any) => {
      console.log(resp);
      this.USERS = resp.users;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }
  configAll(){
    this.usersService.configAll().subscribe((resp:any) => {
      console.log(resp);
      this.roles = resp.roles;
    })
  }
  loadPage($event:any){
    this.listUsers($event);
  }

  createUser(){
    const modalRef = this.modalService.open(CreateUserComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.roles = this.roles;

    modalRef.componentInstance.UserC.subscribe((role:any) => {
      this.USERS.unshift(role);
    })
  }

  editUser(USER:any){
    const modalRef = this.modalService.open(EditUserComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.USER_SELECTED = USER;
    modalRef.componentInstance.roles = this.roles;

    modalRef.componentInstance.UserE.subscribe((user:any) => {
      let INDEX = this.USERS.findIndex((user:any) => user.id == USER.id);
      if(INDEX != -1){
        this.USERS[INDEX] = user;
      }
    })
  }

  deleteUser(USER:any){
    const modalRef = this.modalService.open(DeleteUserComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.USER_SELECTED = USER;

    modalRef.componentInstance.UserD.subscribe((user:any) => {
      let INDEX = this.USERS.findIndex((user:any) => user.id == USER.id);
      if(INDEX != -1){
        this.USERS.splice(INDEX,1);
      }
    })
  }

}
