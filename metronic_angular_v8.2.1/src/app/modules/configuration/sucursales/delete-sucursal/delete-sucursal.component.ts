import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SucursalService } from '../service/sucursal.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-sucursal',
  templateUrl: './delete-sucursal.component.html',
  styleUrls: ['./delete-sucursal.component.scss']
})
export class DeleteSucursalComponent {
  @Output() SucursalD: EventEmitter<any> = new EventEmitter();
  @Input()  SUCURSAL_SELECTED:any;

  isLoading:any;
  constructor(
    public modal: NgbActiveModal,
    public sucursalesService: SucursalService,
    public toast: ToastrService,
  ) {
    
  }

  ngOnInit(): void {
  }

  delete(){
    
    this.sucursalesService.deleteSucursal(this.SUCURSAL_SELECTED.id).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","La sucursal se elimino correctamente");
        this.SucursalD.emit(resp.message);
        this.modal.close();
      }
    })
  }
}
