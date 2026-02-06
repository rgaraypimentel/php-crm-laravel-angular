import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from '../service/products.service';

@Component({
  selector: 'app-import-products',
  templateUrl: './import-products.component.html',
  styleUrls: ['./import-products.component.scss']
})
export class ImportProductsComponent {

  @Output() ImportProductD: EventEmitter<any> = new EventEmitter();
  name:string = '';
  address:string = '';
  nameArchivo: string = '';

  isLoading:any;

  file_excel:any;
  constructor(
    public modal: NgbActiveModal,
    public productService: ProductsService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }

  processFile($event:any){
    this.file_excel = $event.target.files[0];
    if (this.file_excel) {
      this.nameArchivo = this.file_excel.name;
      // Aquí puedes procesarlo como desees
      console.log('Archivo seleccionado:', this.file_excel);
    }
  }
  store(){
    if(!this.file_excel){
      this.toast.error("Validación","EL ARCHIVO ES REQUERIDO");
      return false;
    }

    let formData = new FormData();
    formData.append("import_file",this.file_excel);

    this.productService.importProduct(formData).subscribe((resp:any) => {
      console.log(resp);
        this.toast.success("Exito","Los productos han sido importados exitosamente");
        this.ImportProductD.emit(resp.message);
        this.modal.close();
    },error => {
      console.log(error);
    })
  }

}
