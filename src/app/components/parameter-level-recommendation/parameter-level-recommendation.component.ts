/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {ParameterLevelRecommendation} from "../../types/parameterLevelRecommendation";

import {AppServiceService} from "../../services/app-service/app-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Store} from "@ngrx/store";
import {AppStates} from "../../reducers/app.states";
import {debounce} from "lodash";
import {Observable, Subject, takeUntil} from "rxjs";
import {AssessmentStructure} from "../../types/assessmentStructure";
import * as fromActions from "../../actions/assessment-data.actions";
import {ParameterRatingAndRecommendation} from "../../types/parameterRatingAndRecommendation";
import {data_local} from 'src/app/messages';
import {NotificationSnackbarComponent} from "../notification-component/notification-component.component";
import {ActivityLogResponse} from "../../types/activityLogResponse";
import {TopicLevelRecommendation} from "../../types/topicLevelRecommendation";

let DEBOUNCE_TIME = 800;
const NOTIFICATION_DURATION = 2000;

@Component({
  selector: 'app-parameter-level-recommendation',
  templateUrl: './parameter-level-recommendation.component.html',
  styleUrls: ['./parameter-level-recommendation.component.css']
})
export class ParameterLevelRecommendationComponent implements OnInit, OnDestroy, OnChanges {

  @Input()
  recommendation: ParameterLevelRecommendation

  @Input()
  assessmentId: number

  @Input()
  topicId: number

  @Input()
  parameterId: number

  @Input()
  parameterRecommendations: ParameterLevelRecommendation[] | undefined

  @Input()
  parameterIndex: number;

  @Input()
  activityRecord: ActivityLogResponse[]

  autoSave: string;
  isSaving: boolean

  recommendationLabel = data_local.ASSESSMENT_TOPIC.RECOMMENDATION_LABEL
  inputWarningLabel = data_local.LEGAL_WARNING_MSG_FOR_INPUT
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
  autoSaveText: string = data_local.AUTO_SAVE.AUTO_SAVE_MESSAGE
  serverError: string = data_local.SHOW_ERROR_MESSAGE.POPUP_ERROR
  assessmentStatus: string;
  assessmentData: Observable<AssessmentStructure>;
  cloneAssessmentData: AssessmentStructure;
  parameterRecommendationIndex: number | undefined
  deleteRecommendationText: string = data_local.RECOMMENDATION_TEXT.DELETE_RECOMMENDATION
  private destroy$: Subject<void> = new Subject<void>();
  latestActivityRecord: ActivityLogResponse = {activityType: "", email: "", fullName: "", identifier: 0, inputText: ""}
  activateSpinner: boolean = false;
  cloneParameterRecommendations: ParameterLevelRecommendation[] | undefined;
  private deleteError: string = data_local.SHOW_ERROR_MESSAGE.DELETE_ERROR;


  constructor(private appService: AppServiceService, private _snackBar: MatSnackBar, private store: Store<AppStates>) {
    this.assessmentData = this.store.select((storeMap) => storeMap.assessmentState.assessments)
    this.saveParameterRecommendation = debounce(this.saveParameterRecommendation, DEBOUNCE_TIME)
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
    if (this.activityRecord.length > 0) {
      for (let record of this.activityRecord) {
        if (record.identifier === this.recommendation.recommendationId) {
          this.latestActivityRecord = {
            activityType: record.activityType,
            email: record.email,
            fullName: record.fullName,
            identifier: record.identifier,
            inputText: ""
          }
          this.recommendation.recommendationText = record.inputText
          this.activateSpinner = !this.activateSpinner
        }
      }
    } else {
      this.latestActivityRecord = {activityType: "", email: "", fullName: "", identifier: -1, inputText: ""}
    }
  }

  saveParameterRecommendation() {
    this.autoSave = this.autoSaveText
    this.isSaving = true
    this.appService.saveParameterRecommendation(this.assessmentId, this.parameterId, this.recommendation).pipe(takeUntil(this.destroy$)).subscribe({
      next: (_data) => {
        this.autoSave = ""
        this.isSaving = false
        this.recommendation.recommendationId = _data.recommendationId;
        this.sendRecommendation(this.recommendation)
        this.updateDataSavedStatus()
      }, error: _error => {
        this.showError(this.serverError);
      }
    })
  }

  deleteRecommendation(recommendation: ParameterLevelRecommendation) {
    let index = this.getRecommendationIndex(recommendation);
    if (index !== undefined) {
      this.parameterRecommendations?.splice(index, 1)
      if (recommendation.recommendationId != undefined) {
        this.appService.deleteParameterRecommendation(this.assessmentId, this.parameterId, recommendation.recommendationId).subscribe({
          error: _error => {
            this.parameterRecommendations?.splice(index, 1, recommendation);
            this.showError(this.deleteError);
          }
        })
      }
    }
  }

  sendRecommendation(recommendation: ParameterLevelRecommendation) {
    let updatedRecommendationList = [];
    let parameterRecommendation: ParameterRatingAndRecommendation = {
      parameterId: this.parameterId,
      rating: 0,
      parameterLevelRecommendation: [{
        recommendationId: recommendation.recommendationId,
        recommendationText: recommendation.recommendationText,
        impact: recommendation.impact,
        effort: recommendation.effort,
        deliveryHorizon: recommendation.deliveryHorizon
      }]
    };
    updatedRecommendationList.unshift(parameterRecommendation);
    if (this.cloneAssessmentData.parameterRatingAndRecommendation != undefined) {
      this.setRecommendationForParameter(recommendation, parameterRecommendation)
    } else {
      this.cloneAssessmentData.parameterRatingAndRecommendation = updatedRecommendationList;
    }
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneAssessmentData}))
  }

  private updateDataSavedStatus() {
    this.cloneAssessmentData = Object.assign({}, this.cloneAssessmentData)
    this.cloneAssessmentData.updatedAt = Number(new Date(Date.now()))
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneAssessmentData}))
  }

  private setRecommendationForParameter(recommendation: ParameterLevelRecommendation, parameterRecommendation: ParameterRatingAndRecommendation) {
    let index = this.cloneAssessmentData.parameterRatingAndRecommendation.findIndex(eachParameter => eachParameter.parameterId === this.parameterId)
    if (index !== -1) {
      this.cloneParameterRecommendations = this.cloneAssessmentData.parameterRatingAndRecommendation[index].parameterLevelRecommendation;
      this.setRecommendation(this.cloneParameterRecommendations, recommendation)
      parameterRecommendation.rating = this.cloneAssessmentData.parameterRatingAndRecommendation[index].rating;
      this.cloneAssessmentData.parameterRatingAndRecommendation[index].parameterLevelRecommendation = this.cloneParameterRecommendations;
    } else {
      this.cloneAssessmentData.parameterRatingAndRecommendation.unshift(parameterRecommendation);
    }
  }

  setRecommendation(parameterRecommendations: ParameterLevelRecommendation[] | undefined, recommendation: ParameterLevelRecommendation) {
    if (parameterRecommendations !== undefined) {
      let index = parameterRecommendations.findIndex(eachRecommendation => eachRecommendation.recommendationId === recommendation.recommendationId);
      if (index !== -1) {
        parameterRecommendations[index] = recommendation;
      } else {
        parameterRecommendations.unshift(recommendation);
      }
    }
  }

  private getRecommendationIndex(recommendation: TopicLevelRecommendation): number {
    let index = -1;
    if (this.parameterRecommendations != undefined) {
      index = this.parameterRecommendations.indexOf(recommendation);
    }
    return index;
  }

  disableFields(recommendationId: number | undefined): boolean {
    return recommendationId === undefined;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isActivityFound() {
    return this.latestActivityRecord.email.length > 0 && this.latestActivityRecord.identifier === this.recommendation.recommendationId;
  }

}
