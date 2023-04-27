/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, OnDestroy} from '@angular/core';
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppStates} from "../../../reducers/app.states";
import * as fromActions from "../../../actions/assessment-data.actions";
import {Subject, Subscription, takeUntil} from "rxjs";


@Component({
  selector: 'app-admin-console',
  templateUrl: './admin-console.component.html',
  styleUrls: ['./admin-console.component.css']
})
export class AdminConsoleComponent implements OnDestroy {
  type = "";
  tabIndex: number;
  private destroy$: Subject<void> = new Subject<void>();


  constructor(private router: Router, private store: Store<AppStates>) {
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(_res => {
      const currentRoute = this.router.url.split('?')[0];
      const path = currentRoute.split('/').pop() || '';
      this.setEvent(path);
    })
    this.store.dispatch(fromActions.loggedInUser({role: "admin"}))
  }

  setEvent(name: string) {
    this.type = name;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
