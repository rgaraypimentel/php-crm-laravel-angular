import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { URL_SERVICIOS } from 'src/app/config/config';
import { OpenDetailProformaComponent } from '../componets/open-detail-proforma/open-detail-proforma.component';
import { DeleteProformaComponent } from '../delete-proforma/delete-proforma.component';
import { ProformasService } from '../service/proformas.service';

@Component({
  selector: 'app-list-proforma',
  templateUrl: './list-proforma.component.html',
  styleUrls: ['./list-proforma.component.scss']
})
export class ListProformaComponent {
  search:string = '';
  PROFORMAS:any = [];
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
  constructor(
    public modalService: NgbModal,
    public proformasService: ProformasService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.proformasService.isLoading$;
    this.listProformas();
    this.configAll();
  }

  listProformas(page = 1){
    let data = {
      search: this.search,
      client_segment_id: this.client_segment_id,
      asesor_id: this.asesor_id,
      product_categorie_id:this.product_categorie_id,
      search_client:this.search_client,
      search_product:this.search_product,
      start_date: this.start_date,
      end_date: this.end_date,
      state_proforma: this.type,
    }
    this.proformasService.listProformas(page,data).subscribe((resp:any) => {
      console.log(resp);
      this.PROFORMAS = resp.proformas.data;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }
  resetlistProformas(){
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
    this.listProformas();
  }
  configAll(){
    this.proformasService.configAll().subscribe((resp:any) => {
      console.log(resp);
      this.client_segments = resp.client_segments;
      this.asesores = resp.asesores;
      this.product_categories = resp.product_categories;
    })
  }
  loadPage($event:any){
    this.listProformas($event);
  }


  deleteProforma(PROFORMA_SELECTED:any){
    const modalRef = this.modalService.open(DeleteProformaComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.proforma_selected = PROFORMA_SELECTED;

    modalRef.componentInstance.ProformasD.subscribe((client_s:any) => {
      let INDEX = this.PROFORMAS.findIndex((client_s:any) => client_s.id == PROFORMA_SELECTED.id);
      if(INDEX != -1){
        this.PROFORMAS.splice(INDEX,1);
      }
      // this.ROLES.unshift(role);
    })
  }

  openProforma(PROFORMA:any){
    const modalRef = this.modalService.open(OpenDetailProformaComponent,{centered:true,size: 'lg'});
    modalRef.componentInstance.PROFORMA = PROFORMA;
  }
  proformaPdf(PROFORMA:any){
    window.open(URL_SERVICIOS+"/pdf/proforma/"+PROFORMA.id,"_blank");
  }
  exportProformas(){
    let LINK="";
    if(this.search){
      LINK += "&search="+this.search;
    }
    if(this.client_segment_id){
      LINK += "&client_segment_id="+this.client_segment_id;
    }
    if(this.product_categorie_id){
      LINK += "&product_categorie_id="+this.product_categorie_id;
    }
    if(this.search_client){
      LINK += "&search_client="+this.search_client;
    }
    if(this.type){
      LINK += "&state_proforma="+this.type;
    }
    if(this.search_product){
      LINK += "&search_product="+this.search_product;
    }
    if(this.start_date && this.end_date){
      LINK += "&start_date="+this.start_date;
      LINK += "&end_date="+this.end_date;
    }
    if(this.asesor_id){
      LINK += "&asesor_id="+this.asesor_id;
    }
    window.open(URL_SERVICIOS+"/excel/export-proforma-generales?z=1"+LINK,"_blank");
  }
  exportProformasDetails(){
    let LINK="";
    if(this.search){
      LINK += "&search="+this.search;
    }
    if(this.client_segment_id){
      LINK += "&client_segment_id="+this.client_segment_id;
    }
    if(this.product_categorie_id){
      LINK += "&product_categorie_id="+this.product_categorie_id;
    }
    if(this.search_client){
      LINK += "&search_client="+this.search_client;
    }
    if(this.type){
      LINK += "&state_proforma="+this.type;
    }
    if(this.search_product){
      LINK += "&search_product="+this.search_product;
    }
    if(this.start_date && this.end_date){
      LINK += "&start_date="+this.start_date;
      LINK += "&end_date="+this.end_date;
    }
    if(this.asesor_id){
      LINK += "&asesor_id="+this.asesor_id;
    }
    window.open(URL_SERVICIOS+"/excel/export-proforma-details?z=1"+LINK,"_blank");
  }
}
