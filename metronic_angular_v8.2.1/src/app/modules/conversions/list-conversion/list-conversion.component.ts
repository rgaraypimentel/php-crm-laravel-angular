import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateConversionComponent } from '../create-conversion/create-conversion.component';
import { DeleteConversionComponent } from '../delete-conversion/delete-conversion.component';
import { ConversionService } from '../service/conversion.service';

@Component({
  selector: 'app-list-conversion',
  templateUrl: './list-conversion.component.html',
  styleUrls: ['./list-conversion.component.scss']
})
export class ListConversionComponent {

  search:string = '';
  CONVERSIONS:any = [];
  isLoading$:any;

  totalPages:number = 0;
  currentPage:number = 1;

  warehouse_id:any = '';
  warehouses:any = [];
  units:any = [];
  unit_start_id:any = '';
  unit_end_id:any = '';
  search_product:any = '';
  start_date:any = null;
  end_date:any = null;
  constructor(
    public modalService: NgbModal,
    public conversionService: ConversionService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.conversionService.isLoading$;
    this.listConversions();
    this.configAll();
  }

  listConversions(page = 1){
    let data = {
      n_orden: this.search,
      warehouse_id: this.warehouse_id,
      unit_start_id: this.unit_start_id,
      unit_end_id: this.unit_end_id,
      search_product: this.search_product,
      start_date: this.start_date,
      end_date: this.end_date,
    }
    this.conversionService.listConversions(page,data).subscribe((resp:any) => {
      console.log(resp);
      this.CONVERSIONS = resp.conversions.data;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  configAll(){
    this.conversionService.configAll().subscribe((resp:any) => {
      console.log(resp);
      this.warehouses = resp.warehouses;
      this.units = resp.units;
    })
  }

  resetlistConversions(){
    this.search = '';
    this.warehouse_id = '';
    this.unit_start_id = '';
    this.unit_end_id = '';
    this.search_product = '';
    this.start_date = null;
    this.end_date = null;
    this.listConversions();
  }

  loadPage($event:any){
    this.listConversions($event);
  }

  createConversion (){
    const modalRef = this.modalService.open(CreateConversionComponent,{centered:true, size: 'lg'});
    modalRef.componentInstance.units = this.units;
    modalRef.componentInstance.ConversionC.subscribe((conversion:any) => {
      this.CONVERSIONS.unshift(conversion);
    })
  }

  editConversion(CONVERSION_SELECTED:any){
    // const modalRef = this.modalService.open(EditClientSegmentComponent,{centered:true, size: 'md'});
    // modalRef.componentInstance.CLIENT_SEGMENT_SELECTED = CLIENT_SEGMENT;
  }

  deleteConversion(CONVERSION_SELECTED:any){
    const modalRef = this.modalService.open(DeleteConversionComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.conversion = CONVERSION_SELECTED;

    modalRef.componentInstance.DeleteConversion.subscribe((converssion:any) => {
      let INDEX = this.CONVERSIONS.findIndex((convers_s:any) => convers_s.id == CONVERSION_SELECTED.id);
      if(INDEX != -1){
        this.CONVERSIONS.splice(INDEX,1);
      }
      // this.ROLES.unshift(role);
    })
  }

}
