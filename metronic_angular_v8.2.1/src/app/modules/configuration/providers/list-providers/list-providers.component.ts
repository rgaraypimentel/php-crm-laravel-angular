import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProvidersService } from '../service/providers.service';
import { CreateProvidersComponent } from '../create-providers/create-providers.component';
import { EditProvidersComponent } from '../edit-providers/edit-providers.component';
import { DeleteProvidersComponent } from '../delete-providers/delete-providers.component';

@Component({
  selector: 'app-list-providers',
  templateUrl: './list-providers.component.html',
  styleUrls: ['./list-providers.component.scss']
})
export class ListProvidersComponent {
  search:string = '';
  PROVIDERS:any = [];
  isLoading$:any;

  totalPages:number = 0;
  currentPage:number = 1;
  constructor(
    public modalService: NgbModal,
    public providersService: ProvidersService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.providersService.isLoading$;
    this.listProviders();
  }

  listProviders(page = 1){
    this.providersService.listProviders(page,this.search).subscribe((resp:any) => {
      console.log(resp);
      this.PROVIDERS = resp.providers;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage($event:any){
    this.listProviders($event);
  }

  createProvider(){
    const modalRef = this.modalService.open(CreateProvidersComponent,{centered:true, size: 'md'});

    modalRef.componentInstance.ProviderC.subscribe((provider:any) => {
      this.PROVIDERS.unshift(provider);
    })
  }

  editProvider(PROVIDER:any){
    const modalRef = this.modalService.open(EditProvidersComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.PROVIDER_SELECTED = PROVIDER;

    modalRef.componentInstance.ProviderE.subscribe((provider:any) => {
      let INDEX = this.PROVIDERS.findIndex((client_seg:any) => client_seg.id == PROVIDER.id);
      if(INDEX != -1){
        this.PROVIDERS[INDEX] = provider;
      }
    })
  }

  deleteProvider(PROVIDER:any){
    const modalRef = this.modalService.open(DeleteProvidersComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.PROVIDER_SELECTED = PROVIDER;

    modalRef.componentInstance.ProviderD.subscribe((providers:any) => {
      let INDEX = this.PROVIDERS.findIndex((provid_d:any) => provid_d.id == PROVIDER.id);
      if(INDEX != -1){
        this.PROVIDERS.splice(INDEX,1);
      }
      // this.ROLES.unshift(role);
    })
  }
}
