import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SIDEBAR } from 'src/app/config/config';
import { RolesService } from '../service/roles.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-roles',
  templateUrl: './create-roles.component.html',
  styleUrls: ['./create-roles.component.scss']
})
export class CreateRolesComponent {

  @Output() RoleC: EventEmitter<any> = new EventEmitter();
  name: string = '';

  isLoading:any;
  SIDEBAR: any = SIDEBAR;
  permisions: any = [];

  constructor(
    public modal: NgbActiveModal,
    public rolesService: RolesService,
    public toast: ToastrService,
  ) {
  
  }

  ngoOnInit(): void {
    // Initialize the component
  }

  addPermission(permiso:string){
    let INDEX = this.permisions.findIndex((perm:string) => perm == permiso);
    if(INDEX != -1){
      this.permisions.splice(INDEX,1);
    }else{
      this.permisions.push(permiso);
    }
    console.log(this.permisions);
  }

  store(){
    if(!this.name){
      this.toast.error("Validación","El nombre es requerido");
      return false;
    }
    if(this.permisions.length == 0){
      this.toast.error("Validación","Necesitas seleccionar un permiso por lo menos");
      return false;
    }

    let data = {
      name: this.name,
      permisions: this.permisions,
    }

    this.rolesService.registerRole(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","El rol se registro correctamente");
        this.RoleC.emit(resp.role);
        this.modal.close();
      }
    })
  }
}
