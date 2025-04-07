import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateRolesComponent } from '../create-roles/create-roles.component';

@Component({
  selector: 'app-list-roles',
  templateUrl: './list-roles.component.html',
  styleUrls: ['./list-roles.component.scss']
})
export class ListRolesComponent {

  constructor(
    public modalService: NgbModal,
  ) {

  }

  ngOnInit() {
    // Initialize the component
  }

  createRol() {
    const modalRef = this.modalService.open(CreateRolesComponent, {centered: true,size: 'md'});
  }

}
