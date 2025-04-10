import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UnitsService } from '../service/units.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-units',
  templateUrl: './edit-units.component.html',
  styleUrls: ['./edit-units.component.scss']
})
export class EditUnitsComponent {
  @Output() UnitE: EventEmitter<any> = new EventEmitter();
  @Input() UNIT_SELECTED:any;
  name:string = '';
  description:string = '';
  state:number = 1;

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
    this.name = this.UNIT_SELECTED.name ;
    this.description = this.UNIT_SELECTED.description ;
    this.state = this.UNIT_SELECTED.state ;
  }

  store(){
    if(!this.name){
      this.toast.error("Validación","El nombre de la unidad es requerido");
      return false;
    }

    let data = {
      name: this.name,
      description: this.description,
      state: this.state,
    }

    this.unitService.updateUnit(this.UNIT_SELECTED.id,data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","La unidad se edito correctamente");
        this.UnitE.emit(resp.unit);
        this.modal.close();
      }
    })
  }
}
