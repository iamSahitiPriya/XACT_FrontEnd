/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Inject} from '@angular/core';
import {OKTA_AUTH, OktaAuthStateService} from '@okta/okta-angular';
import {OktaAuth} from '@okta/okta-auth-js';
import {ProgressComponentComponent} from "../progress-component/progress-component.component";
import {data_local} from "../../../assets/messages";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  public progressComponent = ProgressComponentComponent;
  public appVersion:string = "1.0.0";
  copyright = data_local.COPYRIGHT_MESSAGE.COPYRIGHT_TEXT;
  thoughtworks = data_local.COPYRIGHT_MESSAGE.THOUGHTWORKS_TAG;
  rightReserved = data_local.COPYRIGHT_MESSAGE.RIGHTS_RESERVED_TEXT;



  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth, public authService: OktaAuthStateService) {
  }
}

