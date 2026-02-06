import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CategorieComissionService } from '../../service/categorie-comission.service';

@Component({
  selector: 'app-edit-categorie-comission',
  templateUrl: './edit-categorie-comission.component.html',
  styleUrls: ['./edit-categorie-comission.component.scss']
})
export class EditCategorieComissionComponent {
  @Output() CategorieComissionE: EventEmitter<any> = new EventEmitter();
  @Input() categorias:any = [];
  @Input() CATEGORIE_COMISSION_SELECTED:any;

  amount:number = 0;
  percentage:number = 0;
  product_categorie_id:string = '';

  address:string = '';

  isLoading:any;

  constructor(
    public modal: NgbActiveModal,
    public categorieComissionService: CategorieComissionService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.product_categorie_id = this.CATEGORIE_COMISSION_SELECTED.product_categorie_id;
    this.amount = this.CATEGORIE_COMISSION_SELECTED.amount;
    this.percentage = this.CATEGORIE_COMISSION_SELECTED.percentage;
  }

  store(){
    if(!this.product_categorie_id){
      this.toast.error("Validación","La categoria es requerida");
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
      product_categorie_id: this.product_categorie_id,
      amount: this.amount,
      percentage: this.percentage,
    }

    this.categorieComissionService.updateCategorieComision(this.CATEGORIE_COMISSION_SELECTED.id,data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","La condición de comisión por categoria se Edito correctamente");
        this.CategorieComissionE.emit(resp.categorie_commission);
        this.modal.close();
      }
    })
  }
}
