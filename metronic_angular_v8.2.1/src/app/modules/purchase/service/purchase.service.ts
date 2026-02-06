import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from '../../auth';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  configAll(){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    let URL = URL_SERVICIOS+"/purchase/config";
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  searchProducts(search_product:string){
    this.isLoadingSubject.next(true);
    let LINK = "";
    if(search_product){
      LINK += "&search="+search_product;
    }
    let URL = URL_SERVICIOS+"/proformas/search-products?p=1"+LINK;
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authservice.token});
    return this.http.get(URL,{headers:headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  createOrderPurchase(data:any){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS+"/purchase";
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authservice.token});
    return this.http.post(URL,data,{headers:headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  listOrderPurchase(page:number= 1,data:any){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS+"/purchase/index?page="+page;
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authservice.token});
    return this.http.post(URL,data,{headers:headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  showPurchase(ID_PURCHASE:String){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    let URL = URL_SERVICIOS+"/purchase/"+ID_PURCHASE;
    return this.http.get(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  editOrderPurchase(ID_PURCHASE:string,data:any){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS+"/purchase/"+ID_PURCHASE;
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authservice.token});
    return this.http.put(URL,data,{headers:headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  deleteOrderPurchase(ID_PURCHASE:string){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS+"/purchase/"+ID_PURCHASE;
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authservice.token});
    return this.http.delete(URL,{headers:headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  procesoEntrega(data:any){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS+"/purchase-detail/entrega";
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authservice.token});
    return this.http.post(URL,data,{headers:headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  // NUEVAS FUNCIONES PARA EL DETALLADO DE UNA ORDEN DE COMPRA

  addPurchaseDetail(data:any){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS+"/purchase-detail";
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authservice.token});
    return this.http.post(URL,data,{headers:headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  editPurchaseDetail(ID_DETAIL:string,data:any){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS+"/purchase-detail/"+ID_DETAIL;
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authservice.token});
    return this.http.put(URL,data,{headers:headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  deletePurchaseDetail(ID_DETAIL:String,total:number = 0,importe:number = 0,igv:number = 0,purchase_id:string = ''){
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    let URL = URL_SERVICIOS+"/purchase-detail/"+ID_DETAIL+"?total="+total+"&importe="+importe+"&igv="+igv+"&purchase_id="+purchase_id;
    return this.http.delete(URL,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
