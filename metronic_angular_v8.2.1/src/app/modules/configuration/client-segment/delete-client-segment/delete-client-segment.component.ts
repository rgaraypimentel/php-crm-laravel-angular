import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ClientSegmentService } from '../service/client-segment.service';

@Component({
  selector: 'app-delete-client-segment',
  templateUrl: './delete-client-segment.component.html',
  styleUrls: ['./delete-client-segment.component.scss']
})
export class DeleteClientSegmentComponent {
    @Output() ClientSegmentD: EventEmitter<any> = new EventEmitter();
    @Input()  CLIENT_SEGMENT_SELECTED:any;

    isLoading:any;
    constructor(
      public modal: NgbActiveModal,
      public clientSegmentService: ClientSegmentService,
      public toast: ToastrService,
    ) {
      
    }

    ngOnInit(): void {
    }

    delete(){
      
      this.clientSegmentService.deleteClientSegment(this.CLIENT_SEGMENT_SELECTED.id).subscribe((resp:any) => {
        console.log(resp);
        if(resp.message == 403){
          this.toast.error("Validación",resp.message_text);
        }else{
          this.toast.success("Exito","El segmento se elimino correctamente");
          this.ClientSegmentD.emit(resp.message);
          this.modal.close();
        }
      })
  }
}
