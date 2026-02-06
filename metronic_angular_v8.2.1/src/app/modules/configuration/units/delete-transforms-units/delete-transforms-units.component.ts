import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UnitsService } from '../service/units.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-transforms-units',
  templateUrl: './delete-transforms-units.component.html',
  styleUrls: ['./delete-transforms-units.component.scss']
})
export class DeleteTransformsUnitsComponent {
  @Output() UnitD: EventEmitter<any> = new EventEmitter();
  @Input()  TRANSFORM_SELECTED:any;

  isLoading:any;
  constructor(
    public modal: NgbActiveModal,
    public unitService: UnitsService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
  }

  delete(){

    this.unitService.deleteUnitTransform(this.TRANSFORM_SELECTED.id).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","La unidad de transformación se elimino correctamente");
        this.UnitD.emit(resp.message);
        this.modal.close();
      }
    })
  }
}
