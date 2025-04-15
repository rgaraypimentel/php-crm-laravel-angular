import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProductWarehousesService } from '../../service/product-warehouses.service';

@Component({
  selector: 'app-delete-warehouse-product',
  templateUrl: './delete-warehouse-product.component.html',
  styleUrls: ['./delete-warehouse-product.component.scss']
})
export class DeleteWarehouseProductComponent {
  @Output() WarehouseD: EventEmitter<any> = new EventEmitter();
  @Input()  WAREHOUSES_PROD:any;

  isLoading:any;
  constructor(
    public modal: NgbActiveModal,
    public productWareHouseService: ProductWarehousesService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
  }

  delete(){

    this.productWareHouseService.deleteProductWarehouse(this.WAREHOUSES_PROD.id).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","La existencia del producto se elimino correctamente");
        this.WarehouseD.emit(resp.message);
        this.modal.close();
      }
    })
  }
}
