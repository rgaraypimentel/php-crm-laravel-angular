import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SearchProductsComponent } from '../../proformas/componets/search-products/search-products.component';
import { DeleteItemPurchaseComponent } from '../components/delete-item-purchase/delete-item-purchase.component';
import { EditItemPurchaseComponent } from '../components/edit-item-purchase/edit-item-purchase.component';
import { PurchaseService } from '../service/purchase.service';

@Component({
  selector: 'app-edit-purchase',
  templateUrl: './edit-purchase.component.html',
  styleUrls: ['./edit-purchase.component.scss']
})
export class EditPurchaseComponent {
  full_name_user:string = '';
  sucursal_user:string = '';
  warehouse_id:string = '';
  provider_id:string = '';

  date_emision:any = null;
  type_comprobant:string = '';
  n_comprobant:string = '';
  description:string = '';

  // DETALLADO DE LA COMPRA
  search_product:string = '';
  unit_id:string = '';
  price_unit:number = 0;
  quantity:number = 0;

  importe:number = 0;
  igv:number = 0;
  total:number = 0;

  user:any;

  warehouses:any = [];
  providers:any = [];
  units:any = [];

  isLoading$:any;
  PRODUCT_SELECTED:any;
  PURCHASE_DETAILS:any = [];
  ORDER_PURCHASE_ID:string = '';
  PURCHASE_SELECTED:any = null;
  state:string = '';
  purchase_details:any = [];
  constructor(
    public purchaseService: PurchaseService,
    public toast: ToastrService,
    public modalService: NgbModal,
    public ActivedRoute: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.user = this.purchaseService.authservice.user;
    // this.full_name_user = this.user.full_name;
    // this.sucursal_user = this.user.sucursale_name;
    this.ActivedRoute.params.subscribe((resp:any) => {
      this.ORDER_PURCHASE_ID = resp.id;
    });
    this.showPurchase();
    this.isLoading$ = this.purchaseService.isLoading$;
  }

  showPurchase(){
    this.purchaseService.showPurchase(this.ORDER_PURCHASE_ID).subscribe((resp:any) => {
      console.log(resp);
      this.PURCHASE_SELECTED = resp.purchase;
      this.full_name_user = this.PURCHASE_SELECTED.user.full_name;
      this.sucursal_user = this.PURCHASE_SELECTED.user.sucursale.name;
      this.warehouse_id = this.PURCHASE_SELECTED.warehouse_id;
      this.provider_id = this.PURCHASE_SELECTED.provider_id;
      this.date_emision = this.PURCHASE_SELECTED.date_emision;
      this.type_comprobant = this.PURCHASE_SELECTED.type_comprobant;
      this.n_comprobant = this.PURCHASE_SELECTED.n_comprobant;
      this.description = this.PURCHASE_SELECTED.description;
      this.PURCHASE_DETAILS = this.PURCHASE_SELECTED.details;
      this.importe = this.PURCHASE_SELECTED.importe;
      this.igv = this.PURCHASE_SELECTED.igv;
      this.total = this.PURCHASE_SELECTED.total;
      this.state = this.PURCHASE_SELECTED.state;

      if(this.warehouses.length == 0){
        this.configAll();
      }
    })
  }

  configAll(){
    this.purchaseService.configAll().subscribe((resp:any) => {
      this.warehouses = resp.warehouses;
      this.providers = resp.providers;
      this.units = resp.units;
      this.date_emision = resp.now;
    })
  }

  isLoadingProcess(){
    this.purchaseService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.purchaseService.isLoadingSubject.next(false);
    }, 50);
  }

  listProducts(){
    if(!this.search_product){
      this.toast.error("Validación","Necesitas ingresar al menos uno de los campos");
      return;
    }
    this.purchaseService.searchProducts(this.search_product).subscribe((resp:any) => {
      console.log(resp);
      if(resp.products.data.length > 1){
        this.openSelectedProduct(resp.products.data);
      }else{
        if(resp.products.data.length == 1){
          this.PRODUCT_SELECTED = resp.products.data[0];
          this.search_product = this.PRODUCT_SELECTED.title;
          this.toast.success("Exito","Se selecciono el producto ");
          this.isLoadingProcess();
        }else{
          this.toast.error("Validación","No hay coincidencia en la busqueda");
        }
      }
    })
  }

  openSelectedProduct(products:any = []){
    const modalRef = this.modalService.open(SearchProductsComponent,{size:'lg',centered: true});
    modalRef.componentInstance.products = products

    modalRef.componentInstance.ProductSelected.subscribe((product:any) => {
      this.PRODUCT_SELECTED = product;
      this.search_product = this.PRODUCT_SELECTED.title;
      this.isLoadingProcess();
      this.toast.success("Exito","Se selecciono el producto");
    })
  }

  addDetail(){

    if(!this.PRODUCT_SELECTED){
      this.toast.error("Validacion","Se necesita seleccionar un producto");
      return;
    }
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

    let UNIDAD_SELECTED = this.units.find((unit:any) => unit.id == this.unit_id)
    let NUEVO_IMPORTE = Number( (this.importe + Number((this.price_unit*this.quantity).toFixed(2))).toFixed(2));
    let NUEVO_IGV = Number((NUEVO_IMPORTE*0.18).toFixed(2));
    this.purchaseService.addPurchaseDetail({
      purchase_id: this.ORDER_PURCHASE_ID,
      product: this.PRODUCT_SELECTED,
      unit: UNIDAD_SELECTED,
      price_unit: this.price_unit,
      quantity: this.quantity,
      total: Number((this.price_unit*this.quantity).toFixed(2)),
      total_purchase: NUEVO_IMPORTE+NUEVO_IGV,
      importe: NUEVO_IMPORTE,
      igv: NUEVO_IGV,
    }).subscribe((resp:any) => {
      console.log(resp);
      // this.PURCHASE_DETAILS.push({
      //   product: this.PRODUCT_SELECTED,
      //   unit: UNIDAD_SELECTED,
      //   price_unit: this.price_unit,
      //   quantity: this.quantity,
      //   total: Number((this.price_unit*this.quantity).toFixed(2)),
      // });
      this.toast.success("Exito","Se agrego un nuevo producto a la orden de compra");
      this.PRODUCT_SELECTED = null;
      this.unit_id = '';
      this.price_unit = 0;
      this.quantity = 0;
      this.search_product = '';

      this.PURCHASE_DETAILS.push(resp.purchase_detail);
      this.total = resp.total;
      this.importe = resp.importe;
      this.igv = resp.igv;
    })
  }

  calcTotalPurchase(){
    this.importe = Number(this.PURCHASE_DETAILS.reduce((sum:number,item:any) => sum+ item.total,0).toFixed(2));
    this.igv = Number((this.importe*0.18).toFixed(2));
    this.total = Number((this.importe + this.igv).toFixed(2));
    this.isLoadingProcess();
  }

  editItemPurchase(index:number,detail:any){
    const modalRef = this.modalService.open(EditItemPurchaseComponent,{centered: true,size:'md'});
    modalRef.componentInstance.detail_purchase = detail;
    modalRef.componentInstance.units = this.units;
    modalRef.componentInstance.index = index;
    modalRef.componentInstance.importe = this.importe;
    modalRef.componentInstance.is_edit = 1;

    modalRef.componentInstance.EditItemPurchase.subscribe((resp:any) => {
      this.PURCHASE_DETAILS[index] = resp.purchase_detail;
      this.total = resp.total;
      this.importe = resp.importe;
      this.igv = resp.igv;
      this.isLoadingProcess();
    })
  }

  deleteItemPurchase(index:number,detail:any){
    const modalRef = this.modalService.open(DeleteItemPurchaseComponent,{centered: true,size:'md'});
    modalRef.componentInstance.detail_purchase = detail;
    modalRef.componentInstance.index = index;
    modalRef.componentInstance.importe = this.importe;
    modalRef.componentInstance.is_edit = 1;
    modalRef.componentInstance.purchase_id = this.ORDER_PURCHASE_ID;

    modalRef.componentInstance.DeleteItemPurchase.subscribe((resp:any) => {
      this.PURCHASE_DETAILS.splice(index,1);
      this.isLoadingProcess();
      this.total = resp.total;
      this.importe = resp.importe;
      this.igv = resp.igv;
    })
  }

  editOrderPurchase(){

    if(!this.warehouse_id){
      this.toast.error("Validacion","Necesitas seleccionar un almacen");
      return;
    }

    if(!this.provider_id){
      this.toast.error("Validacion","Necesitas seleccionar un proveedor");
      return;
    }

    if(!this.type_comprobant){
      this.toast.error("Validacion","Necesitas seleccionar un tipo de comprobante");
      return;
    }

    if(!this.n_comprobant){
      this.toast.error("Validacion","Necesitas digitar un n° de comprobante");
      return;
    }
    let data = {
      warehouse_id: this.warehouse_id,
      provider_id: this.provider_id,
      date_emision: this.date_emision,
      type_comprobant: this.type_comprobant,
      n_comprobant: this.n_comprobant,
      description: this.description,
      importe: this.importe,
      igv: this.igv,
      total: this.total,
      state: this.state,
    }

    this.purchaseService.editOrderPurchase(this.ORDER_PURCHASE_ID,data).subscribe((resp:any) => {
      console.log(resp);
      this.toast.success("Exito","La orden de compra se ha editado correctamente");
    },error => {
      console.log(error);
      this.toast.error("ERROR","Hubo un problema en el servidor con tu orden, comunicate con soporte");
    })
  }

  selectedDetail(PURCHASE_DETAIL:any){
    let INDEX = this.purchase_details.findIndex((item:any) => item == (PURCHASE_DETAIL.id));
    if(INDEX != -1){
      this.purchase_details.splice(INDEX,1);
    }else{
      this.purchase_details.push(PURCHASE_DETAIL.id);
    }
    console.log(this.purchase_details);
  }

  procesarEntrega(){
    if(this.purchase_details.length == 0){
      this.toast.error("Validación","Necesitas seleccionar un item para procesar la entrega");
      return;
    }
    let data = {
      purchase_id: this.ORDER_PURCHASE_ID,
      purchase_details: this.purchase_details,
    }
    this.purchaseService.procesoEntrega(data).subscribe((resp:any) => {
      console.log(resp);
      this.toast.success("Exito","El proceso de entrega se dio correctamente");
      this.showPurchase();
    },error => {
      console.log(error);
      this.toast.error("Error","Se detecto un error en la solicitud revise la consola del navegador");
    })
  }
}
