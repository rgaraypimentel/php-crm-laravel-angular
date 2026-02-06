import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CajaEgresoService } from '../../service/caja-egreso.service';

@Component({
  selector: 'app-caja-egreso-edit',
  templateUrl: './caja-egreso-edit.component.html',
  styleUrls: ['./caja-egreso-edit.component.scss']
})
export class CajaEgresoEditComponent {
  @Input() caja_sucursale:any;
  @Input() egreso:any;
  @Output() CajaEgreso: EventEmitter<any> = new EventEmitter();
  amount:number = 0;
  description:string = '';

  isLoading$:any;
  constructor(
    public modal: NgbActiveModal,
    public cajaEgreso: CajaEgresoService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.cajaEgreso.isLoading$;
    this.description = this.egreso.description;
    this.amount = this.egreso.amount;
  }

  store(){
    if(!this.description){
      this.toast.error("Validación","Necesitas ingresar una descripción");
      return;
    }
    if(!this.amount){
      this.toast.error("Validación","Necesitas ingresar una monto");
      return;
    }

    let data = {
      caja_sucursale_id: this.caja_sucursale.id,
      description: this.description,
      amount:this.amount,
    }
    this.cajaEgreso.updateEgreso(this.egreso.id,data).subscribe((resp:any) => {
      console.log(resp);

      if(resp.message == 403){
        this.toast.error("Validacion",resp.message_text);
      }else{
        this.modal.close();
        this.toast.success("Exito","El egreso se edito perfectamente");
        this.CajaEgreso.emit(resp);
      }
    })
  }
}
