import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DespachoService } from '../service/despacho.service';

@Component({
  selector: 'app-detail-contracts-despacho',
  templateUrl: './detail-contracts-despacho.component.html',
  styleUrls: ['./detail-contracts-despacho.component.scss']
})
export class DetailContractsDespachoComponent {

  @Input() CONTRACT:any;
  @Input() warehouses:any = [];
  @Output() ProductProcess:EventEmitter<any> = new EventEmitter();

  detail_selected:any = [];
  warehouse_id:string = '';
  constructor(
    public modal: NgbActiveModal,
    public despachoService: DespachoService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  selectedDetail(DETAIL_PROFORMA:any){
    let INDEX = this.detail_selected.findIndex((item:any) => item == DETAIL_PROFORMA.id);
    if(INDEX != -1){
      this.detail_selected.splice(INDEX,1);
    }else{
      this.detail_selected.push(DETAIL_PROFORMA.id);
    }
    console.log(this.detail_selected);
  }

  processEntrega(){
    if(this.detail_selected.length == 0){
      this.toast.error("Validación","Necesitas seleccionar al menos un producto");
      return;
    }
    if(!this.warehouse_id){
      this.toast.error("Validación","Es requerido seleccionar un almacen");
      return;
    }
    let data = {
      warehouse_id: this.warehouse_id,
      detail_selected: this.detail_selected,
      proforma_id: this.CONTRACT.id,
    }
    this.despachoService.processEntrega(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        resp.validations.forEach((validation:any) => {
          this.toast.error("Validación",validation);
        });
      }else{
        this.toast.success("Exitoso","Los productos se han entregado correctamente");
        this.ProductProcess.emit("");
        this.modal.close();
      }
    })
  }

}
