/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Input} from '@angular/core';
import {QuestionReference} from "../../types/QuestionReference";
import {Notes} from "../../types/answerNotes";
import {data_local} from "../../messages";
import {Observable, Subject, takeUntil} from "rxjs";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Store} from "@ngrx/store";
import {AppStates} from "../../reducers/app.states";
import {AssessmentStructure} from "../../types/assessmentStructure";
import {NotificationSnackbarComponent} from "../notification-component/notification-component.component";

@Component({
  selector: 'app-question-level-rating',
  templateUrl: './question-level-rating.component.html',
  styleUrls: ['./question-level-rating.component.css']
})
export class QuestionLevelRatingComponent  {

  @Input()
  parameterId : number

  @Input()
  topicId : number

  @Input()
  references : QuestionReference[] | undefined

  @Input()
  question : Notes

  @Input()
  assessmentId : number

  @Input()
  parameterName : string

  maturityScoreTitle = data_local.ASSESSMENT_TOPIC.MATURITY_SCORE_TITLE;
  serverError : string = data_local.SHOW_ERROR_MESSAGE.POPUP_ERROR
  private masterData: Observable<AssessmentStructure>;
  private destroy$: Subject<void> = new Subject<void>();
  private assessmentStatus: string;
  private assessmentResponse: AssessmentStructure;

  constructor(private appService: AppServiceService, private _snackBar: MatSnackBar, private store: Store<AppStates>) {
    this.masterData = this.store.select((storeMap) => storeMap.assessmentState.assessments)
  }

  ngOnInit() {
    this.masterData.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data !== undefined) {
        this.assessmentStatus = data.assessmentStatus
        this.assessmentResponse = data
      }
    })
  }

  setRating(rating: number) {
    if (this.assessmentStatus === 'Active') {
      if (this.question.rating === rating) {
        this.question.rating = undefined;
      } else {
        this.question.rating = rating;
      }
      if (this.question.rating != 0) {
        this.appService.saveQuestionRating(this.assessmentId, this.question.questionId, this.question.rating).pipe(takeUntil(this.destroy$)).subscribe({
          next: (_data) => {
            // this.sendRating(this.topicRatingResponse)
            // this.updateDataSavedStatus()

          }, error: _error => {
            this.showError(this.serverError);
          }
        })
        if (this.question.rating !== undefined) {
          // this.sendAverageRating(this.topicRatingAndRecommendation.rating)
        } else {
          // this.sendAverageRating(0)
        }
      }
    }
  }

  showError(message: string) {
    this._snackBar.openFromComponent(NotificationSnackbarComponent, {
      data: {message: message, iconType: "error_outline", notificationType: "Error:"}, panelClass: ['error-snackBar'],
      duration: 200000,
      verticalPosition: "top",
      horizontalPosition: "center"
    })
  }

  // private sendRating(topicRating: TopicRatingResponse) {
  //   let index = 0;
  //   let updatedRatingList = [];
  //   updatedRatingList.push(topicRating);
  //   this.cloneTopicResponse = Object.assign({}, this.answerResponse)
  //   if (this.cloneTopicResponse.topicRatingAndRecommendation !== undefined) {
  //     index = this.cloneTopicResponse.topicRatingAndRecommendation.findIndex(eachTopic => eachTopic.topicId === topicRating.topicId)
  //     if (index !== -1) {
  //       this.cloneTopicResponse.topicRatingAndRecommendation[index].rating = topicRating.rating
  //     } else {
  //       this.cloneTopicResponse.topicRatingAndRecommendation.push(topicRating)
  //     }
  //   } else {
  //     this.cloneTopicResponse.topicRatingAndRecommendation = updatedRatingList
  //   }
  //   this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneTopicResponse}))
  // }

  // private updateDataSavedStatus() {
  //   this.cloneAnswerResponse1 = Object.assign({}, this.answerResponse)
  //   this.cloneAnswerResponse1.updatedAt = Number(new Date(Date.now()))
  //   this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneAnswerResponse1}))
  // }

  // private sendAverageRating(rating: number) {
  //   this.sendAverageScore = {rating: rating, topicId: this.topicId}
  //   this.store.dispatch(fromActions.setAverageComputedScore({averageScoreDetails: this.sendAverageScore}))
  // }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
