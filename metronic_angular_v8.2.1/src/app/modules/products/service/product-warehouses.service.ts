import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from '../../auth';

@Injectable({
  providedIn: 'root'
})
export class ProductWarehousesService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  
  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  registerProductWarehouse(data:any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    let URL = URL_SERVICIOS+"/product_warehouses";
    return this.http.post(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  updateProductWarehouse(ID_WAREHOUSE_PRODUCT:string,data:any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
    let URL = URL_SERVICIOS+"/product_warehouses/"+ID_WAREHOUSE_PRODUCT;
    return this.http.put(URL,data,{headers: headers}).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  
  deleteProductWarehouse(ID_WAREHOUSE_PRODUCT:string) {
      this.isLoadingSubject.next(true);
      let headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authservice.token});
      let URL = URL_SERVICIOS+"/product_warehouses/"+ID_WAREHOUSE_PRODUCT;
      return this.http.delete(URL,{headers: headers}).pipe(
        finalize(() => this.isLoadingSubject.next(false))
      );
    }
}
