import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProvidersService } from '../service/providers.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-providers',
  templateUrl: './delete-providers.component.html',
  styleUrls: ['./delete-providers.component.scss']
})
export class DeleteProvidersComponent {
  @Output() ProviderD: EventEmitter<any> = new EventEmitter();
  @Input()  PROVIDER_SELECTED:any;

  isLoading:any;
  constructor(
    public modal: NgbActiveModal,
    public providersService: ProvidersService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
  }

  delete(){

    this.providersService.deleteProvider(this.PROVIDER_SELECTED.id).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","El proveedor se elimino correctamente");
        this.ProviderD.emit(resp.message);
        this.modal.close();
      }
    })
  }
}
