/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {OKTA_AUTH, OktaAuthStateService} from '@okta/okta-angular';
import {OktaAuth} from '@okta/okta-auth-js';
import {ProgressComponentComponent} from "../progress-component/progress-component.component";
import {data_local} from "../../messages";
import {environment} from "../../../environments/environment";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {Observable} from "rxjs";
import {DEFAULT_INTERRUPTSOURCES, Idle} from '@ng-idle/core';
import {NotificationSnackbarComponent} from "../notification-component/notification-component.component";
import {MatSnackBar, MatSnackBarHorizontalPosition} from "@angular/material/snack-bar";
import {Store} from "@ngrx/store";
import {AppStates} from "../../reducers/app.states";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  userRoles: Observable<string []>;
  public progressComponent = ProgressComponentComponent;
  public appVersion: string = environment.VERSION;
  copyright = data_local.COPYRIGHT_MESSAGE.COPYRIGHT_TEXT;
  thoughtworks = data_local.COPYRIGHT_MESSAGE.THOUGHTWORKS_TAG;
  rightReserved = data_local.COPYRIGHT_MESSAGE.RIGHTS_RESERVED_TEXT;

  idleState = data_local.IDLE_STATE.STATE.NOT_STARTED;
  private loggedInUserEmail: string | undefined;


  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth, public authService: OktaAuthStateService, public appService: AppServiceService, private idle: Idle, cd: ChangeDetectorRef, private _snackBar: MatSnackBar, private store: Store<AppStates>) {
    // set idle parameters
    idle.setIdle(environment.IDLE_TIMEOUT); // how long can they be inactive before considered idle, in seconds
    idle.setTimeout(environment.TIMEOUT); // how long can they be idle before considered timed out, in seconds
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES); // provide sources that will "interrupt" aka provide events indicating the user is active

    // do something when the user becomes idle
    idle.onIdleStart.subscribe(() => {
      this.idleState = data_local.IDLE_STATE.STATE.IDLE;
    });
    // do something when the user is no longer idle
    idle.onIdleEnd.subscribe(() => {
      this.idleState = data_local.IDLE_STATE.STATE.NOT_IDLE;
      cd.detectChanges(); // how do i avoid this kludge?
    });

    // do something when the user has timed out
    idle.onTimeout.subscribe(() => {
      this.idleState = data_local.IDLE_STATE.STATE.TIMED_OUT.LABEL;
      timedOut();
    });

    function timedOut() {
      _snackBar.openFromComponent(NotificationSnackbarComponent, {
        data: {
          message: data_local.IDLE_STATE.STATE.TIMED_OUT.PROMPT_BODY,
          iconType: "warning_outline",
          notificationType: "Warning:"
        }, panelClass: ['error-snackBar'],
        duration: 80000,
        verticalPosition: "top",
        horizontalPosition: "center" as MatSnackBarHorizontalPosition
      })
    }

  }


  reset() {
    // we'll call this method when we want to start/reset the idle process
    // reset any component state and be sure to call idle.watch()
    this.idle.watch();
    this.idleState = data_local.IDLE_STATE.STATE.NOT_IDLE;
  }

  async ngOnInit() {
    this.reset();
    this.userRoles = await this.appService.getUserRole();
  }
}

