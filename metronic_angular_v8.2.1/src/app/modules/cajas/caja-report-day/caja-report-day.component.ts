import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CajaService } from '../service/caja.service';

@Component({
  selector: 'app-caja-report-day',
  templateUrl: './caja-report-day.component.html',
  styleUrls: ['./caja-report-day.component.scss']
})
export class CajaReportDayComponent {
  @Input()caja:any;
  @Input()caja_sucursale:any;
  @Input()created_at_apertura:any;

  method_payments_total:any = [];
  constructor(
    public modal:NgbActiveModal,
    public cajaService: CajaService,
  ) {

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.caja,this.caja_sucursale,this.created_at_apertura);
    this.cajaService.reportCajaDay(this.caja_sucursale.id).subscribe((resp:any) => {
      console.log(resp);
      this.method_payments_total = resp.method_payment_total_amount;
    })
  }
}
