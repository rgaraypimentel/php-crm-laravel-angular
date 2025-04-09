import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MethodPaymentService } from '../service/method-payment.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-method-payment',
  templateUrl: './edit-method-payment.component.html',
  styleUrls: ['./edit-method-payment.component.scss']
})
export class EditMethodPaymentComponent {
  @Output() MethodPaymentE: EventEmitter<any> = new EventEmitter();
  @Input() METHOD_PAYMENTS:any = [];
  @Input() METHOD_PAYMENT_SELECTED:any;
  
  name:string = '';
  method_payment_id:string = '';
  state:number = 1;

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
    this.name = this.METHOD_PAYMENT_SELECTED.name;
    this.method_payment_id = this.METHOD_PAYMENT_SELECTED.method_payment_id;
    this.state = this.METHOD_PAYMENT_SELECTED.state;
  }

  store(){
    if(!this.name){
      this.toast.error("Validación","El nombre del metodo de pago es requerido");
      return false;
    }

    let data = {
      name: this.name,
      method_payment_id:this.method_payment_id,
      state: this.state,
    }

    this.methodPaymentService.updateMethodPayment(this.METHOD_PAYMENT_SELECTED.id,data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","El metodo de pago se registro correctamente");
        this.MethodPaymentE.emit(resp.method_payment);
        this.modal.close();
      }
    })
  }
}
