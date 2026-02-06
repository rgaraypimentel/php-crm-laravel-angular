import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { URL_SERVICIOS } from 'src/app/config/config';
import { CajaReportDayComponent } from '../caja-report-day/caja-report-day.component';
import { ShowDetailsPaymentsComponent } from '../lists-caja-process/show-details-payments/show-details-payments.component';
import { CajaService } from '../service/caja.service';

@Component({
  selector: 'app-caja-history',
  templateUrl: './caja-history.component.html',
  styleUrls: ['./caja-history.component.scss']
})
export class CajaHistoryComponent {
  @Input() sucursales:any = [];

  start_date:any = null;
  end_date:any = null;

  type_option:string = '';
  sucursale_id:string = '1';

  CAJA_SUCURSALES:any = [];
  totalPages:number = 0;
  currentPage:number = 0;
  PROFORMAS:any = [];
  constructor(
    public modal: NgbActiveModal,
    public cajaService: CajaService,
    public toast: ToastrService,
    public modalService: NgbModal,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }

  reportCaja(page=1){

    if(!this.type_option){
      this.toast.error("Validación","Necesitas seleccionar una opción");
      return;
    }

    if(!this.start_date || !this.end_date){
      this.toast.error("Validación","Necesitas seleccionar una fecha de inicio y una fecha de fin");
      return;
    }

    let data = {
      type_option: this.type_option,
      start_date: this.start_date,
      end_date: this.end_date,
      sucursale_id: this.sucursale_id,
    };
    this.cajaService.reportCaja(page,data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.caja_sucursales){
        this.CAJA_SUCURSALES = resp.caja_sucursales;
      }else{
        this.totalPages = resp.total;
        this.currentPage = page;
        this.PROFORMAS = resp.contract_process.data;
      }
    })

  }

  resetCaja(){
    this.start_date = null;
    this.end_date = null;
    this.PROFORMAS = [];
    this.CAJA_SUCURSALES = [];
  }
  loadPage($event:number){
    this.reportCaja($event);
  }

  openPayments(PROFORMA:any){
    const modalRef = this.modalService.open(ShowDetailsPaymentsComponent,{centered:true,size: 'lg'});
    modalRef.componentInstance.PROFORMA_SELECTED = PROFORMA;
  }
  openReport(CAJA_SUCURSAL:any){
    const modalRef = this.modalService.open(CajaReportDayComponent,{centered:true,size: 'lg'});
    modalRef.componentInstance.caja = {
      id: CAJA_SUCURSAL.caja.id,
      sucursale: {
        name: CAJA_SUCURSAL.caja.name
      }
    };
    modalRef.componentInstance.caja_sucursale = CAJA_SUCURSAL;
    modalRef.componentInstance.created_at_apertura = CAJA_SUCURSAL.created_at;
  }

  exportProformas(){
    if(!this.type_option){
      this.toast.error("Validación","Necesitas seleccionar una opción");
      return;
    }

    if(!this.start_date || !this.end_date){
      this.toast.error("Validación","Necesitas seleccionar una fecha de inicio y una fecha de fin");
      return;
    }

    let LINK="";
    if(this.type_option){
      LINK += "&type_option="+this.type_option;
    }
    if(this.sucursale_id){
      LINK += "&sucursale_id="+this.sucursale_id;
    }
    if(this.start_date && this.end_date){
      LINK += "&start_date="+this.start_date;
      LINK += "&end_date="+this.end_date;
    }
    window.open(URL_SERVICIOS+"/excel/export-contract-processs?z=1"+LINK,"_blank");
  }
}
