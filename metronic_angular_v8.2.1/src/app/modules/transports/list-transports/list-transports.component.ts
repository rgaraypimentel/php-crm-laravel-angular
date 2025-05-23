import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteTransportsComponent } from '../delete-transports/delete-transports.component';
import { TransportsService } from '../service/transports.service';

@Component({
  selector: 'app-list-transports',
  templateUrl: './list-transports.component.html',
  styleUrls: ['./list-transports.component.scss']
})
export class ListTransportsComponent {
  TRANSPORTS:any = [];
  isLoading$:any;

  totalPages:number = 0;
  currentPage:number = 1;

  warehouses_start:any = [];
  warehouses_end:any = [];

  search:string = '';
  warehouse_start_id:string = '';
  warehouse_end_id:string = '';
  search_product:string = '';
  start_date:any = null;
  end_date:any = null;
  constructor(
    public modalService: NgbModal,
    public transportService: TransportsService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.transportService.isLoading$;
    this.listTransport();
    this.configAll();
  }

  listTransport(page = 1){
    let data = {
      warehouse_start_id: this.warehouse_start_id,
      warehouse_end_id: this.warehouse_end_id,
      n_orden: this.search,
      start_date: this.start_date,
      end_date: this.end_date,
      search_product: this.search_product,
    }
    this.transportService.listTransport(page,data).subscribe((resp:any) => {
      console.log(resp);
      this.TRANSPORTS = resp.transports.data;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }
  resetlistTransport(){
    this.search = '';
    this.warehouse_start_id = '';
    this.warehouse_end_id = '';
    this.start_date = null;
    this.end_date = null;
    this.search_product = '';
    this.listTransport();
  }
  configAll(){
    this.transportService.configAll().subscribe((resp:any) => {
      console.log(resp);
      this.warehouses_start = resp.warehouses;
      this.warehouses_end = resp.warehouses;
    })
  }
  loadPage($event:any){
    this.listTransport($event);
  }

  deleteTransport(TRANSPORT:any){
    const modalRef = this.modalService.open(DeleteTransportsComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.transport = TRANSPORT;

    modalRef.componentInstance.DeleteTransport.subscribe((resp:any) => {
      let INDEX = this.TRANSPORTS.findIndex((purhc_s:any) => purhc_s.id == TRANSPORT.id);
      if(INDEX != -1){
        this.TRANSPORTS.splice(INDEX,1);
      }
    })
  }
}
