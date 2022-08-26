import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-admin-console',
  templateUrl: './admin-console.component.html',
  styleUrls: ['./admin-console.component.css']
})
export class AdminConsoleComponent{
  type:string;
  constructor() {
  }

  setEvent(name: string) {
    this.type = name;
  }
}
