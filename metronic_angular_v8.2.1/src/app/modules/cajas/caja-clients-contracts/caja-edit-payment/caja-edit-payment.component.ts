import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CajaService } from '../../service/caja.service';

@Component({
  selector: 'app-caja-edit-payment',
  templateUrl: './caja-edit-payment.component.html',
  styleUrls: ['./caja-edit-payment.component.scss']
})
export class CajaEditPaymentComponent {
  @Input() PAGO:any;
  @Input() method_payments:any = [];
  @Output() PagoE: EventEmitter<any> = new EventEmitter();

  n_transaccion:string = '';
  method_payment_id:string = '';
  banco_id:string = '';
  verification_payment:number = 1;
  METHOD_PAYMENT_SELECTED:any;
  amount_payment:number= 0;
  imagen_previzualiza:any;
  payment_file:any;
  constructor(
    public modal: NgbActiveModal,
    public toast: ToastrService,
    public cajaService: CajaService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.method_payment_id = this.PAGO.method_payment_id;
    this.banco_id = this.PAGO.banco_id;
    this.amount_payment = this.PAGO.amount;
    this.imagen_previzualiza = this.PAGO.imagen;
    this.n_transaccion = this.PAGO.n_transaccion;
    this.verification_payment = this.PAGO.verification;
  }

  edit(){
    if(this.amount_payment <= 0){
      this.toast.error("Validación","Es necesario ingresar un monto mayor a 0")
      return;
    }
    if(this.method_payment_id != '1' && !this.n_transaccion){
      this.toast.error("Validación","Es necesario ingresar un numero de la transacción")
      return;
    }
    let formData = new FormData();
    formData.append("method_payment_id",this.method_payment_id);
    if(this.banco_id){
      formData.append("banco_id",this.banco_id);
    }
    formData.append("amount",this.amount_payment+"");
    formData.append("n_transaccion",this.n_transaccion+"");
    if(this.payment_file){
      formData.append("payment_file",this.payment_file);
    }
    formData.append("verification",this.verification_payment+"");
    this.cajaService.updatePayment(formData,this.PAGO.id).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validacion",resp.message_text);
      }else{
        this.PagoE.emit(resp);
        this.toast.success("Exito","El pago se edito correctamente");
        this.modal.close();
      }
    })
  }

  changeMethodPayment(){
    this.METHOD_PAYMENT_SELECTED = this.method_payments.find((item:any) => item.id == this.method_payment_id);
    this.banco_id = '';
  }
  isVerication(){
    this.verification_payment = this.verification_payment == 1 ? 2 : 1;
    console.log(this.verification_payment);
  }
  processFile($event:any){
    if($event.target.files[0].type.indexOf("image") < 0){
      this.toast.warning("WARN","El archivo no es una imagen");
      return;
    }
    this.payment_file = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.payment_file);
    reader.onloadend = () => this.imagen_previzualiza = reader.result;
    // this.isLoadingProcess();
  }
}
