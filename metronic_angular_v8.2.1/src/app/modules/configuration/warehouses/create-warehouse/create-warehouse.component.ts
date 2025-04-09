import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WarehouseService } from '../service/warehouse.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-warehouse',
  templateUrl: './create-warehouse.component.html',
  styleUrls: ['./create-warehouse.component.scss']
})
export class CreateWarehouseComponent {
  @Output() WareHouseC: EventEmitter<any> = new EventEmitter();
  @Input() SUCURSALES:any = [];
  name:string = '';
  address:string = '';
  sucursale_id:string = '';

  isLoading:any;

  constructor(
    public modal: NgbActiveModal,
    public wareHouseService: WarehouseService,
    public toast: ToastrService,
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }

  store(){
    if(!this.name){
      this.toast.error("Validación","El nombre de la sucursal es requerido");
      return false;
    }

    let data = {
      name: this.name,
      address:this.address,
      sucursale_id: this.sucursale_id,
    }

    this.wareHouseService.registerWarehouse(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","El almacen se registro correctamente");
        this.WareHouseC.emit(resp.warehouse);
        this.modal.close();
      }
    })
  }
}
