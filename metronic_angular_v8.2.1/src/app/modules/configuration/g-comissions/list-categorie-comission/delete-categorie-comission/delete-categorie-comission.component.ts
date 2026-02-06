import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CategorieComissionService } from '../../service/categorie-comission.service';

@Component({
  selector: 'app-delete-categorie-comission',
  templateUrl: './delete-categorie-comission.component.html',
  styleUrls: ['./delete-categorie-comission.component.scss']
})
export class DeleteCategorieComissionComponent {
  @Output() CategorieComissionD: EventEmitter<any> = new EventEmitter();
  @Input()  CATEGORIE_COMISSION_SELECTED:any;

  isLoading:any;
  constructor(
    public modal: NgbActiveModal,
    public categorieComissionService: CategorieComissionService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
  }

  delete(){

    this.categorieComissionService.deleteCategorieComision(this.CATEGORIE_COMISSION_SELECTED.id).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","La configuración de la categoria se elimino correctamente");
        this.CategorieComissionD.emit(resp.message);
        this.modal.close();
      }
    })
  }
}
