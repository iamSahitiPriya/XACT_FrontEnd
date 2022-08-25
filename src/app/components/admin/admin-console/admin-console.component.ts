import {Component, OnInit} from '@angular/core';
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-admin-console',
  templateUrl: './admin-console.component.html',
  styleUrls: ['./admin-console.component.css']
})
export class AdminConsoleComponent{
  type:string;
  constructor(private matIconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIcon("parameter",this.sanitizer.bypassSecurityTrustResourceUrl("../../../../assets/Group 3732.svg"))
  }

  setEvent(name: string) {
    this.type = name;
  }
}
