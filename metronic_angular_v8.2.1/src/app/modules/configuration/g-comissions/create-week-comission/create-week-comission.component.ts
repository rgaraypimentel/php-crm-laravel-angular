import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { WeekComissionService } from '../service/week-comission.service';

@Component({
  selector: 'app-create-week-comission',
  templateUrl: './create-week-comission.component.html',
  styleUrls: ['./create-week-comission.component.scss']
})
export class CreateWeekComissionComponent {
  @Output() WeekComissionC: EventEmitter<any> = new EventEmitter();

  amount:number = 0;
  percentage:number = 0;
  week:string = '';

  address:string = '';

  isLoading:any;

  constructor(
    public modal: NgbActiveModal,
    public weekComissionService: WeekComissionService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }

  store(){
    if(!this.week){
      this.toast.error("Validación","La semana es requerida");
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
      week: this.week,
      amount: this.amount,
      percentage: this.percentage,
    }

    this.weekComissionService.registerWeekComision(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","La condición de comisión por semana se registro correctamente");
        this.WeekComissionC.emit(resp.week_commission);
        this.modal.close();
      }
    })
  }
}
