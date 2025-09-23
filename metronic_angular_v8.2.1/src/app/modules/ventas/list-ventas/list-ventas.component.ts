import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProformasService } from '../../proformas/service/proformas.service';

@Component({
  selector: 'app-list-ventas',
  templateUrl: './list-ventas.component.html',
  styleUrls: ['./list-ventas.component.scss']
})
export class ListVentasComponent {
  isLoading$: any;

  constructor(
    public modalService: NgbModal,
    public proformasService: ProformasService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.configAll();
  }

  configAll() {
    this.proformasService.configAll().subscribe((resp: any) => {
      console.log(resp);
    })
  }
  loadPage($event: any) {
  }
}
