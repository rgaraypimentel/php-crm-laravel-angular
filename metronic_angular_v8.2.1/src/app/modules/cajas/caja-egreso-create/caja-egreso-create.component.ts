import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CajaEgresoService } from '../service/caja-egreso.service';

@Component({
  selector: 'app-caja-egreso-create',
  templateUrl: './caja-egreso-create.component.html',
  styleUrls: ['./caja-egreso-create.component.scss']
})
export class CajaEgresoCreateComponent {
  @Input() caja_sucursale:any;
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
    this.cajaEgreso.registerEgreso(data).subscribe((resp:any) => {
      console.log(resp);

      if(resp.message == 403){
        this.toast.error("Validacion",resp.message_text);
      }else{
        this.modal.close();
        this.toast.success("Exito","El egreso se registro perfectamente");
        this.CajaEgreso.emit(resp);
      }
    })
  }
}
