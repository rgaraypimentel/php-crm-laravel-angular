import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ClientsService } from '../service/clients.service';

@Component({
  selector: 'app-import-clients',
  templateUrl: './import-clients.component.html',
  styleUrls: ['./import-clients.component.scss']
})
export class ImportClientsComponent {
  @Output() importClient: EventEmitter<any> = new EventEmitter();

  isLoading:any;

  file_excel:any;
  nameArchivo: string = '';
  constructor(
    public modal: NgbActiveModal,
    public clientService: ClientsService,
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
      // Aquí se mostrara el nombre del archivo seleccionado
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

    this.clientService.importClient(formData).subscribe((resp:any) => {
      console.log(resp);
        this.toast.success("Exito","Los clientes han sido importados exitosamente");
        this.importClient.emit(resp.message);
        this.modal.close();
    },error => {
      console.log(error);
    })
  }
}
