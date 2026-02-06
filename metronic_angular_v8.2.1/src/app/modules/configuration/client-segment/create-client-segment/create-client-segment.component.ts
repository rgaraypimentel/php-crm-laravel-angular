import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ClientSegmentService } from '../service/client-segment.service';

@Component({
  selector: 'app-create-client-segment',
  templateUrl: './create-client-segment.component.html',
  styleUrls: ['./create-client-segment.component.scss']
})
export class CreateClientSegmentComponent {
  @Output() ClientSegmentC: EventEmitter<any> = new EventEmitter();
  name:string = '';
  address:string = '';

  isLoading:any;

  constructor(
    public modal: NgbActiveModal,
    public clientSegmentService: ClientSegmentService,
    public toast: ToastrService,
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }

  store(){
    if(!this.name){
      this.toast.error("Validación","El nombre del segmento es requerido");
      return false;
    }

    let data = {
      name: this.name,
    }

    this.clientSegmentService.registerClientSegment(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","El segmento se registro correctamente");
        this.ClientSegmentC.emit(resp.client_segment);
        this.modal.close();
      }
    })
  }
}
