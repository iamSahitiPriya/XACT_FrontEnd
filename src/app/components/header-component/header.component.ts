/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {OKTA_AUTH} from '@okta/okta-angular';
import {OktaAuth} from '@okta/okta-auth-js';
import {AssessmentStructure} from "../../types/assessmentStructure";
import {data_local} from "../../messages";
import {Observable, Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated?: boolean;
  public static answerSaved: string
  assessment: AssessmentStructure;
  microSite = data_local.HEADER_LINK_TEXT.MICRO_SITE;
  support = data_local.HEADER_LINK_TEXT.SUPPORT;
  feedback = data_local.HEADER_LINK_TEXT.FEEDBACK;
  logout = data_local.HEADER_LINK_TEXT.LOGOUT;
  private destroy$: Subject<void> = new Subject<void>();


  @Input()
  userRole: Observable<Object>

  constructor(@Inject(OKTA_AUTH) public oktaAuth: OktaAuth) {
  }

  username: string = ""
  isRoleAdmin: boolean = false;

  async ngOnInit(): Promise<void> {
    // @ts-ignore
    this.username = (await this.oktaAuth.getUser()).name;
    this.userRole.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data == "Admin") {
        this.isRoleAdmin = true;
      }
    })
  }


  async signOut() {

    await this.oktaAuth.signOut();
    //window.location.href = "https://thoughtworks.okta.com";
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
