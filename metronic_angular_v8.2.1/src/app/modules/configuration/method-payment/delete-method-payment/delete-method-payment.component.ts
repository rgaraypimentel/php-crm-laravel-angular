import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MethodPaymentService } from '../service/method-payment.service';

@Component({
  selector: 'app-delete-method-payment',
  templateUrl: './delete-method-payment.component.html',
  styleUrls: ['./delete-method-payment.component.scss']
})
export class DeleteMethodPaymentComponent {
  @Output() MethodPaymentD: EventEmitter<any> = new EventEmitter();
  @Input()  METHOD_PAYMENT_SELECTED:any;

  isLoading:any;
  constructor(
    public modal: NgbActiveModal,
    public method_paymentService: MethodPaymentService,
    public toast: ToastrService,
  ) {
    
  }

  ngOnInit(): void {
  }

  delete(){
    
    this.method_paymentService.deleteMethodPayment(this.METHOD_PAYMENT_SELECTED.id).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toast.error("Validación",resp.message_text);
      }else{
        this.toast.success("Exito","El metodo de pago se elimino correctamente");
        this.MethodPaymentD.emit(resp.message);
        this.modal.close();
      }
    })
  }

}
