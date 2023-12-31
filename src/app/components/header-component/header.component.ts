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
import {Store} from "@ngrx/store";
import {AppStates} from "../../reducers/app.states";
import * as fromActions from "../../actions/assessment-data.actions";

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

  constructor(@Inject(OKTA_AUTH) public oktaAuth: OktaAuth,private appService: AppServiceService,private store: Store<AppStates>) {
  }

  username: string|undefined = ""
  isAdmin: boolean = false;
  isContributor: boolean = false;
  contributorRole: string;
  admin : string = data_local.ADMIN.ROLE.ADMIN
  reviewer : string = data_local.CONTRIBUTOR.ROLE.REVIEWER
  author : string = data_local.CONTRIBUTOR.ROLE.AUTHOR
  private loggedInUserEmail: string | undefined;

  async ngOnInit(): Promise<void> {
    this.username = (await this.oktaAuth.getUser()).name;
    this.loggedInUserEmail = ( await this.oktaAuth.getUser()).email || "";
    this.store.dispatch(fromActions.loggedInUserEmail({email:this.loggedInUserEmail}))
    this.userRole.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.store.dispatch(fromActions.loggedInUserRole({roles:data}))
      if (data.includes("PRIMARY_ADMIN") || data.includes("SECONDARY_ADMIN")) {
        this.isAdmin = true;
      }
      if(data.includes(this.reviewer)) {
        this.isContributor = true;
        this.contributorRole = this.reviewer.toLowerCase();
      }

      if(data.includes(this.author) ) {
        this.isContributor = true;
        this.contributorRole = this.author.toLowerCase()
      }
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
