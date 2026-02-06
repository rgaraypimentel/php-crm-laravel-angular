import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MethodPaymentService } from '../service/method-payment.service';

@Component({
  selector: 'app-create-method-payment',
  templateUrl: './create-method-payment.component.html',
  styleUrls: ['./create-method-payment.component.scss']
})
export class CreateMethodPaymentComponent {
  @Output() MethodPaymentC: EventEmitter<any> = new EventEmitter();
  @Input() METHOD_PAYMENTS:any = [];
  name:string = '';
  method_payment_id:string = '';

  isLoading:any;

  constructor(
    public modal: NgbActiveModal,
    public methodPaymentService: MethodPaymentService,
    public toast: ToastrService,
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }

  store(){
    if(!this.name){
      this.toast.error("Validación","El nombre del metodo de pago es requerido");
      return false;
    }

    let data = {
      name: this.name,
      method_payment_id:this.method_payment_id,
    }

    this.methodPaymentService.registerMethodPayment(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","El metodo de pago se registro correctamente");
        this.MethodPaymentC.emit(resp.method_payment);
        this.modal.close();
      }
    })
  }
}
