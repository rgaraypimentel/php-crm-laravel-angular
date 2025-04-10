import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UnitsService } from '../service/units.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-units',
  templateUrl: './delete-units.component.html',
  styleUrls: ['./delete-units.component.scss']
})
export class DeleteUnitsComponent {
  @Output() UnitD: EventEmitter<any> = new EventEmitter();
  @Input()  UNIT_SELECTED:any;

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

    this.unitService.deleteUnit(this.UNIT_SELECTED.id).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","La unidad se elimino correctamente");
        this.UnitD.emit(resp.message);
        this.modal.close();
      }
    })
  }
}
