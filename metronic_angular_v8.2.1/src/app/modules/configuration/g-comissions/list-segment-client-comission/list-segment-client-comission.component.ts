import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SegmentClientComissionService } from '../service/segment-client-comission.service';
import { CreateSegmentClientComissionComponent } from './create-segment-client-comission/create-segment-client-comission.component';
import { DeleteSegmentClientComissionComponent } from './delete-segment-client-comission/delete-segment-client-comission.component';
import { EditSegmentClientComissionComponent } from './edit-segment-client-comission/edit-segment-client-comission.component';

@Component({
  selector: 'app-list-segment-client-comission',
  templateUrl: './list-segment-client-comission.component.html',
  styleUrls: ['./list-segment-client-comission.component.scss']
})
export class ListSegmentClientComissionComponent {

  search:string = '';
  CLIENTE_SEGMENT_COMISSIONS:any = [];
  isLoading$:any;
  client_segments:any = [];
  totalPages:number = 0;
  currentPage:number = 1;
  constructor(
    public modalService: NgbModal,
    public segmentClientComissionService: SegmentClientComissionService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.segmentClientComissionService.isLoading$;
    this.listSegmentClientComision();
  }

  listSegmentClientComision(page = 1){
    this.segmentClientComissionService.listSegmentClientComision(page,this.search).subscribe((resp:any) => {
      console.log(resp);
      this.CLIENTE_SEGMENT_COMISSIONS = resp.client_segment_commissions;
      this.client_segments = resp.client_segments;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage($event:any){
    this.listSegmentClientComision($event);
  }

  createSegmentClientComission(){
    const modalRef = this.modalService.open(CreateSegmentClientComissionComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.client_segments = this.client_segments

    modalRef.componentInstance.ClientSegmentComissionC.subscribe((segment_client_comission:any) => {
      this.CLIENTE_SEGMENT_COMISSIONS.unshift(segment_client_comission);
    })
  }

  editSegmentClientComission(SEGMENT_CLIENT_COMISSION:any){
    const modalRef = this.modalService.open(EditSegmentClientComissionComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.SEGMENT_CLIENT_COMISSION_SELECTED = SEGMENT_CLIENT_COMISSION;
    modalRef.componentInstance.client_segments = this.client_segments

    modalRef.componentInstance.ClientSegmentComissionE.subscribe((segment_client_comission:any) => {
      let INDEX = this.CLIENTE_SEGMENT_COMISSIONS.findIndex((client_segment_comss:any) => client_segment_comss.id == SEGMENT_CLIENT_COMISSION.id);
      if(INDEX != -1){
        this.CLIENTE_SEGMENT_COMISSIONS[INDEX] = segment_client_comission;
      }
    })
  }

  deleteSegmentClientComission(SEGMENT_CLIENT_COMISSION:any){
    const modalRef = this.modalService.open(DeleteSegmentClientComissionComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.SEGMENT_CLIENT_COMISSION_SELECTED = SEGMENT_CLIENT_COMISSION;

    modalRef.componentInstance.ClientSegmentComissionD.subscribe((segment_client_comission:any) => {
      let INDEX = this.CLIENTE_SEGMENT_COMISSIONS.findIndex((client_segment_comss:any) => client_segment_comss.id == SEGMENT_CLIENT_COMISSION.id);
      if(INDEX != -1){
        this.CLIENTE_SEGMENT_COMISSIONS.splice(INDEX,1);
      }
      // this.ROLES.unshift(role);
    })
  }
}
