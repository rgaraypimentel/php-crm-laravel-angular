import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PurchaseService } from '../../service/purchase.service';

@Component({
  selector: 'app-edit-item-purchase',
  templateUrl: './edit-item-purchase.component.html',
  styleUrls: ['./edit-item-purchase.component.scss']
})
export class EditItemPurchaseComponent {
  @Input() detail_purchase:any;
  @Input() units:any = [];
  @Input() index:number = 0;
  @Input() importe:number = 0;
  @Input() is_edit:any = null;

  @Output() EditItemPurchase: EventEmitter<any> = new EventEmitter();

  search_product:string = '';
  unit_id:string = '';
  price_unit:number = 0;
  total_old:number = 0;
  quantity:number = 0;
  isLoading:any;
  constructor(
    public modal: NgbActiveModal,
    public toast: ToastrService,
    public purchaseService: PurchaseService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.unit_id = this.detail_purchase.unit.id;
    this.price_unit = this.detail_purchase.price_unit;
    this.quantity = this.detail_purchase.quantity;
    this.total_old = this.detail_purchase.total;
  }

  edit(){
    if(!this.unit_id){
      this.toast.error("Validacion","Se necesita seleccionar una unidad");
      return;
    }

    if(!this.price_unit){
      this.toast.error("Validacion","Se necesita digitar un precio");
      return;
    }

    if(!this.quantity){
      this.toast.error("Validacion","Se necesita digitar una cantidad");
      return;
    }
    let UNIT_SELECTED = this.units.find((unit:any) => unit.id == this.unit_id);

    this.detail_purchase.unit = UNIT_SELECTED;
    this.detail_purchase.price_unit =this.price_unit;
    this.detail_purchase.quantity = this.quantity;
    this.detail_purchase.total = Number((this.price_unit*this.quantity).toFixed(2));

    if(this.is_edit == 1){
      let NUEVO_IMPORTE = Number( ((this.importe - this.total_old) + Number((this.price_unit*this.quantity).toFixed(2))).toFixed(2));
      let NUEVO_IGV = Number((NUEVO_IMPORTE*0.18).toFixed(2));
      this.detail_purchase.total_purchase = NUEVO_IMPORTE+NUEVO_IGV;
      this.detail_purchase.importe = NUEVO_IMPORTE;
      this.detail_purchase.igv = NUEVO_IGV;

      this.purchaseService.editPurchaseDetail(this.detail_purchase.id,this.detail_purchase).subscribe((resp:any) => {
        this.toast.success("Exito","Se edito el detallado correctamente");
        this.modal.close();
        this.EditItemPurchase.emit(resp);
      })
    }else{
      this.modal.close();
      this.EditItemPurchase.emit(this.detail_purchase);
    }

  }
}
