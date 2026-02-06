import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeletePurchaseComponent } from '../delete-purchase/delete-purchase.component';
import { PurchaseService } from '../service/purchase.service';

@Component({
  selector: 'app-lists-purchases',
  templateUrl: './lists-purchases.component.html',
  styleUrls: ['./lists-purchases.component.scss']
})
export class ListsPurchasesComponent {
  PURCHASES:any = [];
  isLoading$:any;

  totalPages:number = 0;
  currentPage:number = 1;

  warehouses:any = [];
  providers:any = [];

  search:string = '';
  warehouse_id:string = '';
  n_comprobant:string = '';
  provider_id:string = '';
  search_product:string = '';
  start_date:any = null;
  end_date:any = null;
  constructor(
    public modalService: NgbModal,
    public purchaseService: PurchaseService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.purchaseService.isLoading$;
    this.listOrderPurchase();
    this.configAll();
  }

  listOrderPurchase(page = 1){
    let data = {
      warehouse_id: this.warehouse_id,
      n_orden: this.search,
      provider_id: this.provider_id,
      n_comprobant: this.n_comprobant,
      start_date: this.start_date,
      end_date: this.end_date,
      search_product: this.search_product,
    }
    this.purchaseService.listOrderPurchase(page,data).subscribe((resp:any) => {
      console.log(resp);
      this.PURCHASES = resp.purchases.data;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }
  resetlistOrderPurchase(){
    this.search = '';
    this.warehouse_id = '';
    this.start_date = null;
    this.end_date = null;
    this.search_product = '';
    this.n_comprobant = '';
    this.provider_id = '';
    this.listOrderPurchase();
  }
  configAll(){
    this.purchaseService.configAll().subscribe((resp:any) => {
      console.log(resp);
      this.warehouses = resp.warehouses;
      this.providers = resp.providers;
    })
  }
  loadPage($event:any){
    this.listOrderPurchase($event);
  }

  deletePurchase(PURCHASE:any){
    const modalRef = this.modalService.open(DeletePurchaseComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.purchase = PURCHASE;

    modalRef.componentInstance.DeletePurchase.subscribe((resp:any) => {
      let INDEX = this.PURCHASES.findIndex((purhc_s:any) => purhc_s.id == PURCHASE.id);
      if(INDEX != -1){
        this.PURCHASES.splice(INDEX,1);
      }
    })
  }
}
