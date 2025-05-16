import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SearchClientsComponent } from '../../proformas/componets/search-clients/search-clients.component';
import { CajaService } from '../service/caja.service';
import { CajaEditPaymentComponent } from './caja-edit-payment/caja-edit-payment.component';
import { CajaNewPaymentComponent } from './caja-new-payment/caja-new-payment.component';

@Component({
  selector: 'app-caja-clients-contracts',
  templateUrl: './caja-clients-contracts.component.html',
  styleUrls: ['./caja-clients-contracts.component.scss']
})
export class CajaClientsContractsComponent {
  @Input() method_payments:any = [];
  @Input() caja_sucursale:any;
  @Output() CajaSucursale: EventEmitter<any> = new EventEmitter();
  n_document:string = '';
  full_name:string = '';
  phone:string = '';
  CLIENT_SELECTED:any;

  state_payment:string = '';
  search:string = '';
  PROFORMAS:any = [];
  PROFORMA_SELECTED:any;
  PAGOS:any = [];
  isLoading$:any;
  constructor(
    public modal: NgbActiveModal,
    public toast: ToastrService,
    public cajaService: CajaService,
    public modalService: NgbModal,
  ) {

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.cajaService.isLoading$;
  }
  isLoadingProcess(){
    this.cajaService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.cajaService.isLoadingSubject.next(false);
    }, 50);
  }

  searchClients(){
    if(!this.n_document && !this.full_name && !this.phone){
      this.toast.error("Validación","Necesitas ingresar al menos uno de los campos");
      return;
    }
    this.cajaService.searchClients(this.n_document,this.full_name,this.phone).subscribe((resp:any) => {
      console.log(resp);
      if(resp.clients.length > 1){
        this.openSelectedClients(resp.clients);
      }else{
        if(resp.clients.length == 1){
          this.CLIENT_SELECTED = resp.clients[0];
          this.n_document = this.CLIENT_SELECTED.n_document;
          this.full_name = this.CLIENT_SELECTED.full_name;
          this.phone = this.CLIENT_SELECTED.phone;
          this.listProformasClient();
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
      this.listProformasClient();
      this.isLoadingProcess();
      this.toast.success("Exito","Se selecciono al cliente de la proforma");
    })
  }

  listProformasClient(){
    if(this.CLIENT_SELECTED){
      this.cajaService.searchProformas(this.CLIENT_SELECTED.id,this.search,this.state_payment).subscribe((resp:any) => {
        console.log(resp);
        this.PROFORMAS = resp.proformas.data;
      })
    }
  }

  openProforma(PROFORMA:any){
    this.PROFORMA_SELECTED = PROFORMA;
    this.PAGOS = PROFORMA.pagos;
  }

  editPay(PAGO:any){
    const modalRef = this.modalService.open(CajaEditPaymentComponent,{centered:true,size: 'md'});
    modalRef.componentInstance.PAGO = PAGO;
    modalRef.componentInstance.method_payments = this.method_payments;

    modalRef.componentInstance.PagoE.subscribe((resp:any) => {
      console.log(resp);
      let INDEX = this.PAGOS.findIndex((item:any) => item.id == resp.payment.id);
      if(INDEX != -1){
        this.PAGOS[INDEX] = resp.payment;
      }
      this.PROFORMA_SELECTED.debt = resp.proforma.debt
      this.PROFORMA_SELECTED.paid_out = resp.proforma.paid_out
    })
  }

  addPayment(){
    const modalRef = this.modalService.open(CajaNewPaymentComponent,{centered:true,size: 'md'});
    modalRef.componentInstance.PROFORMA = this.PROFORMA_SELECTED;
    modalRef.componentInstance.method_payments = this.method_payments;

    modalRef.componentInstance.PagoC.subscribe((resp:any) => {
      this.PAGOS.unshift(resp.payment);
      this.PROFORMA_SELECTED.debt = resp.proforma.debt
      this.PROFORMA_SELECTED.paid_out = resp.proforma.paid_out
    })
  }

  processPayment(){
    let data = {
      proforma_id: this.PROFORMA_SELECTED.id,
      caja_sucursale_id: this.caja_sucursale.id,
    }
    this.cajaService.processPayment(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validacion",resp.message_text);
      }else{
        this.PROFORMA_SELECTED = resp.proforma;
        this.PAGOS = [];
        setTimeout(() => {
          let INDEX = this.PROFORMAS.findIndex((proforma:any) => proforma.id == this.PROFORMA_SELECTED.id)
          if(INDEX != -1){
            this.PROFORMAS[INDEX] = this.PROFORMA_SELECTED;
          }
          this.PAGOS = this.PROFORMA_SELECTED.pagos;
          this.isLoadingProcess();
        }, 50);
        this.CajaSucursale.emit(resp.caja_sucursale);
      }
    })

  }

  resetlistProformasClient(){
    this.search = '';
    this.state_payment = '';
    this.listProformasClient();
  }
}
