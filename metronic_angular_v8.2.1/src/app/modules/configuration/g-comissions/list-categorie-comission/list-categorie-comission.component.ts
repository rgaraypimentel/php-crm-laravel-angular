import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategorieComissionService } from '../service/categorie-comission.service';
import { CreateCategorieComissionComponent } from './create-categorie-comission/create-categorie-comission.component';
import { DeleteCategorieComissionComponent } from './delete-categorie-comission/delete-categorie-comission.component';
import { EditCategorieComissionComponent } from './edit-categorie-comission/edit-categorie-comission.component';

@Component({
  selector: 'app-list-categorie-comission',
  templateUrl: './list-categorie-comission.component.html',
  styleUrls: ['./list-categorie-comission.component.scss']
})
export class ListCategorieComissionComponent {
  search:string = '';
  CATEGORIE_COMISSIONS:any = [];
  isLoading$:any;
  categorias:any = [];
  totalPages:number = 0;
  currentPage:number = 1;
  constructor(
    public modalService: NgbModal,
    public categporieComisionService: CategorieComissionService,
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isLoading$ = this.categporieComisionService.isLoading$;
    this.listCategorieComisions();
  }

  listCategorieComisions(page = 1){
    this.categporieComisionService.listCategorieComisions(page,this.search).subscribe((resp:any) => {
      console.log(resp);
      this.CATEGORIE_COMISSIONS = resp.categorie_commissions;
      this.categorias = resp.categorias;
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage($event:any){
    this.listCategorieComisions($event);
  }

  createCategorieComision(){
    const modalRef = this.modalService.open(CreateCategorieComissionComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.categorias = this.categorias

    modalRef.componentInstance.CategorieComissionC.subscribe((categorie_comission:any) => {
      this.CATEGORIE_COMISSIONS.unshift(categorie_comission);
    })
  }

  editCategorieComision(CATEGORIE_COMISSION:any){
    const modalRef = this.modalService.open(EditCategorieComissionComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.CATEGORIE_COMISSION_SELECTED = CATEGORIE_COMISSION;
    modalRef.componentInstance.categorias = this.categorias

    modalRef.componentInstance.CategorieComissionE.subscribe((categorie_comission:any) => {
      let INDEX = this.CATEGORIE_COMISSIONS.findIndex((categorie_comss:any) => categorie_comss.id == CATEGORIE_COMISSION.id);
      if(INDEX != -1){
        this.CATEGORIE_COMISSIONS[INDEX] = categorie_comission;
      }
    })
  }

  deleteCategorieComision(CATEGORIE_COMISSION:any){
    const modalRef = this.modalService.open(DeleteCategorieComissionComponent,{centered:true, size: 'md'});
    modalRef.componentInstance.CATEGORIE_COMISSION_SELECTED = CATEGORIE_COMISSION;

    modalRef.componentInstance.CategorieComissionD.subscribe((categorie_comission:any) => {
      let INDEX = this.CATEGORIE_COMISSIONS.findIndex((categorie_comss:any) => categorie_comss.id == CATEGORIE_COMISSION.id);
      if(INDEX != -1){
        this.CATEGORIE_COMISSIONS.splice(INDEX,1);
      }
      // this.ROLES.unshift(role);
    })
  }
}
