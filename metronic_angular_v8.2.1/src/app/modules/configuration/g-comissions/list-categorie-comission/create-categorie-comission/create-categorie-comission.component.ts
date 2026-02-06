import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CategorieComissionService } from '../../service/categorie-comission.service';

@Component({
  selector: 'app-create-categorie-comission',
  templateUrl: './create-categorie-comission.component.html',
  styleUrls: ['./create-categorie-comission.component.scss']
})
export class CreateCategorieComissionComponent {
  @Output() CategorieComissionC: EventEmitter<any> = new EventEmitter();
  @Input() categorias:any = [];

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

    this.categorieComissionService.registerCategorieComision(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","La condición de comisión por categoria se registro correctamente");
        this.CategorieComissionC.emit(resp.categorie_commission);
        this.modal.close();
      }
    })
  }
}
