import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { URL_SERVICIOS } from 'src/app/config/config';
import { CreateClientsCompanyComponent } from '../create-clients-company/create-clients-company.component';
import { CreateClientsPersonComponent } from '../create-clients-person/create-clients-person.component';
import { DeleteClientsComponent } from '../delete-clients/delete-clients.component';
import { EditClientsCompanyComponent } from '../edit-clients-company/edit-clients-company.component';
import { EditClientsPersonComponent } from '../edit-clients-person/edit-clients-person.component';
import { ImportClientsComponent } from '../import-clients/import-clients.component';
import { ClientsService } from '../service/clients.service';

@Component({
  selector: 'app-list-clients',
  templateUrl: './list-clients.component.html',
  styleUrls: ['./list-clients.component.scss']
})
export class ListClientsComponent {
  search:string = '';
  CLIENTS:any = [];
  isLoading$:any;

  totalPages:number = 0;
  currentPage:number = 1;

  client_segments:any = [];
  asesores:any = [];

  client_segment_id:string = '';
  type:string = '';
  asesor_id:string = '';
  constructor(
    public modalService: NgbModal,
    public clientsService: ClientsService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.clientsService.isLoading$;
    this.listClients();
    this.listConfig();
  }

  listClients(page = 1){
    let data = {
      search: this.search,
      client_segment_id: this.client_segment_id,
      type: this.type,
      asesor_id: this.asesor_id,
    }
    this.clientsService.listClients(page,data).subscribe((resp:any) => {
      console.log(resp);
      this.CLIENTS = resp.clients.data;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }
  resetlistClients(){
    this.search = '';
    this.client_segment_id = '';
    this.type = '';
    this.asesor_id = '';
    this.listClients();
  }
  listConfig(){
    this.clientsService.listConfig().subscribe((resp:any) => {
      console.log(resp);
      this.client_segments = resp.client_segments;
      this.asesores = resp.asesores;
    })
  }
  loadPage($event:any){
    this.listClients($event);
  }

  createClientCompany(){
    const modalRef = this.modalService.open(CreateClientsCompanyComponent,{centered:true, size: 'lg'});
    modalRef.componentInstance.client_segments = this.client_segments
    modalRef.componentInstance.asesores = this.asesores
    modalRef.componentInstance.ClientsC.subscribe((client:any) => {
      this.CLIENTS.unshift(client);
    })
  }

  createClientPerson(){
    const modalRef = this.modalService.open(CreateClientsPersonComponent,{centered:true, size: 'lg'});
    modalRef.componentInstance.client_segments = this.client_segments
    modalRef.componentInstance.asesores = this.asesores


    modalRef.componentInstance.ClientsC.subscribe((client:any) => {
      this.CLIENTS.unshift(client);
    })
  }

  editClientCompany(CLIENT_SELECTED:any){
    const modalRef = this.modalService.open(EditClientsCompanyComponent,{centered:true, size: 'lg'});
    modalRef.componentInstance.client_selected = CLIENT_SELECTED;
    modalRef.componentInstance.client_segments = this.client_segments
    modalRef.componentInstance.asesores = this.asesores

    modalRef.componentInstance.ClientsE.subscribe((client:any) => {
      let INDEX = this.CLIENTS.findIndex((client_s:any) => client_s.id == CLIENT_SELECTED.id);
      if(INDEX != -1){
        this.CLIENTS[INDEX] = client;
      }
    })
  }

  editClientPerson(CLIENT_SELECTED:any){
    const modalRef = this.modalService.open(EditClientsPersonComponent,{centered:true, size: 'lg'});
    modalRef.componentInstance.client_selected = CLIENT_SELECTED;
    modalRef.componentInstance.client_segments = this.client_segments
    modalRef.componentInstance.asesores = this.asesores

    modalRef.componentInstance.ClientsE.subscribe((clientE:any) => {
      let INDEX = this.CLIENTS.findIndex((client:any) => client.id == CLIENT_SELECTED.id);
      if(INDEX != -1){
        this.CLIENTS[INDEX] = clientE;
      }
    })
  }

  deleteClient(CLIENT_SELECTED:any){
    const modalRef = this.modalService.open(DeleteClientsComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.client_selected = CLIENT_SELECTED;

    modalRef.componentInstance.ClientsD.subscribe((client_s:any) => {
      let INDEX = this.CLIENTS.findIndex((client_s:any) => client_s.id == CLIENT_SELECTED.id);
      if(INDEX != -1){
        this.CLIENTS.splice(INDEX,1);
      }
      // this.ROLES.unshift(role);
    })
  }

  exportClients(){
    let LINK="";
    // search: this.search,
    // client_segment_id: this.client_segment_id,
    // type: this.type,
    // asesor_id: this.asesor_id,
    if(this.search){
      LINK += "&search="+this.search;
    }
    if(this.client_segment_id){
      LINK += "&client_segment_id="+this.client_segment_id;
    }
    if(this.type){
      LINK += "&type="+this.type;
    }
    if(this.asesor_id){
      LINK += "&asesor_id="+this.asesor_id;
    }
    window.open(URL_SERVICIOS+"/excel/export-clients?z=1"+LINK,"_blank");
  }

  importClients(){
    const modalRef = this.modalService.open(ImportClientsComponent,{centered: true,size:'md'});

    modalRef.componentInstance.importClient.subscribe((resp:any) => {
      this.listClients();
    })
  }
}
