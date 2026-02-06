import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProformasService } from '../service/proformas.service';

@Component({
  selector: 'app-delete-proforma',
  templateUrl: './delete-proforma.component.html',
  styleUrls: ['./delete-proforma.component.scss']
})
export class DeleteProformaComponent {
  @Output() ProformasD: EventEmitter<any> = new EventEmitter();
  @Input()  proforma_selected:any;

  isLoading:any;
  constructor(
    public modal: NgbActiveModal,
    public proformaService: ProformasService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
  }

  delete(){

    this.proformaService.deleteProforma(this.proforma_selected.id).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","La proforma se elimino correctamente");
        this.ProformasD.emit(resp.message);
        this.modal.close();
      }
    })
  }
}
