import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from '../../auth';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  isLoading$: Observable<boolean>;
    isLoadingSubject: BehaviorSubject<boolean>;
  
    constructor(
      private http: HttpClient,
      public authservice: AuthService,
    ) {
      this.isLoadingSubject = new BehaviorSubject<boolean>(false);
      this.isLoading$ = this.isLoadingSubject.asObservable();
    }

  createFactura(data:any){
      this.isLoadingSubject.next(true);
      let URL = URL_SERVICIOS+"/invoices/send";
      let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authservice.token});
      console.log(data);
      return this.http.post(URL,data,{headers:headers}).pipe(
        finalize(() => this.isLoadingSubject.next(false))
      );
    }
}
