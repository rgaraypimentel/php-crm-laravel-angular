import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ConversionService } from '../service/conversion.service';

@Component({
  selector: 'app-delete-conversion',
  templateUrl: './delete-conversion.component.html',
  styleUrls: ['./delete-conversion.component.scss']
})
export class DeleteConversionComponent {

  @Output() DeleteConversion: EventEmitter<any> = new EventEmitter();
  @Input()  conversion:any;

  isLoading:any;
  constructor(
    public modal: NgbActiveModal,
    public toast: ToastrService,
    public conversionService: ConversionService,
  ) {

  }

  ngOnInit(): void {
  }

  delete(){
    this.conversionService.deleteConversion(this.conversion.id).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Exito",resp.message_text);
      }else{
        this.DeleteConversion.emit(resp);
        this.modal.close();
        this.toast.success("Exito","La eliminación se hizo correctamente");
      }
    })
  }

}
