import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SucursalDeliveriesService } from '../service/sucursal-deliveries.service';
import { CreateSucursalDeliverieComponent } from '../create-sucursal-deliverie/create-sucursal-deliverie.component';
import { EditSucursalDeliverieComponent } from '../edit-sucursal-deliverie/edit-sucursal-deliverie.component';
import { DeleteSucursalDeliverieComponent } from '../delete-sucursal-deliverie/delete-sucursal-deliverie.component';

@Component({
  selector: 'app-list-sucursal-deliverie',
  templateUrl: './list-sucursal-deliverie.component.html',
  styleUrls: ['./list-sucursal-deliverie.component.scss']
})
export class ListSucursalDeliverieComponent {
  search:string = '';
  SUCURSALES_DELIVERIES:any = [];
  isLoading$:any;

  totalPages:number = 0;
  currentPage:number = 1;
  constructor(
    public modalService: NgbModal,
    public sucursalDeliverieService: SucursalDeliveriesService,
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.sucursalDeliverieService.isLoading$;
    this.listSucursalDeliveries();
  }

  listSucursalDeliveries(page = 1){
    this.sucursalDeliverieService.listSucursalDeliveries(page,this.search).subscribe((resp:any) => {
      console.log(resp);
      this.SUCURSALES_DELIVERIES = resp.sucursal_deliveries;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage($event:any){
    this.listSucursalDeliveries($event);
  }

  createSucursalDeliverie(){
    const modalRef = this.modalService.open(CreateSucursalDeliverieComponent,{centered:true, size: 'md'});

    modalRef.componentInstance.SucursalC.subscribe((sucursal:any) => {
      this.SUCURSALES_DELIVERIES.unshift(sucursal);
    })
  }

  editSucursalDeliverie(SUCURSAL:any){
    const modalRef = this.modalService.open(EditSucursalDeliverieComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.SUCURSAL_SELECTED = SUCURSAL;

    modalRef.componentInstance.SucursalE.subscribe((sucursal:any) => {
      let INDEX = this.SUCURSALES_DELIVERIES.findIndex((sucurs:any) => sucurs.id == SUCURSAL.id);
      if(INDEX != -1){
        this.SUCURSALES_DELIVERIES[INDEX] = sucursal;
      }
    })
  }

  deleteSucursalDeliverie(SUCURSAL:any){
    const modalRef = this.modalService.open(DeleteSucursalDeliverieComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.SUCURSAL_SELECTED = SUCURSAL;

    modalRef.componentInstance.SucursalD.subscribe((sucursal:any) => {
      let INDEX = this.SUCURSALES_DELIVERIES.findIndex((sucurs:any) => sucurs.id == SUCURSAL.id);
      if(INDEX != -1){
        this.SUCURSALES_DELIVERIES.splice(INDEX,1);
      }
      // this.ROLES.unshift(role);
    })
  }
}
