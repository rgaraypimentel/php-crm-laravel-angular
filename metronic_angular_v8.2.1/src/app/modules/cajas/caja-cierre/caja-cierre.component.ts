import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CajaService } from '../service/caja.service';

@Component({
  selector: 'app-caja-cierre',
  templateUrl: './caja-cierre.component.html',
  styleUrls: ['./caja-cierre.component.scss']
})
export class CajaCierreComponent {
  @Input() caja_sucursale:any;
  @Output() CierreCaja: EventEmitter<any> = new EventEmitter();

  amount_finish:number = 0;
  amount_pass:number = 0;
  isLoading:any;
  constructor(
    public modal: NgbActiveModal,
    public cajaService: CajaService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.amount_finish = this.caja_sucursale.efectivo_finish;
  }

  cierreCaja(){
    let data = {
      caja_sucursale_id: this.caja_sucursale.id,
      amount_caja_fuerte: this.amount_pass,
    }
    this.cajaService.cierreCaja(data).subscribe((resp:any) => {
      console.log(resp);
      this.CierreCaja.emit(resp);
      this.modal.close();
      this.toast.success("Exito","La caja del dia se ha cerrado");
    })
  }
}
