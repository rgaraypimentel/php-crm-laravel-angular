import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-search-products',
  templateUrl: './search-products.component.html',
  styleUrls: ['./search-products.component.scss']
})
export class SearchProductsComponent {

  @Input() products:any = [];
  @Output() ProductSelected: EventEmitter<any> = new EventEmitter();

  constructor(
    public modal: NgbActiveModal
  ) {
    
  }

  getDisponibilidad(val:number){
    let TEXTO = "";
    switch (val) {
      case 1:
        TEXTO = "Vender los productos sin stock"
        break;
        case 2:
          TEXTO = "No vender los productos sin stock"
          break;
          case 3:
        TEXTO = "Proyectar con los contratos que se tenga"
        break;
      default:
        break;
    }
    return TEXTO;
  }
  getTaxSelected(val:number) {
    let TEXTO = "";
    switch (val) {
      case 1:
        TEXTO = "Tax Free"
        break;
        case 2:
          TEXTO = "Taxable Goods"
          break;
          case 3:
        TEXTO = "Downloadable Product"
        break;
      default:
        break;
    }
    return TEXTO;
  }
  
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.products);
  }

  selectProduct(product:any){
    this.ProductSelected.emit(product);
    this.modal.close();
  }

}
