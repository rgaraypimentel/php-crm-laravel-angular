import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateWeekComissionComponent } from '../create-week-comission/create-week-comission.component';
import { DeleteWeekComissionComponent } from '../delete-week-comission/delete-week-comission.component';
import { EditWeekComissionComponent } from '../edit-week-comission/edit-week-comission.component';
import { WeekComissionService } from '../service/week-comission.service';

@Component({
  selector: 'app-list-week-comission',
  templateUrl: './list-week-comission.component.html',
  styleUrls: ['./list-week-comission.component.scss']
})
export class ListWeekComissionComponent {
  search:string = '';
  WEEK_COMISSIONS:any = [];
  isLoading$:any;

  totalPages:number = 0;
  currentPage:number = 1;
  constructor(
    public modalService: NgbModal,
    public weekComisionService: WeekComissionService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.weekComisionService.isLoading$;
    this.listWeekComisions();
  }

  listWeekComisions(page = 1){
    this.weekComisionService.listWeekComisions(page,this.search).subscribe((resp:any) => {
      console.log(resp);
      this.WEEK_COMISSIONS = resp.week_commissions;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage($event:any){
    this.listWeekComisions($event);
  }

  createWeekComision(){
    const modalRef = this.modalService.open(CreateWeekComissionComponent,{centered:true, size: 'md'});

    modalRef.componentInstance.WeekComissionC.subscribe((week_comission:any) => {
      this.WEEK_COMISSIONS.unshift(week_comission);
    })
  }

  editWeekComision(WEEK_COMISSION:any){
    const modalRef = this.modalService.open(EditWeekComissionComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.WEEK_COMISSION_SELECTED = WEEK_COMISSION;

    modalRef.componentInstance.WeekComissionE.subscribe((week_comission:any) => {
      let INDEX = this.WEEK_COMISSIONS.findIndex((week_comss:any) => week_comss.id == WEEK_COMISSION.id);
      if(INDEX != -1){
        this.WEEK_COMISSIONS[INDEX] = week_comission;
      }
    })
  }

  deleteWeekComision(WEEK_COMISSION:any){
    const modalRef = this.modalService.open(DeleteWeekComissionComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.WEEK_COMISSION_SELECTED = WEEK_COMISSION;

    modalRef.componentInstance.WeekComissionD.subscribe((week_comission:any) => {
      let INDEX = this.WEEK_COMISSIONS.findIndex((week_comss:any) => week_comss.id == WEEK_COMISSION.id);
      if(INDEX != -1){
        this.WEEK_COMISSIONS.splice(INDEX,1);
      }
      // this.ROLES.unshift(role);
    })
  }
}
