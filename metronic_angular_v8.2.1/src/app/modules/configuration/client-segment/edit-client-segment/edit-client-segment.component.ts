import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientSegmentService } from '../service/client-segment.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-client-segment',
  templateUrl: './edit-client-segment.component.html',
  styleUrls: ['./edit-client-segment.component.scss']
})
export class EditClientSegmentComponent {
  @Output() ClientSegmentE: EventEmitter<any> = new EventEmitter();
  @Input() CLIENT_SEGMENT_SELECTED:any;
  
  name:string = '';
  address:string = '';
  state:number = 1;

  isLoading:any;

  constructor(
    public modal: NgbActiveModal,
    public clientsegmentService: ClientSegmentService,
    public toast: ToastrService,
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.name = this.CLIENT_SEGMENT_SELECTED.name;
    this.state = this.CLIENT_SEGMENT_SELECTED.state;
  }

  store(){
    if(!this.name){
      this.toast.error("Validación","El nombre del segmento es requerido");
      return false;
    }

    let data = {
      name: this.name,
      state: this.state,
    }

    this.clientsegmentService.updateClientSegment(this.CLIENT_SEGMENT_SELECTED.id,data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","l segmento se edito correctamente");
        this.ClientSegmentE.emit(resp.client_segment);
        this.modal.close();
      }
    })
  }
}
