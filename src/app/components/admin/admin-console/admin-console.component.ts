/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppStates} from "../../../reducers/app.states";
import * as fromActions from "../../../actions/assessment-data.actions";


@Component({
  selector: 'app-admin-console',
  templateUrl: './admin-console.component.html',
  styleUrls: ['./admin-console.component.css']
})
export class AdminConsoleComponent{
  type="dashboard";
  tabIndex:number;
  constructor(private router:Router, private store: Store<AppStates>) {
    this.router.navigateByUrl("/admin/dashboard")
    this.store.dispatch(fromActions.isAdmin({isAdmin:true}))
    }

  setEvent(name: string) {
    this.type = name;
  }

}
