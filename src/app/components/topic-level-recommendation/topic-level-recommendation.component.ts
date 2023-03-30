/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {TopicLevelRecommendation} from "../../types/topicLevelRecommendation";

import {AppServiceService} from "../../services/app-service/app-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Store} from "@ngrx/store";
import {AppStates} from "../../reducers/app.states";
import {debounce} from "lodash";
import {Observable, Subject, takeUntil} from "rxjs";
import {AssessmentStructure} from "../../types/assessmentStructure";
import * as fromActions from "../../actions/assessment-data.actions";
import {TopicRatingAndRecommendation} from "../../types/topicRatingAndRecommendation";
import {data_local} from 'src/app/messages';
import {NotificationSnackbarComponent} from "../notification-component/notification-component.component";
import {ActivityLogResponse} from "../../types/activityLogResponse";

export const topicRecommendationData = [{}]
let DEBOUNCE_TIME = 800;

const NOTIFICATION_DURATION = 2000;

@Component({
  selector: 'app-topic-level-recommendation',
  templateUrl: './topic-level-recommendation.component.html',
  styleUrls: ['./topic-level-recommendation.component.css']
})
export class TopicLevelRecommendationComponent implements OnInit, OnDestroy, OnChanges {

  @Input()
  recommendation: TopicLevelRecommendation

  @Input()
  assessmentId: number

  @Input()
  topicId: number

  @Input()
  topicRecommendations: TopicLevelRecommendation[] | undefined

  @Input()
  recommendationIndex: number;

  @Input()
  activityRecords: ActivityLogResponse[]

  autoSave: string
  isSaving: boolean
  recommendationLabel = data_local.ASSESSMENT_TOPIC.RECOMMENDATION_LABEL
  inputWarningLabel = data_local.LEGAL_WARNING_MSG_FOR_INPUT;
  Impact = data_local.RECOMMENDATION_TEXT.IMPACT_LABEL;
  Effort = data_local.RECOMMENDATION_TEXT.EFFORT;
  Delivery_Horizon = data_local.RECOMMENDATION_TEXT.DELIVERY_HORIZON;
  High = data_local.RECOMMENDATION_TEXT.IMPACT_1;
  Medium = data_local.RECOMMENDATION_TEXT.IMPACT_2;
  Low = data_local.RECOMMENDATION_TEXT.IMPACT_3;
  Now = data_local.RECOMMENDATION_TEXT.DH_1;
  Next = data_local.RECOMMENDATION_TEXT.DH_2;
  Later = data_local.RECOMMENDATION_TEXT.DH_3;
  Delete = data_local.RECOMMENDATION_TEXT.DELETE;
  maxLimit: number = data_local.RECOMMENDATION_TEXT.LIMIT;
  deleteRecommendationText: string = data_local.RECOMMENDATION_TEXT.DELETE_RECOMMENDATION;
  autoSaveText : string = data_local.AUTO_SAVE.AUTO_SAVE_MESSAGE
  serverError : string = data_local.SHOW_ERROR_MESSAGE.POPUP_ERROR
  deleteError : string = data_local.SHOW_ERROR_MESSAGE.DELETE_ERROR
  assessmentStatus: string;
  assessmentData: Observable<AssessmentStructure>;
  cloneAssessmentData: AssessmentStructure;
  component: { assessmentId: number; assessmentName: string; organisationName: string; assessmentStatus: string; updatedAt: number; domain: string; industry: string; teamSize: number; users: never[]; answerResponseList: { questionId: number; answer: string; }[]; parameterRatingAndRecommendation: never[]; };
  recommendationId: number;
  latestActivityRecord: ActivityLogResponse = {activityType: "", email: "", fullName: "", identifier: 0, inputText: ""}
  activateSpinner: boolean = false;
  cloneTopicRecommendations: TopicLevelRecommendation[] | undefined;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private appService: AppServiceService, private _snackBar: MatSnackBar, private store: Store<AppStates>) {
    this.assessmentData = this.store.select((storeMap) => storeMap.assessmentState.assessments)
    this.saveTopicRecommendation = debounce(this.saveTopicRecommendation, DEBOUNCE_TIME)
  }

  showError(message: string) {
    this._snackBar.openFromComponent(NotificationSnackbarComponent, {
      data: {message: message, iconType: "error_outline", notificationType: "Error:"}, panelClass: ['error-snackBar'],
      duration: NOTIFICATION_DURATION,
      verticalPosition: "top",
      horizontalPosition: "center"
    })
  }

  ngOnInit(): void {
    this.assessmentData.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data !== undefined) {
        this.assessmentStatus = data.assessmentStatus
        this.cloneAssessmentData = data
      }
    })

  }

  ngOnChanges(): void {
    this.latestActivityRecord.identifier = -1
    if (this.activityRecords.length > 0) {
      for (let record of this.activityRecords) {
        if (record.identifier === this.recommendation.recommendationId) {
          this.recommendation.recommendationText = record.inputText
          this.latestActivityRecord = {
            activityType: record.activityType,
            email: record.email,
            fullName: record.fullName,
            identifier: record.identifier,
            inputText: ""
          }
          this.activateSpinner = !this.activateSpinner

        }
      }
    } else {
      this.latestActivityRecord = {activityType: "", email: "", fullName: "", identifier: -1, inputText: ""}
    }
  }

  saveTopicRecommendation() {
      this.autoSave = this.autoSaveText
      this.isSaving = true
      this.appService.saveTopicRecommendation(this.assessmentId, this.topicId, this.recommendation).pipe(takeUntil(this.destroy$)).subscribe({
        next: (_data) => {
          this.recommendation.recommendationId = _data.recommendationId;
          this.autoSave = ""
          this.isSaving = false
          this.sendRecommendation(this.recommendation)
          this.updateDataSavedStatus()
        }, error: _error => {
          this.showError(this.serverError);
        }
      })
  }

  deleteRecommendation(recommendation: TopicLevelRecommendation) {
    let index = this.getRecommendationIndex(recommendation);

    if (index !== -1) {
      this.topicRecommendations?.splice(index, 1);
      if(recommendation.recommendationId !== undefined) {
        this.appService.deleteTopicRecommendation(this.assessmentId, this.topicId, recommendation.recommendationId).subscribe({
          error: _error => {
            this.topicRecommendations?.splice(index, 1, recommendation);
            this.showError(this.deleteError);
          }
        })
      }
    }
  }

  sendRecommendation(recommendation: TopicLevelRecommendation) {
    let updatedRecommendationList = [];
    let topicRecommendation: TopicRatingAndRecommendation = {
      topicId: this.topicId,
      rating: 0,
      topicLevelRecommendation: [{
        recommendationId: recommendation.recommendationId,
        recommendationText: recommendation.recommendationText,
        impact: recommendation.impact,
        effort: recommendation.effort,
        deliveryHorizon: recommendation.deliveryHorizon
      }]
    };
    updatedRecommendationList.unshift(topicRecommendation);
    if (this.cloneAssessmentData.topicRatingAndRecommendation !== undefined) {
      this.setRecommendationForTopic(recommendation, topicRecommendation);
    } else {
      this.cloneAssessmentData.topicRatingAndRecommendation = updatedRecommendationList;
    }
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneAssessmentData}))
  }

  private updateDataSavedStatus() {
    this.cloneAssessmentData = Object.assign({}, this.cloneAssessmentData)
    this.cloneAssessmentData.updatedAt = Number(new Date(Date.now()))
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneAssessmentData}))
  }

  private setRecommendationForTopic(recommendation: TopicLevelRecommendation, topicRecommendation: TopicRatingAndRecommendation) {
    let index = this.cloneAssessmentData.topicRatingAndRecommendation.findIndex(eachTopic => eachTopic.topicId === this.topicId)
    if (index !== -1) {
      this.cloneTopicRecommendations = this.cloneAssessmentData.topicRatingAndRecommendation[index].topicLevelRecommendation;
      this.setRecommendation(this.cloneTopicRecommendations, recommendation)
      topicRecommendation.rating = this.cloneAssessmentData.topicRatingAndRecommendation[index].rating;
      this.cloneAssessmentData.topicRatingAndRecommendation[index].topicLevelRecommendation = this.cloneTopicRecommendations;
    } else {
      this.cloneAssessmentData.topicRatingAndRecommendation.unshift(topicRecommendation);
    }
  }

  setRecommendation(topicRecommendations: TopicLevelRecommendation[] | undefined, recommendation: TopicLevelRecommendation) {
    if (topicRecommendations !== undefined) {
      let index = topicRecommendations.findIndex(eachRecommendation => eachRecommendation.recommendationId === recommendation.recommendationId);
      if (index !== -1) {
        topicRecommendations[index] = recommendation
      } else {
        topicRecommendations.unshift(recommendation);
      }
    }
  }

  private getRecommendationIndex(recommendation: TopicLevelRecommendation) : number {
    let index = -1;
    if (this.topicRecommendations != undefined) {
      index = this.topicRecommendations.map(rec => rec.recommendationId).indexOf(recommendation.recommendationId);
    }
    return index;
  }

  disableFields(recommendationId: number | undefined): boolean {
    return recommendationId === undefined;
  }

  isActivityFound() {
    return this.latestActivityRecord.email.length > 0 && this.latestActivityRecord.identifier === this.recommendation.recommendationId;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
