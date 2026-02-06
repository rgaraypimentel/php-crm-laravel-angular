import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-open-detail-proforma',
  templateUrl: './open-detail-proforma.component.html',
  styleUrls: ['./open-detail-proforma.component.scss']
})
export class OpenDetailProformaComponent {

  @Input() PROFORMA:any;

  constructor(
    public modal: NgbActiveModal
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

}
