import { Component } from '@angular/core';

@Component({
  selector: 'app-g-comissions',
  templateUrl: './g-comissions.component.html',
  styleUrls: ['./g-comissions.component.scss']
})
export class GComissionsComponent {
  tab_selected:number = 1;

  selectedTab(val:number){
    this.tab_selected = val;
  }
}
