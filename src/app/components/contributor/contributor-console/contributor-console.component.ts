import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Subject, takeUntil} from "rxjs";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import * as fromActions from "../../../actions/assessment-data.actions";
import {Store} from "@ngrx/store";
import {AppStates} from "../../../reducers/app.states";

@Component({
  selector: 'app-contributor-console',
  templateUrl: './contributor-console.component.html',
  styleUrls: ['./contributor-console.component.css']
})
export class ContributorConsoleComponent implements OnInit, OnDestroy {
  public type: string;
  private destroy$: Subject<void> = new Subject<void>();
  isAuthor: boolean = false;
  isContributor: boolean = false;


  constructor(private router: Router, private appService : AppServiceService, private store : Store<AppStates>) {
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const currentRoute = this.router.url.split('?')[0];
      const path = currentRoute.split('/').pop() || '';
      this.setEvent(path);
    })
  }

  ngOnInit(): void {
    this.appService.getUserRole().subscribe((data) => {
      if(data.includes("Author"))
        this.isAuthor = true
      if(data.includes("Reviewer"))
        this.isContributor = true
    })
    this.store.dispatch(fromActions.user({role: "contributor"}))

  }

  setEvent(type: string) {
    this.type = type

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
