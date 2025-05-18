import { Component } from '@angular/core';
import { ComissionsService } from './service/comissions.service';

@Component({
  selector: 'app-comissions',
  templateUrl: './comissions.component.html',
  styleUrls: ['./comissions.component.scss']
})
export class ComissionsComponent {
  isLoading$:any;

  categories:any = [];
  segment_clients:any = [];

  year:string = '';
  month:string = '';
  year_current:string = '';
  month_current:string = '';

  COMMISSIONS:any = [];
  constructor(
    public commisionService: ComissionsService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.commisionService.isLoading$;
    this.configAll();
  }

  configAll(){

    this.commisionService.configAll().subscribe((resp:any) => {
      console.log(resp);
      this.categories = resp.categories;
      this.segment_clients = resp.segment_clients;
      this.year = resp.year;
      this.month = resp.month;
      this.year_current = resp.year;
      this.month_current = resp.month;
      this.getCommisionAsesores();
    })
  }

  getCommisionAsesores(){
    let CATEGORIES = [];
    for (const categorie of this.categories) {
      CATEGORIES.push(categorie.id);
    }
    let SEGMENT_CLIENTS = [];
    for (const segment_client of this.segment_clients) {
      SEGMENT_CLIENTS.push(segment_client.id);
    }
    let data = {
      year: this.year,
      month: this.month,
      categories: CATEGORIES,//[]
      segment_clients: SEGMENT_CLIENTS,
    }
    this.commisionService.getCommisionAsesores(data).subscribe((resp:any) => {
      console.log(resp);
      this.COMMISSIONS = resp.asesores_comisiones;
    })
  }

  reset(){
    this.year = this.year_current;
    this.month = this.month_current;
    this.getCommisionAsesores();
  }
}
