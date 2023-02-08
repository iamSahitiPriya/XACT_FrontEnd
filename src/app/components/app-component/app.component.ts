/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Inject, OnInit} from '@angular/core';
import {OKTA_AUTH, OktaAuthStateService} from '@okta/okta-angular';
import {OktaAuth} from '@okta/okta-auth-js';
import {ProgressComponentComponent} from "../progress-component/progress-component.component";
import {data_local} from "../../messages";
import {environment} from "../../../environments/environment";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {Observable} from "rxjs";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  userRole: Observable<Object>;
  public progressComponent = ProgressComponentComponent;
  public appVersion: string = environment.VERSION;
  copyright = data_local.COPYRIGHT_MESSAGE.COPYRIGHT_TEXT;
  thoughtworks = data_local.COPYRIGHT_MESSAGE.THOUGHTWORKS_TAG;
  rightReserved = data_local.COPYRIGHT_MESSAGE.RIGHTS_RESERVED_TEXT;

  route: boolean = false;

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth, public authService: OktaAuthStateService, public appService: AppServiceService) {
  }

  async ngOnInit() {
    this.userRole = this.appService.getUserRole();
  }

}

