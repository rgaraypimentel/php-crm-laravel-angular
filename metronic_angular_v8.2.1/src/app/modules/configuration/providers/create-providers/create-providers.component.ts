import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProvidersService } from '../service/providers.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-providers',
  templateUrl: './create-providers.component.html',
  styleUrls: ['./create-providers.component.scss']
})
export class CreateProvidersComponent {
  @Output() ProviderC: EventEmitter<any> = new EventEmitter();
  full_name:string = '';
  ruc:string = '';
  email:string = '';
  address:string = '';
  phone:string = '';


  isLoading:any;

  IMAGEN_CATEGORIE:any;
  IMAGEN_PREVISUALIZA:any;
  constructor(
    public modal: NgbActiveModal,
    public providersService: ProvidersService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }

  processFile($event:any){
    if($event.target.files[0].type.indexOf("image") < 0){
      this.toast.warning("WARN","El archivo no es una imagen");
      return;
    }
    this.IMAGEN_CATEGORIE = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.IMAGEN_CATEGORIE);
    reader.onloadend = () => this.IMAGEN_PREVISUALIZA = reader.result;
  }

  store(){
    if(!this.full_name){
      this.toast.error("Validación","El nombre de la empresa es requerido");
      return false;
    }

    if(!this.ruc){
      this.toast.error("Validación","El ruc es requerido");
      return false;
    }

    let formData = new FormData();
    formData.append("full_name",this.full_name);
    formData.append("ruc",this.ruc);
    if(this.IMAGEN_CATEGORIE){
      formData.append("provider_imagen",this.IMAGEN_CATEGORIE);
    }
    if(this.email){
      formData.append("email",this.email);
    }else{
      formData.append("email","");
    }
    if(this.phone){
      formData.append("phone",this.phone);
    }else{
      formData.append("phone","");
    }
    if(this.address){
      formData.append("address",this.address);
    }else{
      formData.append("address","");
    }

    this.providersService.registerProvider(formData).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","El provedor se registro correctamente");
        this.ProviderC.emit(resp.provider);
        this.modal.close();
      }
    })
  }
}
