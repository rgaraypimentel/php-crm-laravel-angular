import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SucursalDeliveriesService } from '../service/sucursal-deliveries.service';

@Component({
  selector: 'app-delete-sucursal-deliverie',
  templateUrl: './delete-sucursal-deliverie.component.html',
  styleUrls: ['./delete-sucursal-deliverie.component.scss']
})
export class DeleteSucursalDeliverieComponent {
  @Output() SucursalD: EventEmitter<any> = new EventEmitter();
  @Input()  SUCURSAL_SELECTED:any;

  isLoading:any;
  constructor(
    public modal: NgbActiveModal,
    public sucursalesDeliverieService: SucursalDeliveriesService,
    public toast: ToastrService,
  ) {
    
  }

  ngOnInit(): void {
  }

  delete(){
    
    this.sucursalesDeliverieService.deleteSucursalDeliverie(this.SUCURSAL_SELECTED.id).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","El lugar de entrega se elimino correctamente");
        this.SucursalD.emit(resp.message);
        this.modal.close();
      }
    })
  }
}
