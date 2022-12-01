/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-console',
  templateUrl: './admin-console.component.html',
  styleUrls: ['./admin-console.component.css']
})
export class AdminConsoleComponent {
  type = "";
  tabIndex: number;

  constructor(private router: Router) {
    const currentRoute = this.router.url.split('?')[0];
    const path = currentRoute.split('/').pop()||'';
    this.setEvent(path);
  }

  setEvent(name: string) {
    this.type = name;
  }

}
