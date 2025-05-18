import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PositionComissionService } from '../../service/position-comission.service';

@Component({
  selector: 'app-edit-position-comission',
  templateUrl: './edit-position-comission.component.html',
  styleUrls: ['./edit-position-comission.component.scss']
})
export class EditPositionComissionComponent {

  @Output() PositionComissionE: EventEmitter<any> = new EventEmitter();
  @Input() POSITION_COMISSION_SELECTED:any;

  amount:number = 0;
  percentage:number = 0;
  position:string = '';

  address:string = '';

  isLoading:any;

  constructor(
    public modal: NgbActiveModal,
    public positionComissionService: PositionComissionService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.position = this.POSITION_COMISSION_SELECTED.position;
    this.percentage = this.POSITION_COMISSION_SELECTED.percentage;
  }

  store(){
    if(!this.position){
      this.toast.error("Validación","La posición es requerida");
      return false;
    }

    if(!this.percentage){
      this.toast.error("Validación","El porcentaje de comisión es requerido");
      return false;
    }

    let data = {
      position: this.position,
      percentage: this.percentage,
    }

    this.positionComissionService.updatePositionComision(this.POSITION_COMISSION_SELECTED.id,data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","La condición de comisión por posición se registro correctamente");
        this.PositionComissionE.emit(resp.position_commission);
        this.modal.close();
      }
    })
  }
}
