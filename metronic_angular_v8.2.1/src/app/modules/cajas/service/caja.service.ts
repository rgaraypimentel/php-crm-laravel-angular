import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from '../../auth';

@Injectable({
  providedIn: 'root'
})
export class CajaService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }


  configCaja(sucursale_id:string) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization':'Bearer '+this.authservice.token});
    let URL = URL_SERVICIOS+"/caja/config?sucursale_id="+sucursale_id;
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  aperturaCaja(data:any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization':'Bearer '+this.authservice.token});
    let URL = URL_SERVICIOS+"/caja/apertura_caja";
    return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  cierreCaja(data:any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization':'Bearer '+this.authservice.token});
    let URL = URL_SERVICIOS+"/caja/cierre_caja";
    return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  reportCaja(page:number = 1,data:any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization':'Bearer '+this.authservice.token});
    let URL = URL_SERVICIOS+"/caja/report_caja?page="+page;
    return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }


  searchClients(n_document:string,full_name:string,phone:string){
    this.isLoadingSubject.next(true);
    let LINK = "";
    if(n_document){
      LINK += "&n_document="+n_document;
    }
    if(full_name){
      LINK += "&full_name="+full_name;
    }
    if(phone){
      LINK += "&phone="+phone;
    }
    let URL = URL_SERVICIOS+"/proformas/search-clients?p=1"+LINK;
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authservice.token});
    return this.http.get(URL,{headers:headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  searchProformas(CLIENT_ID:string,n_proforma:string,state_payment:string){
    this.isLoadingSubject.next(true);
    let LINK = "";
    if(n_proforma){
      LINK += "&n_proforma="+n_proforma;
    }
    if(state_payment){
      LINK += "&state_payment="+state_payment;
    }
    let URL = URL_SERVICIOS+"/caja/search_proformas/"+CLIENT_ID+"?p=1"+LINK;
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authservice.token});
    return this.http.get(URL,{headers:headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  updatePayment(data:any,PAYMENT_ID:any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization':'Bearer '+this.authservice.token});
    let URL = URL_SERVICIOS+"/caja/updated_payment/"+PAYMENT_ID;
    return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  createPayment(data:any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization':'Bearer '+this.authservice.token});
    let URL = URL_SERVICIOS+"/caja/created_payment";
    return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  processPayment(data:any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization':'Bearer '+this.authservice.token});
    let URL = URL_SERVICIOS+"/caja/process_payment";
    return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  listContractProcess(data:any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization':'Bearer '+this.authservice.token});
    let URL = URL_SERVICIOS+"/caja/contract_process";
    return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  reportCajaDay(CAJA_SUCURSALE_ID:any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization':'Bearer '+this.authservice.token});
    let URL = URL_SERVICIOS+"/caja/report_caja_day/"+CAJA_SUCURSALE_ID;
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
