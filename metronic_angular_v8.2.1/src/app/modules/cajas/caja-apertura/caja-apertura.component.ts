import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CajaService } from '../service/caja.service';

@Component({
  selector: 'app-caja-apertura',
  templateUrl: './caja-apertura.component.html',
  styleUrls: ['./caja-apertura.component.scss']
})
export class CajaAperturaComponent {
  @Input() caja:any;
  amount_initial:number = 0;
  isLoading:any;

  @Output() caja_apertura: EventEmitter<any> = new EventEmitter();

  constructor(
    public modal: NgbActiveModal,
    public cajaService: CajaService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.amount_initial = this.caja.amount;
  }

  apertura(){
    let data = {
      caja_id: this.caja.id,
      amount_initial: this.amount_initial,
    }
    this.cajaService.aperturaCaja(data).subscribe((resp:any) => {
      console.log(resp);
      this.toast.success("Exito","La caja "+this.caja.sucursale.name+" se aperturo correctamente");
      this.modal.close();
      this.caja_apertura.emit(resp);
    })
  }
}
