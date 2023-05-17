/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
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
import * as fromActions from "../../actions/assessment-data.actions";
import {ParameterRequest} from "../../types/parameterRequest";


@Component({
  selector: 'app-question-level-rating',
  templateUrl: './question-level-rating.component.html',
  styleUrls: ['./question-level-rating.component.css']
})
export class QuestionLevelRatingComponent implements OnInit, OnDestroy {

  @Input()
  parameterId: number

  @Input()
  topicId: number

  @Input()
  references: QuestionReference[] | undefined

  @Input()
  question: Notes

  @Input()
  assessmentId: number

  @Input()
  parameterName: string

  @Input()
  parameters: ParameterRequest[]

  maturityScoreTitle = data_local.ASSESSMENT_TOPIC.MATURITY_SCORE_TITLE.split('-')[0];
  serverError: string = data_local.SHOW_ERROR_MESSAGE.POPUP_ERROR
  masterData: Observable<AssessmentStructure>;
  private destroy$: Subject<void> = new Subject<void>();
  assessmentStatus: string;
  assessmentResponse: AssessmentStructure;

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
      if (this.question.rating !== 0) {
        this.appService.saveQuestionRating(this.assessmentId, this.question.questionId, this.question.rating).pipe(takeUntil(this.destroy$)).subscribe({
          next: (_data) => {
            this.sendRating()
            this.updateAverageRating()
          }, error: _error => {
            this.showError(this.serverError);
          }
        })
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

  updateAverageRating() {
    let averageRating = 0;
    let ratingSum = 0
    let ratingNumber = 0
    let index = 0;
    for (let pId in this.parameters) {
      if (this.parameters[pId].parameterRatingAndRecommendation && this.assessmentResponse.parameterRatingAndRecommendation !== undefined) {
          index = this.assessmentResponse.parameterRatingAndRecommendation.findIndex(eachParameter => eachParameter.parameterId === this.parameters[pId].parameterRatingAndRecommendation.parameterId)
          if (index !== -1 && this.assessmentResponse.parameterRatingAndRecommendation[index].rating !== undefined) {
            ratingSum = ratingSum + Number(this.assessmentResponse.parameterRatingAndRecommendation[index].rating);
            ratingNumber = ratingNumber + 1;
        }
      }
     if (this.parameters[pId].answerRequest !== undefined) {
        let questionCount = 0;
        let questionSum = 0;
        let hasQuestionRating = false;
        for (let answer in this.parameters[pId].answerRequest) {
          if (this.parameters[pId].answerRequest[answer].rating !== undefined) {
            hasQuestionRating = true;
            questionSum = questionSum + Number(this.parameters[pId].answerRequest[answer].rating);
            questionCount += 1
          }
        }
        if (questionCount !== 0 && questionSum !== 0 && hasQuestionRating) {
          ratingNumber = ratingNumber + 1;
          ratingSum =ratingSum+ Math.round(questionSum / questionCount);
        }
      }
    }
    if (ratingSum !== 0 && ratingNumber !== 0) {
      averageRating = Math.round(ratingSum / ratingNumber);
    }
    this.sendAverageRating(averageRating);
  }

  private sendRating() {
    let index = 0;
    let updatedRatingList: Notes[] = [];
    updatedRatingList.push(this.question);
    if (this.assessmentResponse.answerResponseList !== undefined) {
      index = this.assessmentResponse.answerResponseList.findIndex(eachAnswer => eachAnswer.questionId === this.question.questionId)
      if (index !== -1) {
        this.assessmentResponse.answerResponseList[index].rating = this.question.rating
      } else {
        this.assessmentResponse.answerResponseList.push(this.question)
      }
    } else {
      this.assessmentResponse.answerResponseList = updatedRatingList
    }
    this.assessmentResponse.updatedAt = Number(new Date(Date.now()))
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.assessmentResponse}))
  }

  private sendAverageRating(rating: number) {
    let averageRating = {rating: rating, topicId: this.topicId}
    this.store.dispatch(fromActions.setAverageComputedScore({averageScoreDetails: averageRating}))
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
