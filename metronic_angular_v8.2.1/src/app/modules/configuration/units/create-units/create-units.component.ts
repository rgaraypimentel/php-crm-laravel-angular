import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UnitsService } from '../service/units.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-units',
  templateUrl: './create-units.component.html',
  styleUrls: ['./create-units.component.scss']
})
export class CreateUnitsComponent {
  @Output() UnitC: EventEmitter<any> = new EventEmitter();
  name:string = '';
  description:string = '';

  isLoading:any;

  constructor(
    public modal: NgbActiveModal,
    public unitService: UnitsService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }

  store(){
    if(!this.name){
      this.toast.error("Validación","El nombre de la unidad es requerido");
      return false;
    }

    let data = {
      name: this.name,
      description: this.description,
      state: 1,
    }

    this.unitService.registerUnit(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","La unidad se registro correctamente");
        this.UnitC.emit(resp.unit);
        this.modal.close();
      }
    })
  }
}
