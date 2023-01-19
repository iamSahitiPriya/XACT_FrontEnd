/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TopicLevelRecommendation} from "../../types/topicLevelRecommendation";

import {AppServiceService} from "../../services/app-service/app-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Store} from "@ngrx/store";
import {AppStates} from "../../reducers/app.states";
import {debounce} from "lodash";
import {TopicLevelRecommendationTextRequest} from "../../types/topicLevelRecommendationTextRequest";
import {TopicRecommendationResponse} from "../../types/topicRecommendationRespose";
import {Observable, Subject, takeUntil} from "rxjs";
import {AssessmentStructure} from "../../types/assessmentStructure";
import * as fromActions from "../../actions/assessment-data.actions";
import {TopicRatingAndRecommendation} from "../../types/topicRatingAndRecommendation";
import {UntypedFormGroup} from "@angular/forms";
import {data_local} from 'src/app/messages';
import {NotificationSnackbarComponent} from "../notification-component/notification-component.component";
import {ActivityLogResponse} from "../../types/activityLogResponse";

export const topicRecommendationData = [{}]
let DEBOUNCE_TIME = 800;

@Component({
  selector: 'app-topic-level-recommendation',
  templateUrl: './topic-level-recommendation.component.html',
  styleUrls: ['./topic-level-recommendation.component.css']
})
export class TopicLevelRecommendationComponent implements OnInit, OnDestroy {

  @Input()
  recommendation: TopicLevelRecommendation

  @Input()
  assessmentId: number

  @Input()
  topicId: number

  @Input()
  topicRecommendationArray: TopicLevelRecommendation[] | undefined

  @Input()
  index: number;

  form: UntypedFormGroup;
  autoSave:string
  @Input()
  activityRecords:ActivityLogResponse[]

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

  assessmentStatus: string;
  topicRecommendationResponse1: Observable<AssessmentStructure>;
  private cloneTopicRecommendationResponse: AssessmentStructure;
  private cloneTopicLevelRecommendationResponse: AssessmentStructure;
  topicRecommendationResponse: AssessmentStructure;
  topicRecommendationIndex: number | undefined
  component: { assessmentId: number; assessmentName: string; organisationName: string; assessmentStatus: string; updatedAt: number; domain: string; industry: string; teamSize: number; users: never[]; answerResponseList: { questionId: number; answer: string; }[]; parameterRatingAndRecommendation: never[]; };
  recommendationId: number;
  typingText = data_local.ASSESSMENT.TYPING_TEXT;
  userEmail: string;

  constructor(private appService: AppServiceService, private _snackBar: MatSnackBar, private store: Store<AppStates>) {
    this.topicRecommendationResponse1 = this.store.select((storeMap) => storeMap.assessmentState.assessments)
    this.saveParticularTopicRecommendationText = debounce(this.saveParticularTopicRecommendationText, DEBOUNCE_TIME)
  }

  recommendations: TopicLevelRecommendation = {
    recommendationId: undefined,
    recommendation: "",
    impact: "",
    effort: "",
    deliveryHorizon: ""
  }

  topicLevelRecommendationText: TopicLevelRecommendationTextRequest = {
    assessmentId: 0, topicId: 0, topicLevelRecommendation: this.recommendations
  }
  topicLevelRecommendationResponse: TopicRecommendationResponse = {
    assessmentId: 0,
    topicId: 0,
    recommendationId: undefined,
    recommendation: "",
    impact: "",
    effort: "",
    deliveryHorizon: ""
  };

  topicRecommendationSample: TopicLevelRecommendation[] | undefined;
  deleteRecommendationText: string = "Delete Recommendation";
  private destroy$: Subject<void> = new Subject<void>();


  showError(message: string) {
    this._snackBar.openFromComponent(NotificationSnackbarComponent, {
      data : { message  : message, iconType : "error_outline", notificationType: "Error:"},panelClass: ['error-snackBar'],
      duration : 2000,
      verticalPosition : "top",
      horizontalPosition : "center"
    })
  }


  ngOnInit(): void {
    this.topicRecommendationResponse1.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data !== undefined) {
        this.assessmentStatus = data.assessmentStatus
        this.topicRecommendationResponse = data
      }
    })

  }
  ngOnChanges(): void {
    if( this.activityRecords.length > 0) {
      for (let record of this.activityRecords) {
        if (record.identifier === this.recommendation.recommendationId) {
          this.recommendation.recommendation = record.inputText
          this.userEmail=record.userName
        }
      }
    }
    else this.userEmail =""
  }


  saveParticularTopicRecommendationText(_$event: KeyboardEvent) {

    this.topicLevelRecommendationText.assessmentId = this.assessmentId;
    this.topicLevelRecommendationText.topicId = this.topicId;
    if(this.setRecommendationsFields() !== null) {
    this.setTopicLevelRecommendationResponse()
      this.topicLevelRecommendationText.topicLevelRecommendation = this.recommendations;
      this.autoSave = "Auto Saved"
      this.recommendationId = 1
      this.appService.saveTopicRecommendation(this.topicLevelRecommendationText).pipe(takeUntil(this.destroy$)).subscribe({
        next: (_data) => {
          this.topicLevelRecommendationResponse.recommendationId = _data.recommendationId;
          this.autoSave = ""
          this.recommendationId = -1
          this.recommendation.recommendationId = this.topicLevelRecommendationResponse.recommendationId;
          this.sendRecommendation(this.topicLevelRecommendationResponse)
          this.updateDataSavedStatus()
        }, error: _error => {
          this.showError("Data cannot be saved");
        }
      })
    }
  }

  private setRecommendationsFields() : TopicLevelRecommendation | null{
    if(this.recommendation.recommendationId === undefined && this.recommendation.recommendation === "" && this.recommendation.effort === "" && this.recommendation.impact === "" && this.recommendation.deliveryHorizon === "") {
      return null;
    }
    else {
      this.recommendations.recommendationId = this.recommendation.recommendationId;
      this.recommendations.recommendation = this.recommendation.recommendation;
      this.recommendations.effort = this.recommendation.effort;
      this.recommendations.impact = this.recommendation.impact;
      this.recommendations.deliveryHorizon = this.recommendation.deliveryHorizon;
    }
    return this.recommendation
  }

  private setTopicLevelRecommendationResponse() {
    this.topicLevelRecommendationResponse.topicId = this.topicId;
    this.topicLevelRecommendationResponse.assessmentId = this.assessmentId;
    this.topicLevelRecommendationResponse.recommendationId = this.recommendation.recommendationId;
    this.topicLevelRecommendationResponse.recommendation = this.recommendation.recommendation;
    this.topicLevelRecommendationResponse.effort = this.recommendation.effort;
    this.topicLevelRecommendationResponse.impact = this.recommendation.impact;
    this.topicLevelRecommendationResponse.deliveryHorizon = this.recommendation.deliveryHorizon;
  }

  private sendRecommendation(topicLevelRecommendationResponse: TopicRecommendationResponse) {
    let index = 0;
    let updatedRecommendationList = [];
    this.cloneTopicRecommendationResponse = Object.assign({}, this.topicRecommendationResponse)
    let topicRecommendation: TopicRatingAndRecommendation = {
      topicId: topicLevelRecommendationResponse.topicId,
      rating: 0,
      topicLevelRecommendation: [{
        recommendationId: topicLevelRecommendationResponse.recommendationId,
        recommendation: topicLevelRecommendationResponse.recommendation,
        impact: topicLevelRecommendationResponse.impact,
        effort: topicLevelRecommendationResponse.effort,
        deliveryHorizon: topicLevelRecommendationResponse.deliveryHorizon
      }]
    };
    updatedRecommendationList.push(topicRecommendation);
    if (this.cloneTopicRecommendationResponse.topicRatingAndRecommendation != undefined) {
      index = this.cloneTopicRecommendationResponse.topicRatingAndRecommendation.findIndex(eachTopic => eachTopic.topicId === topicLevelRecommendationResponse.topicId)
      if (index !== -1) {
        this.topicRecommendationSample = this.cloneTopicRecommendationResponse.topicRatingAndRecommendation[index].topicLevelRecommendation;
        this.getRecommendation(this.topicRecommendationSample, topicLevelRecommendationResponse)
        topicRecommendation.rating = this.cloneTopicRecommendationResponse.topicRatingAndRecommendation[index].rating;
        this.cloneTopicRecommendationResponse.topicRatingAndRecommendation[index].topicLevelRecommendation = this.topicRecommendationSample;
      } else {
        this.cloneTopicRecommendationResponse.topicRatingAndRecommendation.push(topicRecommendation);
      }
    } else {
      this.cloneTopicRecommendationResponse.topicRatingAndRecommendation = updatedRecommendationList;
    }
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneTopicRecommendationResponse}))

  }

  getRecommendation(topicRecommendationSample: TopicLevelRecommendation[] | undefined, topicRecommendationResponse: TopicRecommendationResponse) {
    if (topicRecommendationSample != undefined) {
      this.topicRecommendationIndex = topicRecommendationSample.findIndex(eachRecommendation => eachRecommendation.recommendationId === topicRecommendationResponse.recommendationId);
      if (this.topicRecommendationIndex !== -1) {
        topicRecommendationSample[this.topicRecommendationIndex].recommendationId = topicRecommendationResponse.recommendationId;
        topicRecommendationSample[this.topicRecommendationIndex].recommendation = topicRecommendationResponse.recommendation;
        topicRecommendationSample[this.topicRecommendationIndex].impact = topicRecommendationResponse.impact;
        topicRecommendationSample[this.topicRecommendationIndex].effort = topicRecommendationResponse.effort;
        topicRecommendationSample[this.topicRecommendationIndex].deliveryHorizon = topicRecommendationResponse.deliveryHorizon;
      } else {
        topicRecommendationSample.push(topicRecommendationResponse);
      }
    }
  }

  updateDataSavedStatus() {
    this.cloneTopicLevelRecommendationResponse = Object.assign({}, this.topicRecommendationResponse)
    this.cloneTopicLevelRecommendationResponse.updatedAt = Number(new Date(Date.now()))
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneTopicLevelRecommendationResponse}))
  }

  inputChange() {
    this.topicLevelRecommendationText.assessmentId = this.assessmentId;
    this.topicLevelRecommendationText.topicId = this.topicId;
    this.setRecommendationsFields()
    this.setTopicLevelRecommendationResponse()
    this.appService.saveTopicRecommendation(this.topicLevelRecommendationText).pipe(takeUntil(this.destroy$)).subscribe({
      next: (_data) => {
        this.sendRecommendation(this.topicLevelRecommendationResponse)
        this.updateDataSavedStatus()
      }, error: _error => {
        this.showError("Data cannot be saved");
      }
    })
  }


  deleteTemplate(recommendation: TopicLevelRecommendation) {
    let index = -1;
    if (this.topicRecommendationArray != undefined) {
      index = this.topicRecommendationArray.indexOf(recommendation);
      if (index !== -1) {
        this.topicRecommendationArray?.splice(index,1);
        this.deleteRecommendationTemplate(recommendation,index);
      }
    }

  }

  disableFields(recommendationId: number | undefined): boolean {
    return recommendationId === undefined;
  }

  deleteRecommendationTemplate(recommendation: TopicLevelRecommendation,index:number) {
    if (recommendation.recommendationId != undefined) {
      this.appService.deleteTopicRecommendation(this.assessmentId, this.topicId, recommendation.recommendationId).subscribe({
        error: _error => {
          this.topicRecommendationArray?.splice(index,1,recommendation);
          this.showError("Data cannot be deleted");
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
