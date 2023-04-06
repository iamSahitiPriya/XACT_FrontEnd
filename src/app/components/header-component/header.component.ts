/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {OKTA_AUTH} from '@okta/okta-angular';
import {OktaAuth} from '@okta/okta-auth-js';
import {AssessmentStructure} from "../../types/assessmentStructure";
import {data_local} from "../../messages";
import {Observable, Subject, takeUntil} from "rxjs";
import {AppServiceService} from "../../services/app-service/app-service.service";

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
  contributor = data_local.HEADER_LINK_TEXT.CONTRIBUTOR;
  logout = data_local.HEADER_LINK_TEXT.LOGOUT;
  adminConsole = data_local.HEADER_LINK_TEXT.ADMIN_CONSOLE;
  private destroy$: Subject<void> = new Subject<void>();


  @Input()
  userRole: Observable<string []>

  constructor(@Inject(OKTA_AUTH) public oktaAuth: OktaAuth,private appService: AppServiceService) {
  }

  username: string|undefined = ""
  isAdmin: boolean = false;
  isContributor: boolean = false;


  async ngOnInit(): Promise<void> {
    this.username = (await this.oktaAuth.getUser()).name;
    this.userRole.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data.includes("Admin")) {
        this.isAdmin = true;
      }
      if(data.includes("AUTHOR") || data.includes("REVIEWER"))
        this.isContributor = true;
    })
    this.appService.login();

  }
  async signOut() {
    await this.oktaAuth.signOut();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
