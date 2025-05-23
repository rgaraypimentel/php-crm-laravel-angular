import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TransportsService } from '../service/transports.service';

@Component({
  selector: 'app-delete-transports',
  templateUrl: './delete-transports.component.html',
  styleUrls: ['./delete-transports.component.scss']
})
export class DeleteTransportsComponent {
  @Output() DeleteTransport: EventEmitter<any> = new EventEmitter();
  @Input()  transport:any;

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
    this.transportService.deleteTransport(this.transport.id).subscribe((resp:any) => {
      console.log(resp);
      this.DeleteTransport.emit(resp);
      this.modal.close();
      this.toast.success("Exito","La eliminación se hizo correctamente");
    })
  }
}
