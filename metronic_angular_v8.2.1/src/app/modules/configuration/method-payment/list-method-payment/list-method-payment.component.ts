import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MethodPaymentService } from '../service/method-payment.service';
import { CreateMethodPaymentComponent } from '../create-method-payment/create-method-payment.component';
import { EditMethodPaymentComponent } from '../edit-method-payment/edit-method-payment.component';
import { DeleteMethodPaymentComponent } from '../delete-method-payment/delete-method-payment.component';

@Component({
  selector: 'app-list-method-payment',
  templateUrl: './list-method-payment.component.html',
  styleUrls: ['./list-method-payment.component.scss']
})
export class ListMethodPaymentComponent {
  search:string = '';
  METHOD_PAYMENTS:any = [];
  isLoading$:any;

  totalPages:number = 0;
  currentPage:number = 1;
  constructor(
    public modalService: NgbModal,
    public methodpaymentService: MethodPaymentService,
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.methodpaymentService.isLoading$;
    this.listMethodPayments();
  }

  listMethodPayments(page = 1){
    this.methodpaymentService.listMethodPayments(page,this.search).subscribe((resp:any) => {
      console.log(resp);
      this.METHOD_PAYMENTS = resp.method_payments;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage($event:any){
    this.listMethodPayments($event);
  }

  createMethodPayment(){
    const modalRef = this.modalService.open(CreateMethodPaymentComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.METHOD_PAYMENTS = this.METHOD_PAYMENTS.filter((method:any) => !method.method_payment_id);

    modalRef.componentInstance.MethodPaymentC.subscribe((method_payment:any) => {
      this.METHOD_PAYMENTS.unshift(method_payment);
    })
  }

  editMethodPayment(METHOD_PAYMENT:any){
    const modalRef = this.modalService.open(EditMethodPaymentComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.METHOD_PAYMENT_SELECTED = METHOD_PAYMENT;
    modalRef.componentInstance.METHOD_PAYMENTS = this.METHOD_PAYMENTS.filter((method:any) => !method.method_payment_id);

    modalRef.componentInstance.MethodPaymentE.subscribe((method_payment:any) => {
      let INDEX = this.METHOD_PAYMENTS.findIndex((method_pay:any) => method_pay.id == METHOD_PAYMENT.id);
      if(INDEX != -1){
        this.METHOD_PAYMENTS[INDEX] = method_payment;
      }
    })
  }

  deleteMethodPayment(METHOD_PAYMENT:any){
    const modalRef = this.modalService.open(DeleteMethodPaymentComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.METHOD_PAYMENT_SELECTED = METHOD_PAYMENT;

    modalRef.componentInstance.MethodPaymentD.subscribe((method_payment:any) => {
      let INDEX = this.METHOD_PAYMENTS.findIndex((method_pay:any) => method_pay.id == METHOD_PAYMENT.id);
      if(INDEX != -1){
        this.METHOD_PAYMENTS.splice(INDEX,1);
      }
      // this.ROLES.unshift(role);
    })
  }
}
