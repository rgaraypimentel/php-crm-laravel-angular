import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-show-details-payments',
  templateUrl: './show-details-payments.component.html',
  styleUrls: ['./show-details-payments.component.scss']
})
export class ShowDetailsPaymentsComponent {
  @Input() PROFORMA_SELECTED:any;
  PAGOS:any = [];

  constructor(
    public modal: NgbActiveModal,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.PAGOS = this.PROFORMA_SELECTED.pagos;
  }
}
