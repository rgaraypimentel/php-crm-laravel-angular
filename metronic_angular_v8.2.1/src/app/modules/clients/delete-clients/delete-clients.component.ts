import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ClientsService } from '../service/clients.service';

@Component({
  selector: 'app-delete-clients',
  templateUrl: './delete-clients.component.html',
  styleUrls: ['./delete-clients.component.scss']
})
export class DeleteClientsComponent {
  @Output() ClientsD: EventEmitter<any> = new EventEmitter();
  @Input()  client_selected:any;

  isLoading:any;
  constructor(
    public modal: NgbActiveModal,
    public clientsService: ClientsService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
  }

  delete(){

    this.clientsService.deleteClient(this.client_selected.id).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","El cliente se elimino correctamente");
        this.ClientsD.emit(resp.message);
        this.modal.close();
      }
    })
  }
}
