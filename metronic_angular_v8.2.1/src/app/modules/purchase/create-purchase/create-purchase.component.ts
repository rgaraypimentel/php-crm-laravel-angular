import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SearchProductsComponent } from '../../proformas/componets/search-products/search-products.component';
import { DeleteItemPurchaseComponent } from '../components/delete-item-purchase/delete-item-purchase.component';
import { EditItemPurchaseComponent } from '../components/edit-item-purchase/edit-item-purchase.component';
import { PurchaseService } from '../service/purchase.service';

@Component({
  selector: 'app-create-purchase',
  templateUrl: './create-purchase.component.html',
  styleUrls: ['./create-purchase.component.scss']
})
export class CreatePurchaseComponent {
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
  constructor(
    public purchaseService: PurchaseService,
    public toast: ToastrService,
    public modalService: NgbModal,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.user = this.purchaseService.authservice.user;
    this.full_name_user = this.user.full_name;
    this.sucursal_user = this.user.sucursale_name;
    this.configAll();
    this.isLoading$ = this.purchaseService.isLoading$;
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

    this.PURCHASE_DETAILS.push({
      product: this.PRODUCT_SELECTED,
      unit: UNIDAD_SELECTED,
      price_unit: this.price_unit,
      quantity: this.quantity,
      total: Number((this.price_unit*this.quantity).toFixed(2)),
    });

    this.PRODUCT_SELECTED = null;
    this.unit_id = '';
    this.price_unit = 0;
    this.quantity = 0;
    this.search_product = '';
    this.calcTotalPurchase();
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

    modalRef.componentInstance.EditItemPurchase.subscribe((detail_purchase:any) => {
      this.PURCHASE_DETAILS[index] = detail_purchase;
      this.isLoadingProcess();
      setTimeout(() => {
        this.calcTotalPurchase();
      }, 50);
    })
  }

  deleteItemPurchase(index:number,detail:any){
    const modalRef = this.modalService.open(DeleteItemPurchaseComponent,{centered: true,size:'md'});
    modalRef.componentInstance.detail_purchase = detail;
    modalRef.componentInstance.index = index;

    modalRef.componentInstance.DeleteItemPurchase.subscribe((detail_purchase:any) => {
      this.PURCHASE_DETAILS.splice(index,1);
      this.isLoadingProcess();
      setTimeout(() => {
        this.calcTotalPurchase();
      }, 50);
    })
  }

  createOrderPurchase(){

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
    if(this.PURCHASE_DETAILS.length == 0){
      this.toast.error("Validacion","Necesitas agregar al menos un producto al detallado");
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
      details: this.PURCHASE_DETAILS,
    }

    this.purchaseService.createOrderPurchase(data).subscribe((resp:any) => {
      console.log(resp);
      this.toast.success("Exito","La orden de compra se ha generado correctamente");
      this.warehouse_id = '';
      this.provider_id = '';
      this.type_comprobant = '';
      this.n_comprobant = '';
      this.description = '';
      this.importe = 0;
      this.igv = 0;
      this.total = 0;
      this.PURCHASE_DETAILS = [];
      this.calcTotalPurchase();
    },error => {
      console.log(error);
      this.toast.error("ERROR","Hubo un problema en el servidor con tu orden, comunicate con soporte");
    })
  }
}
