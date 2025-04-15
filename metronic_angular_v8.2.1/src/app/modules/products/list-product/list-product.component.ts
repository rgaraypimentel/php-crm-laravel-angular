import { Component } from '@angular/core';
import { DeleteProductComponent } from '../delete-product/delete-product.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductsService } from '../service/products.service';
import { URL_SERVICIOS } from 'src/app/config/config';
import { ImportProductsComponent } from '../import-products/import-products.component';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss']
})
export class ListProductComponent {
  search:string = '';
  PRODUCTS:any = [];
  isLoading$:any;

  CATEGORIES:any = [];
  SUCURSALES:any = [];
  WAREHOUSES:any = [];
  CLIENT_SEGMENTS:any = [];
  UNITS:any = [];

  totalPages:number = 0;
  currentPage:number = 1;

  product_categorie_id:string = '';
  disponibilidad:string = '';
  tax_selected:string = '';
  sucursale_price_multiple:string = '';
  almacen_warehouse:string = '';
  client_segment_price_multiple :string = '';
  unit_warehouse:string = '';
  state_stock:string = '';
  num_products_agotado:number = 0;
  num_products_por_agotar:number = 0;
  constructor(
    public modalService: NgbModal,
    public productService: ProductsService
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.productService.isLoading$;
    this.listProducts();
    this.configAll();
  }

  listProducts(page = 1){
      let data = {
        product_categorie_id: this.product_categorie_id,
        disponibilidad: this.disponibilidad,
        tax_selected: this.tax_selected,
        search: this.search,
        // FILTER SPECIAL
        sucursale_price_multiple: this.sucursale_price_multiple,
        client_segment_price_multiple: this.client_segment_price_multiple,
        almacen_warehouse: this.almacen_warehouse,
        unit_warehouse: this.unit_warehouse,
        state_stock: this.state_stock,
      }
    this.productService.listProducts(page,data).subscribe((resp:any) => {
      console.log(resp);
      this.PRODUCTS = resp.products.data;
      this.totalPages = resp.total;
      this.num_products_agotado = resp.num_products_agotado;
      this.num_products_por_agotar = resp.num_products_por_agotar;
      this.currentPage = page;
    })
  }

  resetlistProducts() {
    this.product_categorie_id = '';
    this.disponibilidad = '';
    this.tax_selected = '';
    this.search = '';
    this.sucursale_price_multiple= '';
    this.client_segment_price_multiple= '';
    this.almacen_warehouse= '';
    this.unit_warehouse = '';
    this.state_stock = '';
    this.listProducts();
  }
  configAll(){
    this.productService.configAll().subscribe((resp:any) => {
      console.log(resp);
      this.CATEGORIES = resp.categories;
      this.SUCURSALES = resp.sucursales;
      this.WAREHOUSES = resp.almacens;
      this.CLIENT_SEGMENTS = resp.segments_clients;
      this.UNITS = resp.units;
    })
  }
  getDisponibilidad(val:number){
    let TEXTO = "";
    switch (val) {
      case 1:
        TEXTO = "Vender los productos sin stock"
        break;
        case 2:
          TEXTO = "No vender los productos sin stock"
          break;
          case 3:
        TEXTO = "Proyectar con los contratos que se tenga"
        break;
      default:
        break;
    }
    return TEXTO;
  }
  getTaxSelected(val:number) {
    let TEXTO = "";
    switch (val) {
      case 1:
        TEXTO = "Tax Free"
        break;
        case 2:
          TEXTO = "Taxable Goods"
          break;
          case 3:
        TEXTO = "Downloadable Product"
        break;
      default:
        break;
    }
    return TEXTO;
  }
  loadPage($event:any){
    this.listProducts($event);
  }
  selectAgotado(){
    this.state_stock = '3';
    this.listProducts();
  }
  selectPorAgotado(){
    this.state_stock = '2';
    this.listProducts();
  }
  deleteProduct(PRODUCT:any){
    const modalRef = this.modalService.open(DeleteProductComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.PRODUCT_SELECTED = PRODUCT;

    modalRef.componentInstance.ProductD.subscribe((prod:any) => {
      let INDEX = this.PRODUCTS.findIndex((prod:any) => prod.id == PRODUCT.id);
      if(INDEX != -1){
        this.PRODUCTS.splice(INDEX,1);
      }
    })
  }

  downloadProducts(){
    let LINK = "";
    if(this.product_categorie_id){
      LINK += "&product_categorie_id="+this.product_categorie_id;
    }
    if(this.disponibilidad){
      LINK += "&disponibilidad="+this.disponibilidad;
    }
    if(this.search){
      LINK += "&search="+this.search;
    }
    if(this.sucursale_price_multiple){
      LINK += "&sucursale_price_multiple="+this.sucursale_price_multiple;
    }
    if(this.client_segment_price_multiple){
      LINK += "&client_segment_price_multiple="+this.client_segment_price_multiple;
    }
    if(this.almacen_warehouse){
      LINK += "&almacen_warehouse="+this.almacen_warehouse;
    }
    if(this.unit_warehouse){
      LINK += "&unit_warehouse="+this.unit_warehouse;
    }
    if(this.state_stock){
      LINK += "&state_stock="+this.state_stock;
    }
    window.open(URL_SERVICIOS+"/excel/export-products?k=1"+LINK,"_blank");
  }

  importProducts(){
    const modalRef = this.modalService.open(ImportProductsComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.ImportProductD.subscribe((prod:any) => {
      this.listProducts();
    })
  }
}

