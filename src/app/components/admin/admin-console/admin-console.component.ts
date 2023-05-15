/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, OnDestroy} from '@angular/core';
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppStates, Roles, User} from "../../../reducers/app.states";
import * as fromActions from "../../../actions/assessment-data.actions";
import {Observable, Subject, takeUntil} from "rxjs";
import {data_local} from "../../../messages";


@Component({
  selector: 'app-admin-console',
  templateUrl: './admin-console.component.html',
  styleUrls: ['./admin-console.component.css']
})
export class AdminConsoleComponent implements OnDestroy {
  type = "";
  tabIndex: number;
  private destroy$: Subject<void> = new Subject<void>();
  adminConsole: string = data_local.ADMIN.CONSOLE.CONSOLE_TEXT;
  dashboard: string = data_local.ADMIN.CONSOLE.DASHBOARD;
  category: string = data_local.ADMIN.CONSOLE.CATEGORY;
  module: string = data_local.ADMIN.CONSOLE.MODULE;
  topic: string = data_local.ADMIN.CONSOLE.TOPIC;
  parameter: string = data_local.ADMIN.CONSOLE.PARAMETER;
  manageUsers: string = data_local.ADMIN.CONSOLE.MANAGE_USERS;
  loggedInUser: Observable<User>
  private loggedInUserRole: Observable<Roles>;
  isAdminPrimary: boolean = false;


  constructor(private router: Router, private store: Store<AppStates>) {
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(_res => {
      const currentRoute = this.router.url.split('?')[0];
      const path = currentRoute.split('/').pop() || '';
      this.setEvent(path);
    })
    this.store.dispatch(fromActions.loggedInUser({role: "admin"}))
    this.loggedInUserRole = this.store.select((storeMap)=> storeMap.loggedInUserRole)
    this.validateUser()
  }

  setEvent(name: string) {
    this.type = name;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  private validateUser() {
    this.loggedInUserRole.subscribe(user => {
      if (user.roles.includes('PRIMARY_ADMIN')) {
        this.isAdminPrimary = true;
      }
    })
  }
}
