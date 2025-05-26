import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SearchProductsComponent } from '../../proformas/componets/search-products/search-products.component';
import { ConversionService } from '../service/conversion.service';

@Component({
  selector: 'app-create-conversion',
  templateUrl: './create-conversion.component.html',
  styleUrls: ['./create-conversion.component.scss']
})
export class CreateConversionComponent {

  @Output() ConversionC: EventEmitter<any> = new EventEmitter();
  @Input() units:any = [];

  isLoading:any;

  search_product:string = '';
  PRODUCT_SELECTED:any = null;
  warehouse_id:any = '';
  warehouses:any = [];
  unit_name:any = '';
  unit_end_id:any = '';
  unit_transforms:any = [];
  quantity_start:number = 0;
  quantity_end: number = 0;
  quantity:number = 0;
  description:string = '';
  WAREHOUSE_UNITS:any = [];
  UNIT_SELECTED:any = null;
  constructor(
    public modal: NgbActiveModal,
    public conversionService: ConversionService,
    public toast: ToastrService,
    public modalService: NgbModal,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading = this.conversionService.isLoading$;
  }

  isLoadingProcess(){
    this.conversionService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.conversionService.isLoadingSubject.next(false);
    }, 50);
  }

  listProducts(){
    if(!this.search_product){
      this.toast.error("Validación","Necesitas ingresar al menos uno de los campos");
      return;
    }
    this.conversionService.searchProducts(this.search_product).subscribe((resp:any) => {
      console.log(resp);
      if(resp.products.data.length > 1){
        this.openSelectedProduct(resp.products.data);
      }else{
        if(resp.products.data.length == 1){
          this.PRODUCT_SELECTED = resp.products.data[0];
          this.warehouses = [];
          this.PRODUCT_SELECTED.warehouses.forEach((wh:any) => {
            let INDEX = this.warehouses.findIndex((item:any) => item.id == wh.warehouse.id);
            if(INDEX == -1){
              this.warehouses.push(wh.warehouse);
            }
          });
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
      this.warehouses = [];
      this.PRODUCT_SELECTED.warehouses.forEach((wh:any) => {
        let INDEX = this.warehouses.findIndex((item:any) => item.id == wh.warehouse.id);
        if(INDEX == -1){
          this.warehouses.push(wh.warehouse);
        }
      });
      this.search_product = this.PRODUCT_SELECTED.title;
      this.isLoadingProcess();
      this.toast.success("Exito","Se selecciono el producto");
    })
  }

  selectedWarehouse(){
    if(!this.PRODUCT_SELECTED){
      this.toast.error("Validación","Necesitas seleccionar un producto");
      return;
    }
    console.log(this.warehouse_id);
    this.WAREHOUSE_UNITS = this.PRODUCT_SELECTED.warehouses.filter((wh:any) => wh.warehouse.id == this.warehouse_id);
    console.log(this.WAREHOUSE_UNITS);
  }
  selectedUnit(WAREHOUSE_UNIT:any){
    console.log(WAREHOUSE_UNIT);
    this.UNIT_SELECTED = WAREHOUSE_UNIT.unit;
    this.unit_name = this.UNIT_SELECTED.name;
    this.unit_transforms = [];

    let UNIT_S = this.units.find((unit:any) => unit.id == this.UNIT_SELECTED.id);
    if(UNIT_S){
      this.unit_transforms = UNIT_S.transforms;
    }
  }

  calcTotal(){
    this.quantity = parseInt((this.quantity_start * this.quantity_end).toFixed(2));
    this.isLoadingProcess();
  }

  store(){
    if(!this.PRODUCT_SELECTED){
      this.toast.error("Validación","El producto debe ser seleccionado");
      return false;
    }
    if(!this.warehouse_id){
      this.toast.error("Validación","El almacen debe ser seleccionado");
      return false;
    }
    if(!this.UNIT_SELECTED){
      this.toast.error("Validación","Es necesario seleccionar una unidad");
      return false;
    }
    if(!this.unit_end_id){
      this.toast.error("Validación","Es necesario seleccionar una unidad de conversión");
      return false;
    }
    if(this.quantity == 0){
      this.toast.error("Validación","Es necesario digitar una cantidad inicial y cantidad final");
      return false;
    }
    if(!this.description){
      this.toast.error("Validación","Es necesario dar una pequeña nota del motivo de la conversión");
      return false;
    }
    let data = {
      product_id: this.PRODUCT_SELECTED.id,
      warehouse_id: this.warehouse_id,
      unit_start_id: this.UNIT_SELECTED.id,
      unit_end_id: this.unit_end_id,
      quantity_start: this.quantity_start,
      quantity_end: this.quantity_end,
      quantity: this.quantity,
      description: this.description,
    }

    this.conversionService.registerConversion(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","La conversión se registro correctamente");
        this.ConversionC.emit(resp.conversion);
        this.modal.close();
      }
    })
  }

}
