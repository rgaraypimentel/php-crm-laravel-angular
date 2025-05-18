import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SegmentClientComissionService } from '../../service/segment-client-comission.service';

@Component({
  selector: 'app-delete-segment-client-comission',
  templateUrl: './delete-segment-client-comission.component.html',
  styleUrls: ['./delete-segment-client-comission.component.scss']
})
export class DeleteSegmentClientComissionComponent {
  @Output() ClientSegmentComissionD: EventEmitter<any> = new EventEmitter();
  @Input()  SEGMENT_CLIENT_COMISSION_SELECTED:any;

  isLoading:any;
  constructor(
    public modal: NgbActiveModal,
    public segmentClientComissionService: SegmentClientComissionService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
  }

  delete(){

    this.segmentClientComissionService.deleteSegmentClientComision(this.SEGMENT_CLIENT_COMISSION_SELECTED.id).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","La configuración del segmento se elimino correctamente");
        this.ClientSegmentComissionD.emit(resp.message);
        this.modal.close();
      }
    })
  }
}
