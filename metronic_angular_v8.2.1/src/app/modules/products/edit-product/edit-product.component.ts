import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from '../service/products.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductWarehousesService } from '../service/product-warehouses.service';
import { ProductWalletsService } from '../service/product-wallets.service';
import { EditWarehouseProductComponent } from '../warehouse/edit-warehouse-product/edit-warehouse-product.component';
import { DeleteWarehouseProductComponent } from '../warehouse/delete-warehouse-product/delete-warehouse-product.component';
import { DeleteWalletPriceProductComponent } from '../wallet/delete-wallet-price-product/delete-wallet-price-product.component';
import { EditWalletPriceProductComponent } from '../wallet/edit-wallet-price-product/edit-wallet-price-product.component';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent {
  is_discount:number = 1;
  tab_selected:number = 1;

  title:string = '';
  imagen_product:any;
  imagen_previzualiza:any = 'assets/media/svg/files/blank-image.svg';
  description:string = '';
  price_general:number = 0;
  disponibilidad:string = '';
  tiempo_de_abastecimiento:number = 0;
  min_discount:number = 0;
  max_discount:number = 0;
  tax_selected:string = '1';
  importe_iva:number = 0;
  product_categorie_id:string = '';
  state:string = '1';
  sku:string = '';
  is_gift:number = 1;
  umbral:number = 0;
  umbral_unit_id:string = '';
  provider_id:string = '';

  weight:number = 0;
  width:number = 0;
  height:number = 0;
  length:number = 0;

  key_v:string = '';
  value_v:string = '';

  isLoading$:any;

  PROVIDERS:any = [];
  // SECTION WAREHOUSES
  almacen_warehouse:string = '';
  unit_warehouse:string = '';
  quantity_warehouse:number = 0;
  // LISTA DE EXISTENCIAS DEL PRODUCTO , DANDO UN ALMACEN Y UNA UNIDAD
  WAREHOUSES_PRODUCT:any = [];
  // SECTION PRICE MULTIPLES
  unit_price_multiple:string = '';
  sucursale_price_multiple:string = '';
  client_segment_price_multiple:string = '';
  quantity_price_multiple:number = 0;
  WALLETS_PRODUCT:any = [];

  WAREHOUSES:any = [];
  SUCURSALES:any = [];
  UNITS:any = [];
  CLIENT_SEGMENTS:any = [];
  CATEGORIES:any = [];

  PRODUCT_ID:string = '';
  PRODUCT_SELECTED:any = null;
  ESPECIFICACIONES:any = [];
  constructor(
    public toast:ToastrService,
    public productService: ProductsService,
    public ActivedRoute: ActivatedRoute,
    public productWarehouseService: ProductWarehousesService,
    public productWalletService: ProductWalletsService,
    public modalService: NgbModal,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.ActivedRoute.params.subscribe((resp:any) => {
      console.log(resp);
      this.PRODUCT_ID = resp.id;
    })
    this.isLoading$ = this.productService.isLoading$;

    this.productService.showProduct(this.PRODUCT_ID).subscribe((resp:any) => {
      console.log(resp);
      this.PRODUCT_SELECTED = resp.product;

      this.title = this.PRODUCT_SELECTED.title;
      this.is_discount = this.PRODUCT_SELECTED.is_discount;
      this.imagen_previzualiza = this.PRODUCT_SELECTED.imagen;
      this.description = this.PRODUCT_SELECTED.description;
      this.price_general = this.PRODUCT_SELECTED.price_general;
      this.disponibilidad = this.PRODUCT_SELECTED.disponibilidad;
      this.tiempo_de_abastecimiento = this.PRODUCT_SELECTED.tiempo_de_abastecimiento;
      this.min_discount = this.PRODUCT_SELECTED.min_discount;
      this.max_discount = this.PRODUCT_SELECTED.max_discount;
      this.tax_selected = this.PRODUCT_SELECTED.tax_selected;
      this.importe_iva = this.PRODUCT_SELECTED.importe_iva;
      this.product_categorie_id = this.PRODUCT_SELECTED.product_categorie_id;
      this.state = this.PRODUCT_SELECTED.state;
      this.sku = this.PRODUCT_SELECTED.sku;
      this.is_gift = this.PRODUCT_SELECTED.is_gift;
      this.umbral = this.PRODUCT_SELECTED.umbral;
      this.umbral_unit_id = this.PRODUCT_SELECTED.umbral_unit_id;
      this.weight = this.PRODUCT_SELECTED.weight;
      this.width = this.PRODUCT_SELECTED.width;
      this.height = this.PRODUCT_SELECTED.height;
      this.length = this.PRODUCT_SELECTED.length;

      this.provider_id  = this.PRODUCT_SELECTED.provider_id;
      this.ESPECIFICACIONES = this.PRODUCT_SELECTED.specifications;

      this.WAREHOUSES_PRODUCT = this.PRODUCT_SELECTED.warehouses;
      this.WALLETS_PRODUCT = this.PRODUCT_SELECTED.wallets;
    })

    this.productService.configAll().subscribe((resp:any) => {
      console.log(resp);
      this.WAREHOUSES = resp.almacens;
      this.SUCURSALES = resp.sucursales;
      this.UNITS = resp.units;
      this.CLIENT_SEGMENTS = resp.segments_clients;
      this.CATEGORIES = resp.categories;
      this.PROVIDERS = resp.providers;
    })
  }

  addWarehouse(){
    if(!this.almacen_warehouse ||
      ! this.unit_warehouse  ||
      ! this.quantity_warehouse
    ){
      this.toast.error("VALIDACIÓN","Necesitas seleccionar un almacen y una unidad, aparte de colocar una cantidad");
      return;
    }

    let UNIT_SELECTED = this.UNITS.find((unit:any) => unit.id == this.unit_warehouse);
    let WAREHOUSE_SELECTED = this.WAREHOUSES.find((wareh:any) => wareh.id == this.almacen_warehouse);


    let INDEX_WAREHOUSE = this.WAREHOUSES_PRODUCT.findIndex((wh_prod:any) => (wh_prod.unit.id == this.unit_warehouse)
                                                                              && (wh_prod.warehouse.id == this.almacen_warehouse));

    if(INDEX_WAREHOUSE != -1){
      this.toast.error("VALIDACIÓN","La existencia de ese producto con el almacen y la unidad ya existe");
      return;
    }
    let data = {
      product_id: this.PRODUCT_ID,
      unit_id: this.unit_warehouse,
      warehouse_id: this.almacen_warehouse,
      quantity : this.quantity_warehouse,
    }
    this.productWarehouseService.registerProductWarehouse(data).subscribe((resp:any) => {
      this.WAREHOUSES_PRODUCT.push(resp.product_warehouse);
      this.almacen_warehouse = ''
      this.unit_warehouse = ''
      this.quantity_warehouse = 0
      this.toast.success("EXITO","La existencia de este producto se agrego correctamente");
      this.isLoadingProcess();
      // {
      //   unit: UNIT_SELECTED,
      //   warehouse: WAREHOUSE_SELECTED,
      //   quantity: this.quantity_warehouse,
      // }
    })
    console.log(this.WAREHOUSES_PRODUCT);
  }

  editWarehouse(WAREHOUSES_PROD:any){
    const modalRef = this.modalService.open(EditWarehouseProductComponent,{centered:true, size: 'lg'});
    modalRef.componentInstance.WAREHOUSES_PROD = WAREHOUSES_PROD;
    modalRef.componentInstance.UNITS = this.UNITS;
    modalRef.componentInstance.WAREHOUSES = this.WAREHOUSES;

    modalRef.componentInstance.WarehouseE.subscribe((wh_product:any) => {
      let INDEX = this.WAREHOUSES_PRODUCT.findIndex((wh_prod:any) => wh_prod.id == WAREHOUSES_PROD.id);
      if(INDEX != -1){
        this.WAREHOUSES_PRODUCT[INDEX] = wh_product;
      }
      this.isLoadingProcess();
    })
  }

  removeWarehouse(WAREHOUSES_PROD:any){

    const modalRef = this.modalService.open(DeleteWarehouseProductComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.WAREHOUSES_PROD = WAREHOUSES_PROD;

    modalRef.componentInstance.WarehouseD.subscribe((wh_product:any) => {
      let INDEX = this.WAREHOUSES_PRODUCT.findIndex((wh_prod:any) => wh_prod.id == WAREHOUSES_PROD.id);
      if(INDEX != -1){
        this.WAREHOUSES_PRODUCT.splice(INDEX,1);
      }
      this.isLoadingProcess();
      // this.ROLES.unshift(role);
    })

    // EL OBJETO QUE QUIERO ELIMINAR
    // LA LISTA DONDE SE ENCUENTRA EL OBJECTO QUE QUIERO ELIMINAR
    //  OBTENER LA POSICIÓN DEL ELEMENTO A ELIMINAR
  }

  addPriceMultiple(){
    if(!this.unit_price_multiple ||
      ! this.quantity_price_multiple
    ){
      this.toast.error("VALIDACIÓN","Necesitas seleccionar una unidad, aparte de colocar un precio");
      return;
    }
    // unit_price_multiple
    // sucursale_price_multiple
    // client_segment_price_multiple
    // quantity_price_multiple
    let UNIT_SELECTED = this.UNITS.find((unit:any) => unit.id == this.unit_price_multiple);
    let SUCURSALE_SELECTED = this.SUCURSALES.find((sucurs:any) => sucurs.id == this.sucursale_price_multiple);
    let CLIENT_SEGMENT_SELECTED = this.CLIENT_SEGMENTS.find((clisg:any) => clisg.id == this.client_segment_price_multiple);

    let INDEX_PRICE_MULTIPLE = this.WALLETS_PRODUCT.findIndex((wh_prod:any) =>
                          (wh_prod.unit.id == this.unit_price_multiple)
                          && (wh_prod.sucursale_price_multiple == this.sucursale_price_multiple)
                          && (wh_prod.client_segment_price_multiple == this.client_segment_price_multiple));

    if(INDEX_PRICE_MULTIPLE != -1){
      this.toast.error("VALIDACIÓN","El precio de ese producto con la sucursal y unidad ya existe");
      return;
    }
    let data = {
      product_id: this.PRODUCT_ID,
      unit_id: this.unit_price_multiple,
      client_segment_id: this.client_segment_price_multiple,
      sucursale_id: this.sucursale_price_multiple,
      price_general: this.quantity_price_multiple,
    }
    this.productWalletService.registerProductWallet(data).subscribe((resp:any) => {
      console.log(resp);
      this.WALLETS_PRODUCT.push(resp.product_wallet);
      this.quantity_price_multiple = 0;
      this.sucursale_price_multiple = ''
      this.client_segment_price_multiple = '';
      this.unit_price_multiple = '';
      this.toast.success("EXITO","El precio de este producto se agrego correctamente");
      this.isLoadingProcess();
      // {
      //   unit: UNIT_SELECTED,
      //   sucursale: SUCURSALE_SELECTED,
      //   client_segment: CLIENT_SEGMENT_SELECTED,
      //   price_general: this.quantity_price_multiple,
      //   sucursale_price_multiple: this.sucursale_price_multiple,
      //   client_segment_price_multiple: this.client_segment_price_multiple,
      // }
    })

    console.log(this.WALLETS_PRODUCT);
  }

  editProductWallet(WALLETS_PROD:any){
    const modalRef = this.modalService.open(EditWalletPriceProductComponent,{centered:true, size: 'lg'});
    modalRef.componentInstance.WALLETS_PROD = WALLETS_PROD;
    modalRef.componentInstance.UNITS = this.UNITS;
    modalRef.componentInstance.SUCURSALES = this.SUCURSALES;
    modalRef.componentInstance.CLIENT_SEGMENTS = this.CLIENT_SEGMENTS;

    modalRef.componentInstance.WalletE.subscribe((wll_product:any) => {
      let INDEX = this.WALLETS_PRODUCT.findIndex((wll_prod:any) => wll_prod.id == WALLETS_PROD.id);
      if(INDEX != -1){
        this.WALLETS_PRODUCT[INDEX] = wll_product;
      }
      this.isLoadingProcess();
    })
  }

  removePriceMultiple(WALLETS_PROD:any){

    const modalRef = this.modalService.open(DeleteWalletPriceProductComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.WALLETS_PROD = WALLETS_PROD;

    modalRef.componentInstance.WalletD.subscribe((wll_product:any) => {
      let INDEX = this.WALLETS_PRODUCT.findIndex((wll_prod:any) => wll_prod.id == WALLETS_PROD.id);
      if(INDEX != -1){
        this.WALLETS_PRODUCT.splice(INDEX,1);
      }
      this.isLoadingProcess();
      // this.ROLES.unshift(role);
    })
    // EL OBJETO QUE QUIERO ELIMINAR
    // LA LISTA DONDE SE ENCUENTRA EL OBJECTO QUE QUIERO ELIMINAR
    //  OBTENER LA POSICIÓN DEL ELEMENTO A ELIMINAR
    // let INDEX_WAREHOUSE = this.WALLETS_PRODUCT.findIndex((wh_prod:any) =>
    //   (wh_prod.unit.id == WALLETS_PROD.unit.id)
    //   && (wh_prod.sucursale_price_multiple == WALLETS_PROD.sucursale_price_multiple)
    //   && (wh_prod.client_segment_price_multiple == WALLETS_PROD.client_segment_price_multiple));
    // //  LA ELIMINACIÓN DEL OBJECTO
    // if(INDEX_WAREHOUSE != -1){
    //   this.WALLETS_PRODUCT.splice(INDEX_WAREHOUSE,1);
    // }
  }

  addEspecif(){
    if(!this.key_v ||
      ! this.value_v
    ){
      this.toast.error("VALIDACIÓN","Necesitas digitar una propiedad y un valor");
      return;
    }
    this.ESPECIFICACIONES.unshift({
      key_v: this.key_v,
      value_v: this.value_v,
    });
    this.key_v = '';
    this.value_v = '';
  }
  removeEspecif(i:number){
    this.ESPECIFICACIONES.splice(i,1);
  }
  isLoadingProcess(){
    this.productService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.productService.isLoadingSubject.next(false);
    }, 50);
  }

  processFile($event:any){
    if($event.target.files[0].type.indexOf("image") < 0){
      this.toast.warning("WARN","El archivo no es una imagen");
      return;
    }
    this.imagen_product = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.imagen_product);
    reader.onloadend = () => this.imagen_previzualiza = reader.result;
    this.isLoadingProcess();
  }

  isGift(){
    this.is_gift = this.is_gift == 1 ? 2 : 1;
    console.log(this.is_gift);
  }

  selectedDiscount(val:number){
    this.is_discount = val;
  }

  selectedTab(val:number){
    this.tab_selected = val;
  }

  store() {

    if(!this.title ||
      !this.description ||
      !this.price_general ||
      !this.product_categorie_id ||
      !this.sku ||
      !this.tax_selected ||
      // !this.importe_iva ||
      !this.weight  ||
      !this.width  ||
      !this.height  ||
      !this.length
    ){
      this.toast.error("VALIDACIÓN","Necesitas llenar todos los campos obligatorios");
      return;
    }

  //  if(this.WAREHOUSES_PRODUCT.length == 0){
  //   this.toast.error("VALIDACIÓN","Necesitas ingresar al menos un registro de existencia de producto");
  //     return;
  //  }
  //  if(this.WALLETS_PRODUCT.length == 0){
  //   this.toast.error("VALIDACIÓN","Necesitas ingresar al menos un listado de precio al producto");
  //     return;
  //  }

    let formData = new FormData();
    formData.append("title",this.title);
    formData.append("description",this.description);
    formData.append("state",this.state);
    formData.append("product_categorie_id",this.product_categorie_id);
    if(this.imagen_product){
      formData.append("product_imagen",this.imagen_product)
    }
    formData.append("price_general",this.price_general+"");
    formData.append("disponibilidad",this.disponibilidad+"");
    formData.append("tiempo_de_abastecimiento",this.tiempo_de_abastecimiento+"");
    formData.append("is_discount",this.is_discount+"");//NUEVO
    formData.append("min_discount",this.min_discount+"");
    formData.append("max_discount",this.max_discount+"");
    formData.append("tax_selected",this.tax_selected+"");//NUEVO
    formData.append("importe_iva",this.importe_iva+"");//NUEVO

    formData.append("sku",this.sku+"");
    formData.append("is_gift",this.is_gift+"");

    formData.append("weight",this.weight+"");//NUEVO
    formData.append("width",this.width+"");//NUEVO
    formData.append("height",this.height+"");//NUEVO
    formData.append("length",this.length+"");//NUEVO

    formData.append("umbral",this.umbral+"");
    formData.append("umbral_unit_id",this.umbral_unit_id);

    formData.append("provider_id",this.provider_id);

    formData.append("specifications",JSON.stringify(this.ESPECIFICACIONES));

    // formData.append("WAREHOUSES_PRODUCT",JSON.stringify(this.WAREHOUSES_PRODUCT));
    // formData.append("WALLETS_PRODUCT",JSON.stringify(this.WALLETS_PRODUCT));


    this.productService.updateProduct(this.PRODUCT_ID,formData).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 200){
        this.toast.success("EXITO","El producto se edito correctamente");
      }else{
        this.toast.warning("VALIDACIÓN",resp.message_text);
      }
    })
  }
}
