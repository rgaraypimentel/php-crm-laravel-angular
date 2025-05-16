import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CajaEgresoService } from '../../service/caja-egreso.service';

@Component({
  selector: 'app-caja-egreso-delete',
  templateUrl: './caja-egreso-delete.component.html',
  styleUrls: ['./caja-egreso-delete.component.scss']
})
export class CajaEgresoDeleteComponent {
  @Output() CajaEgreso: EventEmitter<any> = new EventEmitter();
  @Input()  egreso:any;

  isLoading:any;
  constructor(
    public modal: NgbActiveModal,
    public cajaEgreso: CajaEgresoService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
  }

  delete(){

    this.cajaEgreso.deleteEgreso(this.egreso.id).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","El egreso se elimino correctamente");
        this.CajaEgreso.emit(resp);
        this.modal.close();
      }
    })
  }
}
