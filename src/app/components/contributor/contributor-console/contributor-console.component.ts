import {Component, OnDestroy, OnInit} from '@angular/core';
import * as fromActions from "../../../actions/assessment-data.actions";
import {Router} from "@angular/router";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-contributor-console',
  templateUrl: './contributor-console.component.html',
  styleUrls: ['./contributor-console.component.css']
})
export class ContributorConsoleComponent implements OnInit, OnDestroy {
  public type: string;
  private destroy$: Subject<void> = new Subject<void>();


  constructor(private router: Router) {
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(_res => {
      const currentRoute = this.router.url.split('?')[0];
      const path = currentRoute.split('/').pop() || '';
      this.setEvent(path);
    })
  }

  ngOnInit(): void {
  }

  setEvent(type: string) {
    this.type = type

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
