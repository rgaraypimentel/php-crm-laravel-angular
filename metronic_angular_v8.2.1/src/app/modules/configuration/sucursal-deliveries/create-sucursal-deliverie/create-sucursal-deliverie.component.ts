import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SucursalDeliveriesService } from '../service/sucursal-deliveries.service';

@Component({
  selector: 'app-create-sucursal-deliverie',
  templateUrl: './create-sucursal-deliverie.component.html',
  styleUrls: ['./create-sucursal-deliverie.component.scss']
})
export class CreateSucursalDeliverieComponent {
  @Output() SucursalC: EventEmitter<any> = new EventEmitter();
  name:string = '';
  address:string = '';

  isLoading:any;

  constructor(
    public modal: NgbActiveModal,
    public sucursalDeliverieService: SucursalDeliveriesService,
    public toast: ToastrService,
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }

  store(){
    if(!this.name){
      this.toast.error("Validación","El nombre del lugar de entrega es requerido");
      return false;
    }

    let data = {
      name: this.name,
      address:this.address,
    }

    this.sucursalDeliverieService.registerSucursalDeliverie(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","El lugar de entrega se registro correctamente");
        this.SucursalC.emit(resp.sucursal);
        this.modal.close();
      }
    })
  }
}
