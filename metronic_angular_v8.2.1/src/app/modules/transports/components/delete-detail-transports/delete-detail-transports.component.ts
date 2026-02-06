import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TransportsService } from '../../service/transports.service';

@Component({
  selector: 'app-delete-detail-transports',
  templateUrl: './delete-detail-transports.component.html',
  styleUrls: ['./delete-detail-transports.component.scss']
})
export class DeleteDetailTransportsComponent {
  @Output() DeleteItemTransport: EventEmitter<any> = new EventEmitter();
  @Input()  detail_transport:any;
  @Input() importe:number = 0;
  @Input() is_edit:any = null;
  @Input() transport_id:any = null;
  @Input()  index:any;

  isLoading:any;
  constructor(
    public modal: NgbActiveModal,
    public toast: ToastrService,
    public transportService: TransportsService,
  ) {

  }

  ngOnInit(): void {
  }

  delete(){
    if(this.is_edit == 1){
      let NUEVO_IMPORTE = Number((this.importe - this.detail_transport.total).toFixed(2));
      let NUEVO_IGV = Number((NUEVO_IMPORTE*0.18).toFixed(2));
      this.transportService.deleteTransportDetail(this.detail_transport.id,NUEVO_IMPORTE+NUEVO_IGV,NUEVO_IMPORTE,NUEVO_IGV,this.transport_id).subscribe((resp:any) => {
        console.log(resp);
        this.DeleteItemTransport.emit(resp);
        this.modal.close();
        this.toast.success("Exito","La eliminación se hizo correctamente");
      })
    }else{
      this.DeleteItemTransport.emit("");
      this.modal.close();
      this.toast.success("Exito","La eliminación se hizo correctamente");
    }

  }
}
