/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, takeUntil} from "rxjs";
import {AppStates, ComputedScore} from "../../reducers/app.states";
import {Store} from "@ngrx/store";
import {data_local} from "../../messages";


@Component({
  selector: 'app-assessment-average-rating',
  templateUrl: './assessment-average-rating.component.html',
  styleUrls: ['./assessment-average-rating.component.css']
})
export class AssessmentAverageRatingComponent implements OnInit, OnDestroy {

  finalAverageRating: Observable<ComputedScore>
  private destroy$: Subject<void> = new Subject<void>();


  disableRating: number = 0
  averageRating: number = 0;

  @Input()
  topicId: number

  averageRatingTitle = data_local.TOPIC_AVERAGE_RATING.TITLE;

  constructor(private store: Store<AppStates>) {
    this.finalAverageRating = this.store.select(fromReducer => fromReducer.computedScore)

  }

  ngOnInit(): void {
    this.finalAverageRating.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data !== undefined) {
        if (this.topicId === data.scoreDetails.topicId && data.scoreDetails.rating !== undefined) {
          this.averageRating = data.scoreDetails.rating
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
