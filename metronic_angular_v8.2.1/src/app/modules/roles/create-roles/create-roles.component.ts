import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SIDEBAR } from 'src/app/config/config';

@Component({
  selector: 'app-create-roles',
  templateUrl: './create-roles.component.html',
  styleUrls: ['./create-roles.component.scss']
})
export class CreateRolesComponent {

  name: string = '';

  isLoading:any;
  SIDEBAR: any = SIDEBAR;
  constructor(
    public modal: NgbActiveModal,
  ) {
  
  }

  ngoOnInit() {
    // Initialize the component
  }

  store() {
    // Store the data
  }
}
