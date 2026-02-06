import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CajaIngresoService } from '../../service/caja-ingreso.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-caja-ingreso-delete',
  templateUrl: './caja-ingreso-delete.component.html',
  styleUrls: ['./caja-ingreso-delete.component.scss']
})
export class CajaIngresoDeleteComponent {

  @Output() CajaIngreso: EventEmitter<any> = new EventEmitter();
  @Input()  ingreso:any;

  isLoading:any;
  constructor(
    public modal: NgbActiveModal,
    public cajaIngreso: CajaIngresoService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
  }

  delete(){

    this.cajaIngreso.deleteIngreso(this.ingreso.id).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","El ingreso se elimino correctamente");
        this.CajaIngreso.emit(resp);
        this.modal.close();
      }
    })
  }

}
