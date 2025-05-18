import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PositionComissionService } from '../../service/position-comission.service';

@Component({
  selector: 'app-delete-position-comission',
  templateUrl: './delete-position-comission.component.html',
  styleUrls: ['./delete-position-comission.component.scss']
})
export class DeletePositionComissionComponent {

  @Output() PositionComissionD: EventEmitter<any> = new EventEmitter();
  @Input()  POSITION_COMISSION_SELECTED:any;

  isLoading:any;
  constructor(
    public modal: NgbActiveModal,
    public positionComissionService: PositionComissionService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
  }

  delete(){

    this.positionComissionService.deletePositionComision(this.POSITION_COMISSION_SELECTED.id).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","La comisión por posición se elimino correctamente");
        this.PositionComissionD.emit(resp.message);
        this.modal.close();
      }
    })
  }
}
