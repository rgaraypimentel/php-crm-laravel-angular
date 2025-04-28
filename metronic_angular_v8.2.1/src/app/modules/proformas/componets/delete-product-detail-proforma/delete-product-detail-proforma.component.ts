import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProformasService } from '../../service/proformas.service';

@Component({
  selector: 'app-delete-product-detail-proforma',
  templateUrl: './delete-product-detail-proforma.component.html',
  styleUrls: ['./delete-product-detail-proforma.component.scss']
})
export class DeleteProductDetailProformaComponent {

  @Output() DeleteProductProforma: EventEmitter<any> = new EventEmitter();
  @Input()  DETAIL_PRODUCT:any;
  @Input() PROFORMA_ID:any;

  isLoading:any;
  constructor(
    public modal: NgbActiveModal,
    public toast: ToastrService,
    public proformaService: ProformasService,
  ) {

  }

  ngOnInit(): void {
  }

  delete(){
    if(this.PROFORMA_ID){
      this.proformaService.deleteDetailProforma(this.DETAIL_PRODUCT.id).subscribe((resp:any) => {
        this.DeleteProductProforma.emit(resp);
        this.modal.close();
      })
    }else{
      this.DeleteProductProforma.emit("");
      this.modal.close();
    }
  }

}
