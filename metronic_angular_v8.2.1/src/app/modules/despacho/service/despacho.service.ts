import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from '../../auth';

@Injectable({
  providedIn: 'root'
})
export class DespachoService {

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
    let URL = URL_SERVICIOS+"/proformas/config";
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authservice.token});
    return this.http.get(URL,{headers:headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  listContracts(page:number = 1,data:any = {}){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS+"/despacho/index?page="+page;
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authservice.token});
    return this.http.post(URL,data,{headers:headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  processEntrega(data:any = {}){
    this.isLoadingSubject.next(true);
    let URL = URL_SERVICIOS+"/despacho";
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authservice.token});
    return this.http.post(URL,data,{headers:headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
