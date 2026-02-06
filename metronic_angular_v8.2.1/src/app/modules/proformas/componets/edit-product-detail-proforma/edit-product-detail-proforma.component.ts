import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, debounceTime } from 'rxjs';
import { ProformasService } from '../../service/proformas.service';

@Component({
  selector: 'app-edit-product-detail-proforma',
  templateUrl: './edit-product-detail-proforma.component.html',
  styleUrls: ['./edit-product-detail-proforma.component.scss']
})
export class EditProductDetailProformaComponent {

  @Input() DETAIL_PRODUCT:any;
  @Input() sucursale_asesor:any;
  @Input() CLIENT_SELECTED:any;
  @Input() PROFORMA_ID:any;

  @Output() EditProductProforma: EventEmitter<any> = new EventEmitter();
  price:number = 0;
  description_product:string = '';
  quantity_product:number = 0;
  unidad_product:string = '';
  almacen_product:string = '';
  PRODUCT_SELECTED:any;
  loadUnidad:Boolean = false;
  warehouses_product:any = [];
  exits_warehouse:any = [];
  amount_discount:number = 0;

  source: any;
  @ViewChild("discount") something:ElementRef;

  isLoading$:any;
  constructor(
    public modal: NgbActiveModal,
    public toast: ToastrService,
    public proformaService: ProformasService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.proformaService.isLoading$;
    this.PRODUCT_SELECTED = this.DETAIL_PRODUCT.product;
    this.price = this.DETAIL_PRODUCT.price_unit;
    this.description_product = this.DETAIL_PRODUCT.description;
    this.quantity_product = this.DETAIL_PRODUCT.quantity;
    this.unidad_product = this.DETAIL_PRODUCT.unidad_product;
    this.warehouses_product = this.PRODUCT_SELECTED.warehouses.filter((wareh:any) => wareh.unit.id == this.unidad_product);
    this.exits_warehouse = this.warehouses_product.filter((wareh:any) => wareh.warehouse.sucursale_id == this.sucursale_asesor);
    this.amount_discount = this.DETAIL_PRODUCT.discount;
    setTimeout(() => {
      if(this.PRODUCT_SELECTED.is_discount == 2){
        this.initKeyUpDiscount();
      }
    }, 50);
  }

  initKeyUpDiscount() {
    this.source = fromEvent(this.something.nativeElement, 'keyup');
    this.source.pipe(debounceTime(1200)).subscribe((c:any) =>
        {
          console.log(c);
          this.verifiedDiscount();
          //  this.isLoadingProcess();
        }
    );
  }

  isLoadingProcess(){
  this.proformaService.isLoadingSubject.next(true);
  setTimeout(() => {
    this.proformaService.isLoadingSubject.next(false);
  }, 50);
}

  changeUnitProduct($event:any){
    console.log($event.target.value);
    let UNIT_SELECTED = $event.target.value;
    this.warehouses_product = this.PRODUCT_SELECTED.warehouses.filter((wareh:any) => wareh.unit.id == UNIT_SELECTED);
    this.exits_warehouse = this.warehouses_product.filter((wareh:any) => wareh.warehouse.sucursale_id == this.sucursale_asesor);
    // filtro de precio multiple
    let WALLETS = this.PRODUCT_SELECTED.wallets;
    // las condiciones

    setTimeout(() => {
      this.verifiedDiscount();
    }, 50);
    // 1.- TENEMOS LA BUSQUEDA POR UNIDAD, SUCURSAL Y SEGMENTO DE CLIENTE
    let WALLETS_FILTER = WALLETS.filter((wallet:any) => wallet.unit && wallet.sucursale && wallet.client_segment);
    let PRICE_S = WALLETS_FILTER.find((wallet:any) => wallet.unit.id == UNIT_SELECTED &&
                                              wallet.sucursale.id == this.sucursale_asesor &&
                                            wallet.client_segment.id == this.CLIENT_SELECTED.client_segment.id)
    if(PRICE_S){
      this.price = PRICE_S.price_general;
      return;
    }
    // 2.- ES LA BUSQUEDA POR UNIDAD Y POR SUCURSAL O POR SEGMENTO DE CLIENTE
    WALLETS_FILTER = WALLETS.filter((wallet:any) => wallet.unit && wallet.sucursale && !wallet.client_segment);
    let PRICE_SBA = WALLETS_FILTER.find((wallet:any) => wallet.unit.id == UNIT_SELECTED &&
                                              wallet.sucursale.id == this.sucursale_asesor &&
                                            wallet.client_segment == null);
    WALLETS_FILTER = WALLETS.filter((wallet:any) => wallet.unit && !wallet.sucursale && wallet.client_segment);
    let PRICE_SBB = WALLETS_FILTER.find((wallet:any) => wallet.unit.id == UNIT_SELECTED &&
                                              wallet.sucursale == null &&
                                            wallet.client_segment.id == this.CLIENT_SELECTED.client_segment.id);
    if(PRICE_SBA && PRICE_SBB){
      if(PRICE_SBA.price_general < PRICE_SBB.price_general){
        this.price = PRICE_SBA.price_general;
      }else{
        this.price = PRICE_SBB.price_general;
      }
      return;
    }
    if(PRICE_SBA){
      this.price = PRICE_SBA.price_general;
      return;
    }
    if(PRICE_SBB){
      this.price = PRICE_SBB.price_general;
      return;
    }
    // 3.- ES LA BUSQUEDA POR UNIDAD, NADA MAS.
    let PRICE_ST = WALLETS.find((wallet:any) => wallet.unit.id == UNIT_SELECTED &&
                                              wallet.sucursale == null &&
                                            wallet.client_segment == null);
    if(PRICE_ST){
      this.price = PRICE_ST.price_general;
      return;
    }
    // ENTONCES SE LE ASIGNARA EL PRECIO BASE DEL PRODUCTO
    this.price = this.PRODUCT_SELECTED.price_general;
  }

  verifiedDiscount(){
    console.log(this.amount_discount);
    let DISCOUNT_MAX_REAL = (this.PRODUCT_SELECTED.max_discount*0.01)*this.price;
    if(this.amount_discount > DISCOUNT_MAX_REAL){
      this.toast.error("VALIDACIÓN","EL DESCUENTO SUPERA EL MONTO QUE TIENE CONFIGURADO");
      this.amount_discount = 0;
      return;
    }
    let DISCOUNT_MIN_REAL = (this.PRODUCT_SELECTED.min_discount*0.01)*this.price;
    if(this.amount_discount < DISCOUNT_MIN_REAL){
      this.toast.error("VALIDACIÓN","EL DESCUENTO NO SUPERA EL MONTO QUE TIENE CONFIGURADO");
      this.amount_discount = 0;
      return;
    }
  }

  edit(){

    let SUBTOTAL = this.price-this.amount_discount;
    let IMPUESTO = SUBTOTAL * (this.PRODUCT_SELECTED.importe_iva*0.01);
    let UNIDAD = this.PRODUCT_SELECTED.units.find((item:any) => item.id == this.unidad_product);

    this.DETAIL_PRODUCT.quantity = this.quantity_product;
    this.DETAIL_PRODUCT.UNIDAD = UNIDAD;
    this.DETAIL_PRODUCT.unidad_product = this.unidad_product;
    this.DETAIL_PRODUCT.impuesto = IMPUESTO;
    this.DETAIL_PRODUCT.description = this.description_product;
    this.DETAIL_PRODUCT.discount = this.amount_discount;
    this.DETAIL_PRODUCT.subtotal = SUBTOTAL
    this.DETAIL_PRODUCT.total = (SUBTOTAL + IMPUESTO)*this.quantity_product;
    if(this.PROFORMA_ID){
      // YO ENVIO AL BACKEND
      this.proformaService.editDetailProforma(this.DETAIL_PRODUCT.id,this.DETAIL_PRODUCT).subscribe((resp:any) => {
        console.log(resp);
        this.EditProductProforma.emit(resp);
        this.modal.close();
      })
    }else{
      this.EditProductProforma.emit(this.DETAIL_PRODUCT);
      this.modal.close();
    }
  }
}
