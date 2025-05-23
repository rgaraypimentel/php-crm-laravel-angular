import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TransportsService } from '../../service/transports.service';

@Component({
  selector: 'app-edit-detail-transports',
  templateUrl: './edit-detail-transports.component.html',
  styleUrls: ['./edit-detail-transports.component.scss']
})
export class EditDetailTransportsComponent {
  @Input() detail_transport:any;
  units:any = [];
  @Input() index:number = 0;
  @Input() importe:number = 0;
  @Input() is_edit:any = null;
  @Input() warehouse_start_id:any;

  @Output() EditItemTranport: EventEmitter<any> = new EventEmitter();

  search_product:string = '';
  unit_id:string = '';
  price_unit:number = 0;
  total_old:number = 0;
  quantity:number = 0;
  isLoading:any;
  constructor(
    public modal: NgbActiveModal,
    public toast: ToastrService,
    public transportService: TransportsService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.units = this.detail_transport.product.warehouses.filter((warehouse:any) => warehouse.warehouse.id == this.warehouse_start_id);
    this.unit_id = this.detail_transport.unit.id;
    this.price_unit = this.detail_transport.price_unit;
    this.quantity = this.detail_transport.quantity;
    this.total_old = this.detail_transport.total;
  }

  edit(){
    if(!this.unit_id){
      this.toast.error("Validacion","Se necesita seleccionar una unidad");
      return;
    }

    // if(!this.price_unit){
    //   this.toast.error("Validacion","Se necesita digitar un precio");
    //   return;
    // }

    if(!this.quantity){
      this.toast.error("Validacion","Se necesita digitar una cantidad");
      return;
    }
    let UNIT_SELECTED = this.units.find((unit:any) => unit.unit.id == this.unit_id);
    if(UNIT_SELECTED && UNIT_SELECTED.quantity < this.quantity){
      this.toast.error("Validacion","No puedes solicitar esa cantidad, porque no hay stock disponible ("+UNIT_SELECTED.quantity+")");
      return;
    }
    this.detail_transport.unit = UNIT_SELECTED.unit;
    this.detail_transport.price_unit =this.price_unit;
    this.detail_transport.quantity = this.quantity;
    this.detail_transport.total = Number((this.price_unit*this.quantity).toFixed(2));

    if(this.is_edit == 1){
      let NUEVO_IMPORTE = Number( ((this.importe - this.total_old) + Number((this.price_unit*this.quantity).toFixed(2))).toFixed(2));
      let NUEVO_IGV = Number((NUEVO_IMPORTE*0.18).toFixed(2));
      this.detail_transport.total_purchase = NUEVO_IMPORTE+NUEVO_IGV;
      this.detail_transport.importe = NUEVO_IMPORTE;
      this.detail_transport.igv = NUEVO_IGV;

      this.transportService.editTransportDetail(this.detail_transport.id,this.detail_transport).subscribe((resp:any) => {
        this.toast.success("Exito","Se edito el detallado correctamente");
        this.modal.close();
        this.EditItemTranport.emit(resp);
      })
    }else{
      this.modal.close();
      this.EditItemTranport.emit(this.detail_transport);
    }

  }
}
