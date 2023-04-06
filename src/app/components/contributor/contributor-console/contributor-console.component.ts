import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Subject, takeUntil} from "rxjs";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import * as fromActions from "../../../actions/assessment-data.actions";
import {Store} from "@ngrx/store";
import {AppStates} from "../../../reducers/app.states";
import {data_local} from "../../../messages";

@Component({
  selector: 'app-contributor-console',
  templateUrl: './contributor-console.component.html',
  styleUrls: ['./contributor-console.component.css']
})
export class ContributorConsoleComponent implements OnInit, OnDestroy {
  public type: string;
  private destroy$: Subject<void> = new Subject<void>();
  isAuthor: boolean = false;
  isReviewer: boolean = false;
  contributorConsole: string = data_local.CONTRIBUTOR.CONSOLE;
  author : string = data_local.CONTRIBUTOR.ROLE.AUTHOR;
  reviewer : string = data_local.CONTRIBUTOR.ROLE.REVIEWER;
  contributor : string = data_local.CONTRIBUTOR.CONTRIBUTOR
  authorText : string = data_local.CONTRIBUTOR.ROLE.DISPLAY_TEXT.AUTHOR
  reviewerText : string = data_local.CONTRIBUTOR.ROLE.DISPLAY_TEXT.REVIEWER

  // searchBarText: string = data_local.CONTRIBUTOR.SEARCH_QUESTIONS;
  // searchText: string;
  // contributorTitle: string = data_local.CONTRIBUTOR.TITLE;


  constructor(public router: Router, private appService: AppServiceService, private store: Store<AppStates>) {
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const currentRoute = this.router.url.split('?')[0];
      const path = currentRoute.split('/').pop() || '';
      this.setEvent(path);
    })
  }

  ngOnInit(): void {
    this.appService.getUserRole().subscribe((data) => {
      if (data.includes(this.author))
        this.isAuthor = true
      if (data.includes(this.reviewer))
        this.isReviewer = true
    })
    this.store.dispatch(fromActions.loggedInUser({role: this.contributor.toLowerCase()}))

  }

  setEvent(type: string) {
    this.type = type

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
