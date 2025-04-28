import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-search-clients',
  templateUrl: './search-clients.component.html',
  styleUrls: ['./search-clients.component.scss']
})
export class SearchClientsComponent {

  @Input() clients:any = [];
  @Output() ClientSelected: EventEmitter<any> = new EventEmitter();

  constructor(
    public modal: NgbActiveModal
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.clients);
  }

  selectClient(client:any){
    this.ClientSelected.emit(client);
    this.modal.close();
  }
}
