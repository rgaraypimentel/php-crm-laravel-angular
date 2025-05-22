import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PurchaseService } from '../../service/purchase.service';

@Component({
  selector: 'app-delete-item-purchase',
  templateUrl: './delete-item-purchase.component.html',
  styleUrls: ['./delete-item-purchase.component.scss']
})
export class DeleteItemPurchaseComponent {
  @Output() DeleteItemPurchase: EventEmitter<any> = new EventEmitter();
  @Input()  detail_purchase:any;
  @Input() importe:number = 0;
  @Input() is_edit:any = null;
  @Input() purchase_id:any = null;
  @Input()  index:any;

  isLoading:any;
  constructor(
    public modal: NgbActiveModal,
    public toast: ToastrService,
    public purchaseService: PurchaseService,
  ) {

  }

  ngOnInit(): void {
  }

  delete(){
    if(this.is_edit == 1){
      let NUEVO_IMPORTE = Number(   (this.importe - this.detail_purchase.total).toFixed(2)   );
      let NUEVO_IGV = Number((NUEVO_IMPORTE*0.18).toFixed(2));
      this.purchaseService.deletePurchaseDetail(this.detail_purchase.id,NUEVO_IMPORTE+NUEVO_IGV,NUEVO_IMPORTE,NUEVO_IGV,this.purchase_id).subscribe((resp:any) => {
        console.log(resp);
        this.DeleteItemPurchase.emit(resp);
        this.modal.close();
        this.toast.success("Exito","La eliminación se hizo correctamente");
      })
    }else{
      this.DeleteItemPurchase.emit("");
      this.modal.close();
      this.toast.success("Exito","La eliminación se hizo correctamente");
    }

  }
}
