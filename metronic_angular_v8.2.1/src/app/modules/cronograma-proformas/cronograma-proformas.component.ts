import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { OpenDetailProformaComponent } from '../proformas/componets/open-detail-proforma/open-detail-proforma.component';
import { CronogramaProformasService } from './service/cronograma-proformas.service';
import esLocale from '@fullcalendar/core/locales/es'

@Component({
  selector: 'app-cronograma-proformas',
  templateUrl: './cronograma-proformas.component.html',
  styleUrls: ['./cronograma-proformas.component.scss']
})
export class CronogramaProformasComponent {
calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    // weekends: false,
    events: [
      // { title: 'Meeting', start: new Date(),className: "border-dark bg-dark text-white" },
      // {
      //   "title": "Meeting",
      //   "start": "2024-06-12T14:30:00",
      //   className: "border-success bg-success text-white"
      // },
      // {
      //   "title": "Happy Hour",
      //   "start": "2024-06-12T17:30:00",
      //   className: "border-warning bg-warning text-white"
      // },
      // {
      //   "title": "Dinner",
      //   "start": "2024-06-12T20:00:00",
      //   className: "border-info bg-info text-white"
      // },
      // {
      //   "title": "Dinner",
      //   "start": "2024-06-15T20:00:00",
      //   className: "border-danger bg-danger text-white"
      // },
    ]
  };

  search_client:string = '';
  product_categorie_id:string = '';
  client_segment_id:string = '';
  status_pay:string = '';

  product_categories:any = [];
  client_segments:any = [];

  isLoading$:any;
  constructor(
    public CronogramaService: CronogramaProformasService,
    public toast: ToastrService,
    public modalService: NgbModal,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.CronogramaService.isLoading$;
    this.cronograma();
    this.config();
  }

  config(){
    this.CronogramaService.configAll().subscribe((resp:any) => {
      console.log(resp);
      this.client_segments = resp.client_segments;
      this.product_categories = resp.product_categories;
    })
  }

  cronograma(){
    let data = {
      search_client: this.search_client,
      categorie_id: this.product_categorie_id,
      segment_client_id: this.client_segment_id,
      status_pay: this.status_pay,
    }
    this.CronogramaService.cronograma(data).subscribe((resp:any) => {
      console.log(resp);
      this.calendarOptions = {...this.calendarOptions,...{events: resp.contracts}};
    })
  }

  resetcronograma(){
    this.search_client = '';
    this.product_categorie_id = '';
    this.client_segment_id = '';
    this.status_pay = '';
    this.cronograma();
  }

  openDetail(arg:any){
    console.log(arg.event.extendedProps.contract_id);

    this.CronogramaService.showProforma(arg.event.extendedProps.contract_id).subscribe((resp:any) => {
      console.log(resp);
      const modalRef = this.modalService.open(OpenDetailProformaComponent,{centered:true,size: 'lg'});
      modalRef.componentInstance.PROFORMA = resp.proforma;
    })
  }
}
