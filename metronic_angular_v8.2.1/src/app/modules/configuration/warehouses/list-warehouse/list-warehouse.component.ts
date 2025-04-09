import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WarehouseService } from '../service/warehouse.service';
import { CreateWarehouseComponent } from '../create-warehouse/create-warehouse.component';
import { EditWarehouseComponent } from '../edit-warehouse/edit-warehouse.component';
import { DeleteWarehouseComponent } from '../delete-warehouse/delete-warehouse.component';

@Component({
  selector: 'app-list-warehouse',
  templateUrl: './list-warehouse.component.html',
  styleUrls: ['./list-warehouse.component.scss']
})
export class ListWarehouseComponent {
  search:string = '';
  WAREHOUSES:any = [];
  SUCURSALES:any = [];
  isLoading$:any;

  totalPages:number = 0;
  currentPage:number = 1;
  constructor(
    public modalService: NgbModal,
    public warehouseService: WarehouseService,
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.warehouseService.isLoading$;
    this.listWarehouses();
  }

  listWarehouses(page = 1){
    this.warehouseService.listWarehouses(page,this.search).subscribe((resp:any) => {
      console.log(resp);
      this.WAREHOUSES = resp.warehouses;
      this.totalPages = resp.total;
      this.currentPage = page;
      this.SUCURSALES = resp.sucursales;
    })
  }

  loadPage($event:any){
    this.listWarehouses($event);
  }

  createWarehouse(){
    const modalRef = this.modalService.open(CreateWarehouseComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.SUCURSALES = this.SUCURSALES;

    modalRef.componentInstance.WareHouseC.subscribe((warehouse:any) => {
      this.WAREHOUSES.unshift(warehouse);
    })
  }

  editWarehouse(WAREHOUSE:any){
    const modalRef = this.modalService.open(EditWarehouseComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.WAREHOUSE_SELECTED = WAREHOUSE;
    modalRef.componentInstance.SUCURSALES = this.SUCURSALES;

    modalRef.componentInstance.WareHouseE.subscribe((warehouse:any) => {
      let INDEX = this.WAREHOUSES.findIndex((sucurs:any) => sucurs.id == WAREHOUSE.id);
      if(INDEX != -1){
        this.WAREHOUSES[INDEX] = warehouse;
      }
    })
  }

  deleteWarehouse(WAREHOUSE:any){
    const modalRef = this.modalService.open(DeleteWarehouseComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.WAREHOUSE_SELECTED = WAREHOUSE;

    modalRef.componentInstance.WareHouseD.subscribe((sucursal:any) => {
      let INDEX = this.WAREHOUSES.findIndex((sucurs:any) => sucurs.id == WAREHOUSE.id);
      if(INDEX != -1){
        this.WAREHOUSES.splice(INDEX,1);
      }
    })
  }
}
