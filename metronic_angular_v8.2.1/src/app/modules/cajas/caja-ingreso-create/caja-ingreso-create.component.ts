import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CajaIngresoService } from '../service/caja-ingreso.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-caja-ingreso-create',
  templateUrl: './caja-ingreso-create.component.html',
  styleUrls: ['./caja-ingreso-create.component.scss']
})
export class CajaIngresoCreateComponent {

  @Input() caja_sucursale:any;
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
  }

  store(){
    if(!this.description){
      this.toast.error("Validación","Necesitas ingresar una descripción");
      return;
    }
    if(!this.amount){
      this.toast.error("Validación","Necesitas ingresar un monto");
      return;
    }

    let data = {
      caja_sucursale_id: this.caja_sucursale.id,
      description: this.description,
      amount:this.amount,
    }
    this.cajaIngreso.registerIngreso(data).subscribe((resp:any) => {
      console.log(resp);

      if(resp.message == 403){
        this.toast.error("Validacion",resp.message_text);
      }else{
        this.modal.close();
        this.toast.success("Exito","El ingreso se registro perfectamente");
        this.CajaIngreso.emit(resp);
      }
    })
  }
}
