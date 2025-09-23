import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProformasService } from '../../proformas/service/proformas.service';

@Component({
  selector: 'app-create-ventas',
  templateUrl: './create-ventas.component.html',
  styleUrls: ['./create-ventas.component.scss']
})
export class CreateVentasComponent {
  TODAY: string = 'Y/m/d';
  isLoading$: any;
  imagen_previzualiza: any = '';

  @ViewChild("discount") something: ElementRef;
  payment_file: any;
  constructor(
    public modalService: NgbModal,
    public proformaService: ProformasService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.proformaService.isLoading$;
    this.proformaService.configAll().subscribe((resp: any) => {
      console.log(resp);
      this.TODAY = resp.today;
      // this.isLoadingProcess();
    })
  }
}
