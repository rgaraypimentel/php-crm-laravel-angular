import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WarehouseService } from '../service/warehouse.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-warehouse',
  templateUrl: './delete-warehouse.component.html',
  styleUrls: ['./delete-warehouse.component.scss']
})
export class DeleteWarehouseComponent {
  @Output() WareHouseD: EventEmitter<any> = new EventEmitter();
  @Input()  WAREHOUSE_SELECTED:any;

  isLoading:any;
  constructor(
    public modal: NgbActiveModal,
    public warehouseService: WarehouseService,
    public toast: ToastrService,
  ) {
    
  }

  ngOnInit(): void {
  }

  delete(){
    
    this.warehouseService.deleteWarehouse(this.WAREHOUSE_SELECTED.id).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","El almacen se elimino correctamente");
        this.WareHouseD.emit(resp.message);
        this.modal.close();
      }
    })
  }
}
