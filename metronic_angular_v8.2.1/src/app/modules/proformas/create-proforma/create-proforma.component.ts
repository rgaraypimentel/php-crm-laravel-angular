import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, debounceTime } from 'rxjs';
import { UBIGEO_DISTRITOS } from 'src/app/config/ubigeo_distritos';
import { UBIGEO_PROVINCIA } from 'src/app/config/ubigeo_provincias';
import { UBIGEO_REGIONES } from 'src/app/config/ubigeo_regiones';
import { CreateClientsCompanyComponent } from '../../clients/create-clients-company/create-clients-company.component';
import { CreateClientsPersonComponent } from '../../clients/create-clients-person/create-clients-person.component';
import { DeleteProductDetailProformaComponent } from '../componets/delete-product-detail-proforma/delete-product-detail-proforma.component';
import { EditProductDetailProformaComponent } from '../componets/edit-product-detail-proforma/edit-product-detail-proforma.component';
import { SearchClientsComponent } from '../componets/search-clients/search-clients.component';
import { SearchProductsComponent } from '../componets/search-products/search-products.component';
import { ProformasService } from '../service/proformas.service';

@Component({
  selector: 'app-create-proforma',
  templateUrl: './create-proforma.component.html',
  styleUrls: ['./create-proforma.component.scss']
})
export class CreateProformaComponent {
  CLIENT_SELECTED:any;
  n_document:string = ''
  full_name:string = ''
  phone:string = ''

  search_product:string = '';

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

  DETAIL_PROFORMAS:any = [];
  description:string = '';

  agencia:string = '';
  full_name_encargado:string = '';
  documento_encargado:string = '';
  telefono_encargado:string = '';


  REGIONES:any = UBIGEO_REGIONES;
  PROVINCIAS:any = UBIGEO_PROVINCIA;
  DISTRITOS:any = UBIGEO_DISTRITOS;
  PROVINCIA_SELECTEDS:any = [];
  DISTRITO_SELECTEDS:any = [];
  ubigeo_region:string = '';
  ubigeo_provincia:string = '';
  ubigeo_distrito:string = '';
  region:string = '';
  provincia:string = '';
  distrito:string = '';

  sucursale_deliverie_id:any = '';
  address:string = '';
  date_entrega:any = null;

  isLoading$:any;
  client_segments:any = [];
  asesores:any = [];
  sucursale_deliveries:any = [];
  method_payments:any = [];
  user:any;
  sucursale_asesor:string = '';

  method_payment_id:any = '';
  METHOD_PAYMENT_SELECTED:any;
  banco_id:any = '';
  amount_payment:number = 0;

  payment_file:any;
  imagen_previzualiza:any = '';
  message_disponibilidad:any = null;

  TOTAL_PROFORMA:number = 0;
  TOTAL_IMPUESTO_PROFORMA:number = 0;
  DEBT_PROFORMA:number = 0;
  PAID_OUT_PROFORMA:number = 0;

  is_gift:number = 1;
  TODAY:string = 'Y/m/d';
  eval_disponibilidad:boolean = true;

  source: any;
  @ViewChild("discount") something:ElementRef;
  constructor(
    public modalService: NgbModal,
    public proformaService: ProformasService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.proformaService.isLoading$;
    this.user = this.proformaService.authservice.user;
    this.sucursale_asesor = this.user.sucursale_id;
    this.proformaService.configAll().subscribe((resp:any) => {
      console.log(resp);
      this.client_segments = resp.client_segments;
      this.asesores = resp.asesores;
      this.sucursale_deliveries = resp.sucursale_deliveries;
      this.method_payments  = resp.method_payments;
      this.TODAY = resp.today;
      // this.isLoadingProcess();
    })
  }

  initKeyUpDiscount() {
    this.source = fromEvent(this.something.nativeElement, 'keyup');
    this.source.pipe(debounceTime(1200)).subscribe((c:any) =>
        {
          console.log(c);
          this.verifiedDiscount();
          this.isLoadingProcess();
        }
    );
  }

  isLoadingProcess(){
    this.proformaService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.proformaService.isLoadingSubject.next(false);
    }, 50);
  }

  searchClients(){
    if(!this.n_document && !this.full_name && !this.phone){
      this.toast.error("Validación","Necesitas ingresar al menos uno de los campos");
      return;
    }
    this.proformaService.searchClients(this.n_document,this.full_name,this.phone).subscribe((resp:any) => {
      console.log(resp);
      if(resp.clients.length > 1){
        this.openSelectedClients(resp.clients);
      }else{
        if(resp.clients.length == 1){
          this.CLIENT_SELECTED = resp.clients[0];
          this.n_document = this.CLIENT_SELECTED.n_document;
          this.full_name = this.CLIENT_SELECTED.full_name;
          this.phone = this.CLIENT_SELECTED.phone;
          this.toast.success("Exito","Se selecciono al cliente de la proforma");
          this.isLoadingProcess();
        }else{
          this.toast.error("Validación","No hay coincidencia en la busqueda");
        }
      }
    })
  }
  openSelectedClients(clients:any = []){
    const modalRef = this.modalService.open(SearchClientsComponent,{size:'lg',centered: true});
    modalRef.componentInstance.clients = clients

    modalRef.componentInstance.ClientSelected.subscribe((client:any) => {
      this.CLIENT_SELECTED = client;
      this.n_document = this.CLIENT_SELECTED.n_document;
      this.full_name = this.CLIENT_SELECTED.full_name;
      this.phone = this.CLIENT_SELECTED.phone;
      this.isLoadingProcess();
      this.toast.success("Exito","Se selecciono al cliente de la proforma");
    })
  }
  createClientPerson(){
    const modalRef = this.modalService.open(CreateClientsPersonComponent,{size:'lg',centered: true});
    modalRef.componentInstance.client_segments = this.client_segments;
    modalRef.componentInstance.asesores = this.asesores;

    modalRef.componentInstance.ClientsC.subscribe((client:any) => {
      this.CLIENT_SELECTED = client;
      this.n_document = this.CLIENT_SELECTED.n_document;
      this.full_name = this.CLIENT_SELECTED.full_name;
      this.phone =  this.CLIENT_SELECTED.phone;
      this.isLoadingProcess();
    })
  }
  createClientCompany(){
    const modalRef = this.modalService.open(CreateClientsCompanyComponent,{size:'lg',centered: true});
    modalRef.componentInstance.client_segments = this.client_segments;
    modalRef.componentInstance.asesores = this.asesores;
    modalRef.componentInstance.ClientsC.subscribe((client:any) => {
      this.CLIENT_SELECTED = client;
      this.n_document = this.CLIENT_SELECTED.n_document;
      this.full_name = this.CLIENT_SELECTED.full_name;
      this.phone =  this.CLIENT_SELECTED.phone;
      this.isLoadingProcess();
    })
  }
  resetClient(){
    this.CLIENT_SELECTED = null;
    this.n_document = '';
    this.full_name = '';
    this.phone = '';
    this.isLoadingProcess();
  }

  searchProducts(){
    if(!this.search_product){
      this.toast.error("Validación","Necesitas ingresar al menos uno de los campos");
      return;
    }
    this.proformaService.searchProducts(this.search_product).subscribe((resp:any) => {
      console.log(resp);
      if(resp.products.data.length > 1){
        this.openSelectedProduct(resp.products.data);
      }else{
        if(resp.products.data.length == 1){
          this.PRODUCT_SELECTED = resp.products.data[0];
          this.search_product = this.PRODUCT_SELECTED.title;
          setTimeout(() => {
            this.initKeyUpDiscount();
          }, 50);
          this.toast.success("Exito","Se selecciono al producto para la proforma");
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
      setTimeout(() => {
        this.initKeyUpDiscount();
      }, 50);
      this.isLoadingProcess();
      this.toast.success("Exito","Se selecciono el producto para la proforma");
    })
  }
  changeUnitProduct($event:any){
    console.log($event.target.value);
    if(!this.CLIENT_SELECTED){
      this.loadUnidad = true;
      this.unidad_product = '';
      setTimeout(() => {
        this.loadUnidad = false;
      }, 50);
      this.toast.error("Validación","Es necesario seleccionar a un cliente");
      this.isLoadingProcess();
      return;
    }
    let UNIT_SELECTED = $event.target.value;
    this.warehouses_product = this.PRODUCT_SELECTED.warehouses.filter((wareh:any) => wareh.unit.id == UNIT_SELECTED);
    this.exits_warehouse = this.warehouses_product.filter((wareh:any) => wareh.warehouse.sucursale_id == this.sucursale_asesor);
    // filtro de precio multiple
    let WALLETS = this.PRODUCT_SELECTED.wallets;
    // las condiciones

    // 1.- TENEMOS LA BUSQUEDA POR UNIDAD, SUCURSAL Y SEGMENTO DE CLIENTE
    let WALLETS_FILTER = WALLETS.filter((wallet:any) => wallet.unit && wallet.sucursale && wallet.client_segment);
    let PRICE_S = WALLETS_FILTER.find((wallet:any) => wallet.unit.id == UNIT_SELECTED &&
                                              wallet.sucursale.id == this.sucursale_asesor &&
                                            wallet.client_segment.id == this.CLIENT_SELECTED.client_segment.id)
    if(PRICE_S){
      this.price = PRICE_S.price_general;
      if(this.is_gift == 2){
        this.price = 0;
      }
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
      if(this.is_gift == 2){
        this.price = 0;
      }
      return;
    }
    if(PRICE_SBA){
      this.price = PRICE_SBA.price_general;
      if(this.is_gift == 2){
        this.price = 0;
      }
      return;
    }
    if(PRICE_SBB){
      this.price = PRICE_SBB.price_general;
      if(this.is_gift == 2){
        this.price = 0;
      }
      return;
    }
    // 3.- ES LA BUSQUEDA POR UNIDAD, NADA MAS.
    let PRICE_ST = WALLETS.find((wallet:any) => wallet.unit.id == UNIT_SELECTED &&
                                              wallet.sucursale == null &&
                                            wallet.client_segment == null);
    if(PRICE_ST){
      this.price = PRICE_ST.price_general;
      if(this.is_gift == 2){
        this.price = 0;
      }
      return;
    }
    // ENTONCES SE LE ASIGNARA EL PRECIO BASE DEL PRODUCTO
    this.price = this.PRODUCT_SELECTED.price_general;
    if(this.is_gift == 2){
      this.price = 0;
    }
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
  isGift(){
    this.is_gift = this.is_gift == 1 ? 2 : 1;
    if(this.is_gift == 2){
      this.price = 0;
    }
  }
  addProduct(){
    if(!this.PRODUCT_SELECTED){
      this.toast.error("Validación","No hay seleccionado un producto");
      return;
    }
    if(this.is_gift == 1 && this.price == 0){
      this.toast.error("Validación","No hay precio del producto");
      return;
    }
    if(this.quantity_product == 0){
      this.toast.error("Validación","No hay cantidad solicitada del producto");
      return;
    }
    if(!this.unidad_product){
      this.toast.error("Validación","No hay unidad del producto");
      return;
    }
    if(this.PRODUCT_SELECTED && this.PRODUCT_SELECTED.disponibilidad == 2){
      if(
        (this.unidad_product && this.warehouses_product.length == 0) ||
        (this.unidad_product && this.warehouses_product.length > 0 && this.exits_warehouse.length == 0)
      ){
        this.toast.error("Validación","El producto no se puede agregar debido a que no hay exitencias disponibles");
        return;
      }
    }
    if(this.PRODUCT_SELECTED.disponibilidad == 3 && this.eval_disponibilidad){
      this.proformaService.evalDisponibilidad(this.PRODUCT_SELECTED.id,this.unidad_product,this.quantity_product).subscribe((resp:any) => {
        console.log(resp);
        this.message_disponibilidad = resp.message;
        this.eval_disponibilidad = false;
        // this.addProduct();
      })
      return;
    }
    let SUBTOTAL = this.price-this.amount_discount;
    let IMPUESTO = SUBTOTAL * (this.PRODUCT_SELECTED.importe_iva*0.01);
    let UNIDAD = this.PRODUCT_SELECTED.units.find((item:any) => item.id == this.unidad_product);
    this.DETAIL_PROFORMAS.push({
      product: this.PRODUCT_SELECTED,
      description: this.description_product,
      unidad_product: this.unidad_product,
      unit: UNIDAD,
      quantity: this.quantity_product,
      discount: this.amount_discount,
      price_unit: this.price,
      subtotal: SUBTOTAL,
      impuesto: IMPUESTO,
      total:(SUBTOTAL + IMPUESTO)*this.quantity_product,
    })
    this.resetProduct();
    this.sumTotalDetail();
  }

  resetProduct(){
    this.PRODUCT_SELECTED = null;
    this.search_product = '';
    this.price = 0;
    this.quantity_product = 0;
    this.warehouses_product = [];
    this.amount_discount = 0;
    this.description_product = '';
    this.unidad_product = '';
    this.almacen_product = '';
    this.is_gift = 1;
    this.message_disponibilidad = '';
    this.eval_disponibilidad = true;
  }

  sumTotalDetail(){
    this.TOTAL_PROFORMA = this.DETAIL_PROFORMAS.reduce((sum:number,current:any) => sum + current.total,0);
    this.TOTAL_IMPUESTO_PROFORMA = this.DETAIL_PROFORMAS.reduce((sum:number,current:any) => sum + current.impuesto,0);
    this.DEBT_PROFORMA = this.TOTAL_PROFORMA;
    this.isLoadingProcess();
  }

  editProduct(DETAIL_PROFOR:any,INDEX:number){
    const modalRef = this.modalService.open(EditProductDetailProformaComponent,{size: 'md',centered:true});
    modalRef.componentInstance.DETAIL_PRODUCT = DETAIL_PROFOR;
    modalRef.componentInstance.sucursale_asesor = this.sucursale_asesor;
    modalRef.componentInstance.CLIENT_SELECTED = this.CLIENT_SELECTED;

    modalRef.componentInstance.EditProductProforma.subscribe((product_edit:any) => {
      this.DETAIL_PROFORMAS[INDEX] = product_edit;
      this.isLoadingProcess();
      this.sumTotalDetail();
    })
  }

  deleteProduct(DETAIL_PROFOR:any,INDEX:number){
    const modalRef = this.modalService.open(DeleteProductDetailProformaComponent,{size: 'md',centered:true});
    modalRef.componentInstance.DETAIL_PRODUCT = DETAIL_PROFOR;

    modalRef.componentInstance.DeleteProductProforma.subscribe((product_edit:any) => {
      this.DETAIL_PROFORMAS.splice(INDEX,1);
      this.isLoadingProcess();
      this.sumTotalDetail();
    })
  }

  validationDeliverie(){
    if(this.sucursale_deliverie_id){
      let DELIVERIE_SELECTED = this.sucursale_deliveries.find((deliv:any) => deliv.id == this.sucursale_deliverie_id);
      if(DELIVERIE_SELECTED){
        if(DELIVERIE_SELECTED.name.indexOf(this.user.sucursale_name) != -1){
          return false;
        }
      }
    }
    return true;
  }

  changeRegion($event:any){
    console.log($event.target.value);
    let REGION_ID = $event.target.value;
    let REGION_SELECTED = this.REGIONES.find((region:any) => region.id == REGION_ID);
    if(REGION_SELECTED){
      this.region = REGION_SELECTED.name;
    }
    let provincias = this.PROVINCIAS.filter((provincia:any) => provincia.department_id == REGION_ID);
    console.log(provincias);
    this.PROVINCIA_SELECTEDS = provincias;
  }
  changeProvincia($event:any){
    console.log($event.target.value);
    let PROVINCIA_ID = $event.target.value;
    let PROVINCIA_SELECTED = this.PROVINCIAS.find((prov:any) => prov.id == PROVINCIA_ID);
    if(PROVINCIA_SELECTED){
      this.provincia = PROVINCIA_SELECTED.name;
    }
    let distritos = this.DISTRITOS.filter((distrito:any) => distrito.province_id == PROVINCIA_ID);
    console.log(distritos);
    this.DISTRITO_SELECTEDS = distritos;
  }

  resetSucursaleDeliverie(){
    this.agencia = '';
    this.full_name_encargado = '';
    this.documento_encargado = '';
    this.telefono_encargado = '';

    this.region = '';
    this.distrito = '';
    this.provincia = '';
    this.ubigeo_region = '';
    this.ubigeo_provincia = '';
    this.ubigeo_distrito = '';
    this.sucursale_deliverie_id = '';
    this.address = '';
    this.date_entrega = null;
  }

  changeMethodPayment(){
    this.METHOD_PAYMENT_SELECTED = this.method_payments.find((item:any) => item.id == this.method_payment_id);
    this.banco_id = '';
  }

  processFile($event:any){
    if($event.target.files[0].type.indexOf("image") < 0){
      this.toast.warning("WARN","El archivo no es una imagen");
      return;
    }
    this.payment_file = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.payment_file);
    reader.onloadend = () => this.imagen_previzualiza = reader.result;
    this.isLoadingProcess();
  }

  save(){
    if(!this.CLIENT_SELECTED){
      this.toast.error("Validación","Necesitas seleccionar un cliente");
      return;
    }
    // this.TOTAL_PROFORMA == 0
    if(this.DETAIL_PROFORMAS.length == 0){
      this.toast.error("Validación","Necesitas agregar productos a la proforma");
      return;
    }
    if(!this.sucursale_deliverie_id){
      this.toast.error("Validación","El lugar de entrega es requerido")
      return;
    }
    if(!this.date_entrega){
      this.toast.error("Validación","La fecha de entrega es requerido")
      return;
    }

    if(this.validationDeliverie() && this.sucursale_deliverie_id != 5){
      if(!this.agencia){
        this.toast.error("Validación","La agencia es requerido")
        return;
      }
      if(!this.full_name_encargado){
        this.toast.error("Validación","El nombre del encargado es requerido")
        return;
      }
      if(!this.documento_encargado){
        this.toast.error("Validación","El documento del encargado es requerido")
        return;
      }
      if(!this.telefono_encargado){
        this.toast.error("Validación","El telefono del encargado es requerido")
        return;
      }
    }
    if(this.sucursale_deliverie_id == 6){
      if(!this.ubigeo_region){
        this.toast.error("Validación","La region es requerido")
        return;
      }
      if(!this.ubigeo_provincia){
        this.toast.error("Validación","La provincia es requerido")
        return;
      }
      if(!this.ubigeo_distrito){
        this.toast.error("Validación","La distrito es requerido")
        return;
      }
    }

    if(this.CLIENT_SELECTED.client_segment.id != 1 && this.CLIENT_SELECTED.is_parcial == 1){
      if(!this.method_payment_id){
        this.toast.error("Validación","El metodo de pago es requerido")
        return;
      }
      if(this.METHOD_PAYMENT_SELECTED.bancos.length > 0){
        if(!this.banco_id){
          this.toast.error("Validación","El banco es requerido")
        return;
        }
      }
      if(!this.amount_payment){
        this.toast.error("Validación","El monto de pago es requerido")
        return;
      }
      if(this.amount_payment == 0){
        this.toast.error("Validación","El monto de pago es requerido")
        return;
      }
      if(!this.payment_file){
        this.toast.error("Validación","El vaucher de pago es requerido")
        return;
      }
    }

    let DISTRITO_SELECTED = this.DISTRITOS.find((distr:any) => distr.id == this.ubigeo_distrito);
    if(DISTRITO_SELECTED){
      this.distrito = DISTRITO_SELECTED.name;
    }

    let formData = new FormData();

    formData.append("client_id",this.CLIENT_SELECTED.id);
    formData.append("client_segment_id",this.CLIENT_SELECTED.client_segment.id);
    formData.append("subtotal",this.TOTAL_PROFORMA+"")
    formData.append("total",this.TOTAL_PROFORMA+"")
    formData.append("igv",this.TOTAL_IMPUESTO_PROFORMA+"");
    formData.append("debt",(this.DEBT_PROFORMA - (this.amount_payment ? this.amount_payment : 0))+"");
    formData.append("paid_out",(this.PAID_OUT_PROFORMA + (this.amount_payment ? this.amount_payment : 0))+"");
    formData.append("description",this.description);

    formData.append("DETAIL_PROFORMAS",JSON.stringify(this.DETAIL_PROFORMAS));

    formData.append("sucursale_deliverie_id",this.sucursale_deliverie_id);
    formData.append("date_entrega",this.date_entrega);
    if(this.address){
      formData.append("address",this.address);
    }

    if(this.validationDeliverie()){
      formData.append("agencia",this.agencia);
      formData.append("full_name_encargado",this.full_name_encargado);
      formData.append("documento_encargado",this.documento_encargado);
      formData.append("telefono_encargado",this.telefono_encargado);
    }
    if(this.sucursale_deliverie_id == 6){
      formData.append("ubigeo_region",this.ubigeo_region);
      formData.append("ubigeo_provincia",this.ubigeo_provincia);
      formData.append("ubigeo_distrito",this.ubigeo_distrito);
      formData.append("region",this.region);
      formData.append("provincia",this.provincia);
      formData.append("distrito",this.distrito);
    }
    if(this.method_payment_id || this.amount_payment){
      formData.append("method_payment_id",this.method_payment_id);
      if(this.banco_id){
        formData.append("banco_id",this.banco_id);
      }
      formData.append("amount_payment",this.amount_payment+"");
      formData.append("payment_file",this.payment_file);
    }

    this.proformaService.createProforma(formData).subscribe((resp:any) => {
      console.log(resp);
      this.toast.success("Exito","LA proforma se creo con exito");

      this.resetClient();
      this.DETAIL_PROFORMAS = [];
      this.resetSucursaleDeliverie();
      this.TOTAL_PROFORMA = 0;
      this.method_payment_id = '';
      this.amount_payment = 0;
      this.imagen_previzualiza = '';
      this.payment_file = null;
      this.TOTAL_IMPUESTO_PROFORMA = 0;
      this.DEBT_PROFORMA = 0;
      this.PAID_OUT_PROFORMA = 0;
      this.banco_id = '';
      this.description = '';
      this.isLoadingProcess();
    },(err:any) => {
      console.log(err);
      this.toast.error("Validación","Hubo un error en el servidor, intente nuevamente o acceda a la consola y vea que sucede");
    })
  }
}
