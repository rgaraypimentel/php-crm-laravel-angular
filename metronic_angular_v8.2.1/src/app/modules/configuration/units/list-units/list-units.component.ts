import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UnitsService } from '../service/units.service';
import { CreateUnitsComponent } from '../create-units/create-units.component';
import { EditUnitsComponent } from '../edit-units/edit-units.component';
import { DeleteUnitsComponent } from '../delete-units/delete-units.component';
import { CreateTransformsUnitsComponent } from '../create-transforms-units/create-transforms-units.component';

@Component({
  selector: 'app-list-units',
  templateUrl: './list-units.component.html',
  styleUrls: ['./list-units.component.scss']
})
export class ListUnitsComponent {
  search:string = '';
  UNITS:any = [];
  isLoading$:any;

  totalPages:number = 0;
  currentPage:number = 1;
  constructor(
    public modalService: NgbModal,
    public unitsService: UnitsService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.unitsService.isLoading$;
    this.listUnits();
  }

  listUnits(page = 1){
    this.unitsService.listUnits(page,this.search).subscribe((resp:any) => {
      console.log(resp);
      this.UNITS = resp.units;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage($event:any){
    this.listUnits($event);
  }

  createUnit(){
    const modalRef = this.modalService.open(CreateUnitsComponent,{centered:true, size: 'md'});

    modalRef.componentInstance.UnitC.subscribe((UNIT:any) => {
      this.UNITS.unshift(UNIT);
    })
  }

  edieUnit(UNIT:any){
    const modalRef = this.modalService.open(EditUnitsComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.UNIT_SELECTED = UNIT;

    modalRef.componentInstance.UnitE.subscribe((unit_e:any) => {
      let INDEX = this.UNITS.findIndex((unit_s:any) => unit_s.id == UNIT.id);
      if(INDEX != -1){
        this.UNITS[INDEX] = unit_e;
      }
    })
  }

  deleteUnit(UNIT:any){
    const modalRef = this.modalService.open(DeleteUnitsComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.UNIT_SELECTED = UNIT;

    modalRef.componentInstance.UnitD.subscribe((unit_s:any) => {
      let INDEX = this.UNITS.findIndex((unit_selec:any) => unit_selec.id == UNIT.id);
      if(INDEX != -1){
        this.UNITS.splice(INDEX,1);
      }
      // this.ROLES.unshift(role);
    })
  }

  addTransform(UNIT:any){
    const modalRef = this.modalService.open(CreateTransformsUnitsComponent,{centered:true,size: 'md'});
    modalRef.componentInstance.UNIT_SELECTED = UNIT;
    modalRef.componentInstance.UNITS = this.UNITS.filter((unit:any) => unit.id != UNIT.id);
  }
}
