import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CajaIngresoService } from '../../service/caja-ingreso.service';

@Component({
  selector: 'app-caja-ingreso-edit',
  templateUrl: './caja-ingreso-edit.component.html',
  styleUrls: ['./caja-ingreso-edit.component.scss']
})
export class CajaIngresoEditComponent {

  @Input() caja_sucursale:any;
  @Input() ingreso:any;
  @Output() CajaIngreso: EventEmitter<any> = new EventEmitter();
  amount:number = 0;
  description:string = '';

  isLoading$:any;
  constructor(
    public modal: NgbActiveModal,
    public cajaIngreso: CajaIngresoService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.cajaIngreso.isLoading$;
    this.description = this.ingreso.description;
    this.amount = this.ingreso.amount;
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
    this.cajaIngreso.updateIngreso(this.ingreso.id,data).subscribe((resp:any) => {
      console.log(resp);

      if(resp.message == 403){
        this.toast.error("Validacion",resp.message_text);
      }else{
        this.modal.close();
        this.toast.success("Exito","El ingreso se edito perfectamente");
        this.CajaIngreso.emit(resp);
      }
    })
  }

}
