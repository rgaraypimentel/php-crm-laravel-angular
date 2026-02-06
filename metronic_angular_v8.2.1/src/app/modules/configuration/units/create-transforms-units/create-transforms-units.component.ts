import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UnitsService } from '../service/units.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteTransformsUnitsComponent } from '../delete-transforms-units/delete-transforms-units.component';

@Component({
  selector: 'app-create-transforms-units',
  templateUrl: './create-transforms-units.component.html',
  styleUrls: ['./create-transforms-units.component.scss']
})
export class CreateTransformsUnitsComponent {
  // @Output() UnitC: EventEmitter<any> = new EventEmitter();
  @Input() UNIT_SELECTED:any;
  @Input() UNITS:any = [];
  unit_to_id:string = '';

  isLoading:any;

  constructor(
    public modal: NgbActiveModal,
    public unitService: UnitsService,
    public toast: ToastrService,
    public modalService: NgbModal,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }

  store(){
    if(!this.unit_to_id){
      this.toast.error("Validación","La unidad es requerido");
      return false;
    }

    let data = {
      unit_id: this.UNIT_SELECTED.id,
      unit_to_id : this.unit_to_id,
    }

    this.unitService.registerUnitTransform(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","La unidad se registro correctamente");
        // this.UnitC.emit(resp.unit);
        this.UNIT_SELECTED.transforms.unshift(resp.unit);
        // this.modal.close();
      }
    })
  }

  removeUnitTransform(transform:any){
    const modalRef = this.modalService.open(DeleteTransformsUnitsComponent,{centered:true, size: 'sm'});
    modalRef.componentInstance.TRANSFORM_SELECTED = transform;

    modalRef.componentInstance.UnitD.subscribe((unit_s:any) => {
      let INDEX = this.UNIT_SELECTED.transforms.findIndex((unit_selec:any) => unit_selec.id == transform.id);
      if(INDEX != -1){
        this.UNIT_SELECTED.transforms.splice(INDEX,1);
      }
      // this.ROLES.unshift(role);
    })
  }
}
