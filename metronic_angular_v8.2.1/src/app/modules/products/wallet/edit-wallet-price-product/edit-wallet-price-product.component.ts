import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProductWalletsService } from '../../service/product-wallets.service';

@Component({
  selector: 'app-edit-wallet-price-product',
  templateUrl: './edit-wallet-price-product.component.html',
  styleUrls: ['./edit-wallet-price-product.component.scss']
})
export class EditWalletPriceProductComponent {
  @Output() WalletE: EventEmitter<any> = new EventEmitter();
  @Input() WALLETS_PROD:any;

  @Input() UNITS:any = [];
  @Input() SUCURSALES:any = [];
  @Input() CLIENT_SEGMENTS:any = [];

  isLoading:any;

  unit_price_multiple:string = '';
  sucursale_price_multiple:string = '';
  client_segment_price_multiple:string = '';
  quantity_price_multiple:number = 0;

  constructor(
    public modal: NgbActiveModal,
    public productWalletService: ProductWalletsService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.unit_price_multiple = this.WALLETS_PROD.unit.id
    this.sucursale_price_multiple = this.WALLETS_PROD.sucursale ? this.WALLETS_PROD.sucursale.id : '';
    this.client_segment_price_multiple = this.WALLETS_PROD.client_segment ? this.WALLETS_PROD.client_segment.id : '';
    this.quantity_price_multiple = this.WALLETS_PROD.price_general;
  }

  store(){

    let data = {
      unit_id: this.unit_price_multiple,
      client_segment_id: this.client_segment_price_multiple,
      sucursale_id: this.sucursale_price_multiple,
      price_general: this.quantity_price_multiple
    }

    this.productWalletService.updateProductWallet(this.WALLETS_PROD.id,data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","El precio del producto ha sido editada correctamente");
        this.WalletE.emit(resp.product_wallet);
        this.modal.close();
      }
    })
  }
}
