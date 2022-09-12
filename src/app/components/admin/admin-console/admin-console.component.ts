import {Component, OnInit} from '@angular/core';
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-console',
  templateUrl: './admin-console.component.html',
  styleUrls: ['./admin-console.component.css']
})
export class AdminConsoleComponent{
  type="dashboard";
  tabIndex:number;
  constructor(private router:Router) {
    this.router.navigateByUrl("/admin/dashboard")
    }

  setEvent(name: string) {
    this.type = name;
  }

}
