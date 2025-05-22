import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PurchaseService } from '../service/purchase.service';

@Component({
  selector: 'app-delete-purchase',
  templateUrl: './delete-purchase.component.html',
  styleUrls: ['./delete-purchase.component.scss']
})
export class DeletePurchaseComponent {
  @Output() DeletePurchase: EventEmitter<any> = new EventEmitter();
  @Input()  purchase:any;

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
    this.purchaseService.deleteOrderPurchase(this.purchase.id).subscribe((resp:any) => {
      console.log(resp);
      this.DeletePurchase.emit(resp);
      this.modal.close();
      this.toast.success("Exito","La eliminación se hizo correctamente");
    })
  }
}
