import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProductWalletsService } from '../../service/product-wallets.service';

@Component({
  selector: 'app-delete-wallet-price-product',
  templateUrl: './delete-wallet-price-product.component.html',
  styleUrls: ['./delete-wallet-price-product.component.scss']
})
export class DeleteWalletPriceProductComponent {
  @Output() WalletD: EventEmitter<any> = new EventEmitter();
  @Input()  WALLETS_PROD:any;

  isLoading:any;
  constructor(
    public modal: NgbActiveModal,
    public productWalletService: ProductWalletsService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
  }

  delete(){

    this.productWalletService.deleteProductWallet(this.WALLETS_PROD.id).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","El precio del producto se elimino correctamente");
        this.WalletD.emit(resp.message);
        this.modal.close();
      }
    })
  }
}
