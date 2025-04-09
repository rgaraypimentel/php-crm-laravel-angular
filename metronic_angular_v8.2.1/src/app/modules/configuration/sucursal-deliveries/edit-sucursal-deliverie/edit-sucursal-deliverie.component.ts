import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SucursalDeliveriesService } from '../service/sucursal-deliveries.service';

@Component({
  selector: 'app-edit-sucursal-deliverie',
  templateUrl: './edit-sucursal-deliverie.component.html',
  styleUrls: ['./edit-sucursal-deliverie.component.scss']
})
export class EditSucursalDeliverieComponent {
  @Output() SucursalE: EventEmitter<any> = new EventEmitter();
  @Input() SUCURSAL_SELECTED:any;
  
  name:string = '';
  address:string = '';
  state:number = 1;

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
    this.name = this.SUCURSAL_SELECTED.name;
    this.address = this.SUCURSAL_SELECTED.address;
    this.state = this.SUCURSAL_SELECTED.state;
  }

  store(){
    if(!this.name){
      this.toast.error("Validación","El nombre del lugar de entrega es requerido");
      return false;
    }

    let data = {
      name: this.name,
      address:this.address,
      state: this.state,
    }

    this.sucursalDeliverieService.updateSucursalDeliverie(this.SUCURSAL_SELECTED.id,data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","El lugar de entrega se edito correctamente");
        this.SucursalE.emit(resp.sucursal);
        this.modal.close();
      }
    })
  }
}
