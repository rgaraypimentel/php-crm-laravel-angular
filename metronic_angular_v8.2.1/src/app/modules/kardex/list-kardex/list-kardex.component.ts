import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { URL_SERVICIOS } from 'src/app/config/config';
import { KardexService } from '../service/kardex.service';

@Component({
  selector: 'app-list-kardex',
  templateUrl: './list-kardex.component.html',
  styleUrls: ['./list-kardex.component.scss']
})
export class ListKardexComponent {

  isLoading$:any;

  categories:any = [];
  segment_clients:any = [];
  warehouses:any = [];

  year:string = '';
  month:string = '';
  year_current:string = '';
  month_current:string = '';
  warehouse_id:string = '';
  search_product:string = '';

  KARDEXS:any = [];
  constructor(
    public kardexService: KardexService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.kardexService.isLoading$;
    this.configAll();
  }

  configAll(){

    this.kardexService.configAll().subscribe((resp:any) => {
      console.log(resp);
      this.warehouses = resp.warehouses;
      this.year = resp.year;
      this.month = resp.month;
      this.year_current = resp.year;
      this.month_current = resp.month;
    })
  }

  listKardex(){
    if(!this.warehouse_id){
      this.toast.error("Validación","Necesitas seleccionar un almacen");
      return;
    }
    let data = {
      year: this.year,
      month: this.month,
      warehouse_id: this.warehouse_id,
      search_product: this.search_product,
    }
    this.kardexService.listKardex(data).subscribe((resp:any) => {
      console.log(resp);
      this.KARDEXS = resp.kardex_products;
    })
  }

  reset(){
    this.year = this.year_current;
    this.month = this.month_current;
    this.search_product = '';
    this.listKardex();
  }

  getNameUnit(KARDEX:any,unit_id:string){
    let UNIDAD = KARDEX.units.find((item:any) => item.id == unit_id);
    return UNIDAD ? UNIDAD.name : '---';
  }

  exportKardex(){
    if(!this.warehouse_id){
      this.toast.error("Validación","Necesitas seleccionar un almacen");
      return;
    }
    let LINK="";
    if(this.year){
      LINK += "&year="+this.year;
    }
    if(this.month){
      LINK += "&month="+this.month;
    }
    if(this.warehouse_id){
      LINK += "&warehouse_id="+this.warehouse_id;
    }
    if(this.search_product){
      LINK += "&search_product="+this.search_product;
    }
    window.open(URL_SERVICIOS+"/excel/export-kardex?z=1"+LINK,"_blank");
  }

}
