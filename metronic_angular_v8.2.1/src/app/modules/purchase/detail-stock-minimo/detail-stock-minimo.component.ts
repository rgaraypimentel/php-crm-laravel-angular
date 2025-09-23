import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-detail-stock-minimo',
  templateUrl: './detail-stock-minimo.component.html',
  styleUrls: ['./detail-stock-minimo.component.scss']
})
export class DetailStockMinimoComponent {
  @Input() PRODUCTOS: any;

  constructor(public activeModal: NgbActiveModal) {}

  close() {
    this.activeModal.close();
  }
}
