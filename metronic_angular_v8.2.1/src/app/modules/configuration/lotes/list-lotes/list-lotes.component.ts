import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProformasService } from 'src/app/modules/proformas/service/proformas.service';
import { CreateLoteComponent } from '../create-lote/create-lote.component';

@Component({
  selector: 'app-list-lotes',
  templateUrl: './list-lotes.component.html',
  styleUrls: ['./list-lotes.component.scss']
})
export class ListLotesComponent {
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

  processFile($event: any) {
    if ($event.target.files[0].type.indexOf("image") < 0) {
      this.toast.warning("WARN", "El archivo no es una imagen");
      return;
    }
    this.payment_file = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.payment_file);
    reader.onloadend = () => this.imagen_previzualiza = reader.result;
    this.isLoadingProcess();
  }

  isLoadingProcess() {
    this.proformaService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.proformaService.isLoadingSubject.next(false);
    }, 50);
  }

  createLote() {
    const modalRef = this.modalService.open(CreateLoteComponent, { centered: true, size: 'md' });

    modalRef.componentInstance.SucursalC.subscribe((sucursal: any) => {
    })
  }
}
