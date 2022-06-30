/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Inject, OnInit} from '@angular/core';
import {OKTA_AUTH} from '@okta/okta-angular';
import {OktaAuth} from '@okta/okta-auth-js';
import {Store} from "@ngrx/store";
import {AssessmentState} from "../../reducers/app.states";
import * as fromReducer from "../../reducers/assessment.reducer";
import {AssessmentStructure} from "../../types/assessmentStructure";
import {Observable} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAuthenticated?: boolean;
  public static answerSaved:string
  assessment: AssessmentStructure;

  constructor(@Inject(OKTA_AUTH) public oktaAuth: OktaAuth) {
  }

  username?: string
  async ngOnInit(): Promise<void> {
    this.username = (await this.oktaAuth.getUser()).name;
  }

}
