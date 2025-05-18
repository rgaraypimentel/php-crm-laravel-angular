import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SegmentClientComissionService } from '../../service/segment-client-comission.service';

@Component({
  selector: 'app-create-segment-client-comission',
  templateUrl: './create-segment-client-comission.component.html',
  styleUrls: ['./create-segment-client-comission.component.scss']
})
export class CreateSegmentClientComissionComponent {

  @Output() ClientSegmentComissionC: EventEmitter<any> = new EventEmitter();
  @Input() client_segments:any = [];

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

    this.segmentClientComissionService.registerSegmentClientComision(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","La condición de comisión por segmento de cliente se registro correctamente");
        this.ClientSegmentComissionC.emit(resp.client_segment_commission);
        this.modal.close();
      }
    })
  }
}
