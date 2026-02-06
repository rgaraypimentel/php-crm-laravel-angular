import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { URL_SERVICIOS } from 'src/app/config/config';
import { DetailContractsDespachoComponent } from '../detail-contracts-despacho/detail-contracts-despacho.component';
import { DespachoService } from '../service/despacho.service';

@Component({
  selector: 'app-list-contracts-despacho',
  templateUrl: './list-contracts-despacho.component.html',
  styleUrls: ['./list-contracts-despacho.component.scss']
})
export class ListContractsDespachoComponent {

  search:string = '';
  CONTRACTS:any = [];
  isLoading$:any;

  totalPages:number = 0;
  currentPage:number = 1;

  client_segments:any = [];
  asesores:any = [];

  client_segment_id:string = '';
  type:string = '';
  asesor_id:string = '';

  search_client:string =  '';
  search_product:string =  '';
  start_date:any = null;
  end_date:any = null;
  product_categorie_id:string = '';
  product_categories:any = [];
  warehouses:any = [];
  constructor(
    public modalService: NgbModal,
    public despachoService: DespachoService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.despachoService.isLoading$;
    this.listContracts();
    this.configAll();
  }

  listContracts(page = 1){
    let data = {
      search: this.search,
      client_segment_id: this.client_segment_id,
      asesor_id: this.asesor_id,
      product_categorie_id:this.product_categorie_id,
      search_client:this.search_client,
      search_product:this.search_product,
      start_date: this.start_date,
      end_date: this.end_date,
    }
    this.despachoService.listContracts(page,data).subscribe((resp:any) => {
      console.log(resp);
      this.CONTRACTS = resp.contracts.data;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }
  resetlistContracts(){
    this.search = '';
    this.client_segment_id = '';
    this.type = '';
    this.asesor_id = '';
    this.product_categorie_id = '';
    this.search_client = '';
    this.search_product = '';
    this.start_date = '';
    this.end_date = '';
    this.type = '';
    this.listContracts();
  }
  configAll(){
    this.despachoService.configAll().subscribe((resp:any) => {
      console.log(resp);
      this.client_segments = resp.client_segments;
      this.asesores = resp.asesores;
      this.product_categories = resp.product_categories;
      this.warehouses = resp.warehouses;
    })
  }
  loadPage($event:any){
    this.listContracts($event);
  }


  openProforma(CONTRACT:any){
    const modalRef = this.modalService.open(DetailContractsDespachoComponent,{centered:true,size: 'lg'});
    modalRef.componentInstance.CONTRACT = CONTRACT;
    modalRef.componentInstance.warehouses = this.warehouses;

    modalRef.componentInstance.ProductProcess.subscribe((resp:any) => {
      this.listContracts();
    })
  }
  proformaPdf(CONTRACT:any){
    window.open(URL_SERVICIOS+"/pdf/proforma/"+CONTRACT.id,"_blank");
  }

}
