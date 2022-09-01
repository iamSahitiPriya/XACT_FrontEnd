/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {OKTA_AUTH, OktaAuthStateService} from '@okta/okta-angular';
import {OktaAuth} from '@okta/okta-auth-js';
import {ProgressComponentComponent} from "../progress-component/progress-component.component";
import {data_local} from "../../../assets/messages";
import {environment} from "../../../environments/environment";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {Observable} from "rxjs";
import {DEFAULT_INTERRUPTSOURCES, Idle} from '@ng-idle/core';
import {ErrorComponentComponent} from "../error-component/error-component.component";
import {MatDialog} from "@angular/material/dialog";


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

  idleState = "NOT_STARTED";


  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth, public authService: OktaAuthStateService, public appService: AppServiceService, private idle: Idle, cd: ChangeDetectorRef, private dialog: MatDialog) {
    // set idle parameters
    idle.setIdle(environment.IDLE_TIMEOUT); // how long can they be inactive before considered idle, in seconds
    idle.setTimeout(environment.TIMEOUT); // how long can they be idle before considered timed out, in seconds
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES); // provide sources that will "interrupt" aka provide events indicating the user is active

    // do something when the user becomes idle
    idle.onIdleStart.subscribe(() => {
      this.idleState = "IDLE";
    });
    // do something when the user is no longer idle
    idle.onIdleEnd.subscribe(() => {
      this.idleState = "NOT_IDLE";
      console.log(`${this.idleState} ${new Date()}`)
      cd.detectChanges(); // how do i avoid this kludge?
    });

    // do something when the user has timed out
    idle.onTimeout.subscribe(() => {
      this.idleState = "TIMED_OUT";
      timedOut();
    });

    // do something as the timeout countdown does its thing

    function timedOut() {
      const openConfirm = dialog.open(ErrorComponentComponent, {backdropClass: 'backdrop-bg-opaque'});
      openConfirm.componentInstance.displayHome = false;
      openConfirm.componentInstance.headerText = "Session expired";
      openConfirm.componentInstance.bodyText = "You have been idle for sometime, Please click retry to view page.";
    }
  }


  reset() {
    // we'll call this method when we want to start/reset the idle process
    // reset any component state and be sure to call idle.watch()
    this.idle.watch();
    this.idleState = "NOT_IDLE";
  }

  async ngOnInit() {
    this.reset();
    this.userRole = await this.appService.getUserRole();
  }
}

