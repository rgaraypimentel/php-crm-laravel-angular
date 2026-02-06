import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SIDEBAR } from 'src/app/config/config';
import { RolesService } from '../service/roles.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-roles',
  templateUrl: './edit-roles.component.html',
  styleUrls: ['./edit-roles.component.scss']
})
export class EditRolesComponent {

  @Output() RoleE: EventEmitter<any> = new EventEmitter();
  @Input()  ROLE_SELECTED:any;

  name:string = '';
  isLoading:any;

  SIDEBAR:any = SIDEBAR;

  permisions:any = [];
  constructor(
    public modal: NgbActiveModal,
    public rolesService: RolesService,
    public toast: ToastrService,
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.name = this.ROLE_SELECTED.name;
    this.permisions = this.ROLE_SELECTED.permission_pluck;
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

    this.rolesService.updateRole(this.ROLE_SELECTED.id,data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","El rol se edito correctamente");
        this.RoleE.emit(resp.role);
        this.modal.close();
      }
    })
  }

}
