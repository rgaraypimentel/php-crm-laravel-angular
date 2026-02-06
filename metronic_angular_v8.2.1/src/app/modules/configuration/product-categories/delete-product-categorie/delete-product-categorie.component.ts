import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductCategoriesService } from '../service/product-categories.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-product-categorie',
  templateUrl: './delete-product-categorie.component.html',
  styleUrls: ['./delete-product-categorie.component.scss']
})
export class DeleteProductCategorieComponent {
  @Output() ProductCategorieD: EventEmitter<any> = new EventEmitter();
  @Input()  CATEGORIE_SELECTED:any;

  isLoading:any;
  constructor(
    public modal: NgbActiveModal,
    public productCategorieService: ProductCategoriesService,
    public toast: ToastrService,
  ) {
    
  }

  ngOnInit(): void {
  }

  delete(){
    
    this.productCategorieService.deleteProductCategorie(this.CATEGORIE_SELECTED.id).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","La categoria se elimino correctamente");
        this.ProductCategorieD.emit(resp.message);
        this.modal.close();
      }
    })
  }
}
