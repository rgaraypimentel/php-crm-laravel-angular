import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { WeekComissionService } from '../service/week-comission.service';

@Component({
  selector: 'app-delete-week-comission',
  templateUrl: './delete-week-comission.component.html',
  styleUrls: ['./delete-week-comission.component.scss']
})
export class DeleteWeekComissionComponent {
  @Output() WeekComissionD: EventEmitter<any> = new EventEmitter();
  @Input()  WEEK_COMISSION_SELECTED:any;

  isLoading:any;
  constructor(
    public modal: NgbActiveModal,
    public weekComissionService: WeekComissionService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
  }

  delete(){

    this.weekComissionService.deleteWeekComision(this.WEEK_COMISSION_SELECTED.id).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","La comisión por semana se elimino correctamente");
        this.WeekComissionD.emit(resp.message);
        this.modal.close();
      }
    })
  }
}
