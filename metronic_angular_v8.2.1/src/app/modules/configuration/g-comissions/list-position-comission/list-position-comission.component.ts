import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PositionComissionService } from '../service/position-comission.service';
import { CreatePositionComissionComponent } from './create-position-comission/create-position-comission.component';
import { DeletePositionComissionComponent } from './delete-position-comission/delete-position-comission.component';
import { EditPositionComissionComponent } from './edit-position-comission/edit-position-comission.component';

@Component({
  selector: 'app-list-position-comission',
  templateUrl: './list-position-comission.component.html',
  styleUrls: ['./list-position-comission.component.scss']
})
export class ListPositionComissionComponent {

  search:string = '';
  POSITION_COMISSIONS:any = [];
  isLoading$:any;

  totalPages:number = 0;
  currentPage:number = 1;
  constructor(
    public modalService: NgbModal,
    public positionComisionService: PositionComissionService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.positionComisionService.isLoading$;
    this.listPositionComisions();
  }

  listPositionComisions(page = 1){
    this.positionComisionService.listPositionComisions(page,this.search).subscribe((resp:any) => {
      console.log(resp);
      this.POSITION_COMISSIONS = resp.position_commissions;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage($event:any){
    this.listPositionComisions($event);
  }

  createPositionComision(){
    const modalRef = this.modalService.open(CreatePositionComissionComponent,{centered:true, size: 'md'});

    modalRef.componentInstance.PositionComissionC.subscribe((position_comission:any) => {
      this.POSITION_COMISSIONS.unshift(position_comission);
    })
  }

  editPositionComision(POSITION_COMISSION:any){
    const modalRef = this.modalService.open(EditPositionComissionComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.POSITION_COMISSION_SELECTED = POSITION_COMISSION;

    modalRef.componentInstance.PositionComissionE.subscribe((position_comission:any) => {
      let INDEX = this.POSITION_COMISSIONS.findIndex((position_comss:any) => position_comss.id == POSITION_COMISSION.id);
      if(INDEX != -1){
        this.POSITION_COMISSIONS[INDEX] = position_comission;
      }
    })
  }

  deletePositionComision(POSITION_COMISSION:any){
    const modalRef = this.modalService.open(DeletePositionComissionComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.POSITION_COMISSION_SELECTED = POSITION_COMISSION;

    modalRef.componentInstance.PositionComissionD.subscribe((position_comission:any) => {
      let INDEX = this.POSITION_COMISSIONS.findIndex((position_comss:any) => position_comss.id == POSITION_COMISSION.id);
      if(INDEX != -1){
        this.POSITION_COMISSIONS.splice(INDEX,1);
      }
      // this.ROLES.unshift(role);
    })
  }
}
