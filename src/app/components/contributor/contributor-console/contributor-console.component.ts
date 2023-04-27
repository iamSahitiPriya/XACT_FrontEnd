import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Subject, takeUntil} from "rxjs";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import * as fromActions from "../../../actions/assessment-data.actions";
import {Store} from "@ngrx/store";
import {AppStates} from "../../../reducers/app.states";
import {data_local} from "../../../messages";
import {NestedTreeControl} from "@angular/cdk/tree";
import {MatTreeNestedDataSource} from "@angular/material/tree";

interface AuthorTree {
  name: string;
  children?: AuthorTree[];
}
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

   TREE_DATA: AuthorTree[] = [
    {
      name: 'Author',
      children: [{name: 'Topic'}, {name: 'Parameter'}],
    },
  ]
  treeControl = new NestedTreeControl<AuthorTree>(node => node.children);
  dataSource = new MatTreeNestedDataSource<AuthorTree>();

  constructor(public router: Router, private appService: AppServiceService, private store: Store<AppStates>) {
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const currentRoute = this.router.url.split('?')[0];
      const path = currentRoute.split('/').pop() || '';
      this.setEvent(path);
    })
    this.dataSource.data = this.TREE_DATA;
    this.store.dispatch(fromActions.loggedInUser({role: this.contributor.toLowerCase()}))
  }

  hasChild = (_: number, node: AuthorTree) => !!node.children && node.children.length > 0;
  ngOnInit(): void {
    this.appService.getUserRole().subscribe((data) => {
      if (data.includes(this.author))
        this.isAuthor = true
      if (data.includes(this.reviewer))
        this.isReviewer = true
    })
  }

  setEvent(type: string) {
    this.type = type

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
