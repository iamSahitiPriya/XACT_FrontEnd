/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Inject, OnInit} from '@angular/core';
import {OKTA_AUTH} from '@okta/okta-angular';
import {OktaAuth} from '@okta/okta-auth-js';
import {AssessmentStructure} from "../../types/assessmentStructure";
import {data_local} from "../../../assets/messages";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAuthenticated?: boolean;
  public static answerSaved:string
  assessment: AssessmentStructure;
  microSite = data_local.HEADER_LINK_TEXT.MICRO_SITE;
  support = data_local.HEADER_LINK_TEXT.SUPPORT;
  feedback= data_local.HEADER_LINK_TEXT.FEEDBACK;
  logout = data_local.HEADER_LINK_TEXT.LOGOUT;

  constructor(@Inject(OKTA_AUTH) public oktaAuth: OktaAuth) {
  }

  username?: string
  async ngOnInit(): Promise<void> {
    this.username = (await this.oktaAuth.getUser()).name;
  }

}
