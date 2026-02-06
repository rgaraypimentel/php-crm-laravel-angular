import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SegmentClientComissionService } from '../../service/segment-client-comission.service';

@Component({
  selector: 'app-edit-segment-client-comission',
  templateUrl: './edit-segment-client-comission.component.html',
  styleUrls: ['./edit-segment-client-comission.component.scss']
})
export class EditSegmentClientComissionComponent {

  @Output() ClientSegmentComissionE: EventEmitter<any> = new EventEmitter();
  @Input() client_segments:any = [];
  @Input() SEGMENT_CLIENT_COMISSION_SELECTED:any;

  amount:number = 0;
  percentage:number = 0;
  client_segment_id:string = '';

  address:string = '';

  isLoading:any;

  constructor(
    public modal: NgbActiveModal,
    public segmentClientComissionService: SegmentClientComissionService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.amount = this.SEGMENT_CLIENT_COMISSION_SELECTED.amount;
    this.percentage = this.SEGMENT_CLIENT_COMISSION_SELECTED.percentage;
    this.client_segment_id = this.SEGMENT_CLIENT_COMISSION_SELECTED.client_segment_id;
  }

  store(){
    if(!this.client_segment_id){
      this.toast.error("Validación","El segmento de cliente es requerida");
      return false;
    }

    if(!this.amount){
      this.toast.error("Validación","El monto es requerido");
      return false;
    }

    if(!this.percentage){
      this.toast.error("Validación","El porcentaje de comisión es requerido");
      return false;
    }

    let data = {
      client_segment_id: this.client_segment_id,
      amount: this.amount,
      percentage: this.percentage,
    }

    this.segmentClientComissionService.updateSegmentClientComision(this.SEGMENT_CLIENT_COMISSION_SELECTED.id,data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","La condición de comisión por segmento de cliente se edito correctamente");
        this.ClientSegmentComissionE.emit(resp.client_segment_commission);
        this.modal.close();
      }
    })
  }
}
