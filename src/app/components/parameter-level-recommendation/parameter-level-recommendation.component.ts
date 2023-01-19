/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ParameterLevelRecommendation} from "../../types/parameterLevelRecommendation";

import {AppServiceService} from "../../services/app-service/app-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Store} from "@ngrx/store";
import {AppStates} from "../../reducers/app.states";
import {debounce} from "lodash";
import {ParameterLevelRecommendationTextRequest} from "../../types/parameterLevelRecommendationTextRequest";
import {ParameterRecommendationResponse} from "../../types/parameterRecommendationResponse";
import {Observable, Subject, takeUntil} from "rxjs";
import {AssessmentStructure} from "../../types/assessmentStructure";
import * as fromActions from "../../actions/assessment-data.actions";
import {ParameterRatingAndRecommendation} from "../../types/parameterRatingAndRecommendation";
import {UntypedFormGroup} from "@angular/forms";
import {data_local} from 'src/app/messages';
import {NotificationSnackbarComponent} from "../notification-component/notification-component.component";
import {ActivityLogResponse} from "../../types/activityLogResponse";

let DEBOUNCE_TIME = 800;

@Component({
  selector: 'app-parameter-level-recommendation',
  templateUrl: './parameter-level-recommendation.component.html',
  styleUrls: ['./parameter-level-recommendation.component.css']
})
export class ParameterLevelRecommendationComponent implements OnInit, OnDestroy {

  @Input()
  parameterLevelRecommendation: ParameterLevelRecommendation

  @Input()
  assessmentId: number

  @Input()
  topicId: number

  @Input()
  parameterId: number

  @Input()
  parameterRecommendationArray: ParameterLevelRecommendation[] | undefined

  @Input()
  parameterIndex: number;

  @Input()
  activityRecord:ActivityLogResponse[]

  form: UntypedFormGroup;
  autoSave : string;
  recommendationId:number

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

  assessmentStatus: string;
  parameterRecommendationResponse1: Observable<AssessmentStructure>;
  private cloneParameterRecommendationResponse: AssessmentStructure;
  private cloneParameterLevelRecommendationResponse: AssessmentStructure;
  parameterRecommendationResponse: AssessmentStructure;
  parameterRecommendationIndex: number | undefined
  userEmail: string;
  typingText = data_local.ASSESSMENT.TYPING_TEXT;

  constructor(private appService: AppServiceService, private _snackBar: MatSnackBar, private store: Store<AppStates>) {
    this.parameterRecommendationResponse1 = this.store.select((storeMap) => storeMap.assessmentState.assessments)
    this.saveParticularParameterText = debounce(this.saveParticularParameterText, DEBOUNCE_TIME)
  }

  parameterRecommendation: ParameterLevelRecommendation = {
    recommendationId: undefined,
    recommendation: "",
    impact: "",
    effort: "",
    deliveryHorizon: ""
  }

  parameterLevelRecommendationText: ParameterLevelRecommendationTextRequest = {
    assessmentId: 0, parameterId: 0, parameterLevelRecommendation: this.parameterRecommendation
  }
  parameterLevelRecommendationResponse: ParameterRecommendationResponse = {
    assessmentId: 0,
    parameterId: 0,
    recommendationId: undefined,
    recommendation: "",
    impact: "",
    effort: "",
    deliveryHorizon: ""
  };

  parameterRecommendationSample: ParameterLevelRecommendation[] | undefined;
  deleteRecommendationText: string = "Delete Recommendation";
  private destroy$: Subject<void> = new Subject<void>();

  showError(message: string) {
    this._snackBar.openFromComponent(NotificationSnackbarComponent, {
      data : { message  : message, iconType : "error_outline", notificationType: "Error:"}, panelClass: ['error-snackBar'],
      duration : 2000,
      verticalPosition : "top",
      horizontalPosition : "center"
    })
  }

  ngOnInit(): void {
    this.parameterRecommendationResponse1.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data !== undefined) {
        this.assessmentStatus = data.assessmentStatus
        this.parameterRecommendationResponse = data
      }
    })

  }
  ngOnChanges(): void {
    if( this.activityRecord.length > 0) {
      for (let record of this.activityRecord) {
        if (record.identifier === this.parameterLevelRecommendation.recommendationId) {
          this.parameterLevelRecommendation.recommendation = record.inputText
          this.userEmail=record.userName
        }
      }
    }
    else this.userEmail =""
  }

  saveParticularParameterText(_$event: KeyboardEvent) {
    this.parameterLevelRecommendationText.assessmentId = this.assessmentId;
    this.parameterLevelRecommendationText.parameterId = this.parameterId;
    if(this.setParameterRecommendationFields() !== null) {
      this.setParameterLevelRecommendationResponseFields();
      this.parameterLevelRecommendationText.parameterLevelRecommendation = this.parameterRecommendation;
      this.autoSave = "Auto Saved"
      this.recommendationId = 1
      this.appService.saveParameterRecommendation(this.parameterLevelRecommendationText).pipe(takeUntil(this.destroy$)).subscribe({
        next: (_data) => {
          this.autoSave = ""
          this.parameterLevelRecommendationResponse.recommendationId = _data.recommendationId;
          this.recommendationId = -1
          this.parameterLevelRecommendation.recommendationId = this.parameterLevelRecommendationResponse.recommendationId;
          this.sendRecommendation(this.parameterLevelRecommendationResponse)
          this.updateDataSavedStatus()
        }, error: _error => {
          this.showError("Data cannot be saved");
        }
      })
    }
  }

  private setParameterLevelRecommendationResponseFields() {
    this.parameterLevelRecommendationResponse.parameterId = this.parameterId;
    this.parameterLevelRecommendationResponse.assessmentId = this.assessmentId;
    this.parameterLevelRecommendationResponse.recommendationId = this.parameterLevelRecommendation.recommendationId;
    this.parameterLevelRecommendationResponse.recommendation = this.parameterLevelRecommendation.recommendation;
    this.parameterLevelRecommendationResponse.effort = this.parameterLevelRecommendation.effort;
    this.parameterLevelRecommendationResponse.impact = this.parameterLevelRecommendation.impact;
    this.parameterLevelRecommendationResponse.deliveryHorizon = this.parameterLevelRecommendation.deliveryHorizon;
  }

  private setParameterRecommendationFields() {
    if(this.parameterLevelRecommendation.recommendationId === undefined && this.parameterLevelRecommendation.recommendation === "" && this.parameterLevelRecommendation.effort === "" && this.parameterLevelRecommendation.impact === "" && this.parameterLevelRecommendation.deliveryHorizon === "") {
      return null;
    }
    else {
      this.parameterRecommendation.recommendationId = this.parameterLevelRecommendation.recommendationId;
      this.parameterRecommendation.recommendation = this.parameterLevelRecommendation.recommendation;
      this.parameterRecommendation.effort = this.parameterLevelRecommendation.effort;
      this.parameterRecommendation.impact = this.parameterLevelRecommendation.impact;
      this.parameterRecommendation.deliveryHorizon = this.parameterLevelRecommendation.deliveryHorizon;
    }
    return this.parameterLevelRecommendation
  }

  private sendRecommendation(parameterRecommendationResponse: ParameterRecommendationResponse) {
    let index = 0;
    let updatedRecommendationList = [];
    this.cloneParameterRecommendationResponse = Object.assign({}, this.parameterRecommendationResponse)
    let parameterRecommendation: ParameterRatingAndRecommendation = {
      parameterId: parameterRecommendationResponse.parameterId,
      rating: 0,
      parameterLevelRecommendation: [{
        recommendationId: parameterRecommendationResponse.recommendationId,
        recommendation: parameterRecommendationResponse.recommendation,
        impact: parameterRecommendationResponse.impact,
        effort: parameterRecommendationResponse.effort,
        deliveryHorizon: parameterRecommendationResponse.deliveryHorizon
      }]
    };
    updatedRecommendationList.push(parameterRecommendation);
    if (this.cloneParameterRecommendationResponse.parameterRatingAndRecommendation != undefined) {
      index = this.cloneParameterRecommendationResponse.parameterRatingAndRecommendation.findIndex(eachParameter => eachParameter.parameterId === parameterRecommendationResponse.parameterId)
      if (index !== -1) {
        this.parameterRecommendationSample = this.cloneParameterRecommendationResponse.parameterRatingAndRecommendation[index].parameterLevelRecommendation;
        this.getRecommendation(this.parameterRecommendationSample, parameterRecommendationResponse)
        parameterRecommendation.rating = this.cloneParameterRecommendationResponse.parameterRatingAndRecommendation[index].rating;
        this.cloneParameterRecommendationResponse.parameterRatingAndRecommendation[index].parameterLevelRecommendation = this.parameterRecommendationSample;
      } else {
        this.cloneParameterRecommendationResponse.parameterRatingAndRecommendation.push(parameterRecommendation);
      }
    } else {
      this.cloneParameterRecommendationResponse.parameterRatingAndRecommendation = updatedRecommendationList;
    }
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneParameterRecommendationResponse}))

  }

  getRecommendation(parameterRecommendationSample: ParameterLevelRecommendation[] | undefined, parameterRecommendationResponse: ParameterRecommendationResponse) {
    if (parameterRecommendationSample != undefined) {
      this.parameterRecommendationIndex = parameterRecommendationSample.findIndex(eachRecommendation => eachRecommendation.recommendationId === parameterRecommendationResponse.recommendationId);
      if (this.parameterRecommendationIndex !== -1) {
        parameterRecommendationSample[this.parameterRecommendationIndex].recommendationId = parameterRecommendationResponse.recommendationId;
        parameterRecommendationSample[this.parameterRecommendationIndex].recommendation = parameterRecommendationResponse.recommendation;
        parameterRecommendationSample[this.parameterRecommendationIndex].impact = parameterRecommendationResponse.impact;
        parameterRecommendationSample[this.parameterRecommendationIndex].effort = parameterRecommendationResponse.effort;
        parameterRecommendationSample[this.parameterRecommendationIndex].deliveryHorizon = parameterRecommendationResponse.deliveryHorizon;
      } else {
        parameterRecommendationSample.push(parameterRecommendationResponse);
      }
    }
  }

  updateDataSavedStatus() {
    this.cloneParameterLevelRecommendationResponse = Object.assign({}, this.parameterRecommendationResponse)
    this.cloneParameterLevelRecommendationResponse.updatedAt = Number(new Date(Date.now()))
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneParameterLevelRecommendationResponse}))
  }


  deleteTemplate(recommendation: ParameterLevelRecommendation) {
    let index = -1;
    if (this.parameterRecommendationArray != undefined) {
      index = this.parameterRecommendationArray.indexOf(recommendation);
      if (index !== -1) {
        this.parameterRecommendationArray?.splice(index,1);
        this.deleteRecommendationTemplate(recommendation,index);
      }
    }

  }

  disableFields(recommendationId: number | undefined): boolean {
    return recommendationId === undefined;
  }

  deleteRecommendationTemplate(recommendation: ParameterLevelRecommendation,index :number) {
    if (recommendation.recommendationId != undefined) {
      this.appService.deleteParameterRecommendation(this.assessmentId, this.parameterId, recommendation.recommendationId).subscribe({
        error: _error => {
          this.parameterRecommendationArray?.splice(index,1,recommendation);
          this.showError("Data cannot be deleted");
        }
      })
    }
  }

  inputChange() {
    this.parameterLevelRecommendationText.assessmentId = this.assessmentId;
    this.parameterLevelRecommendationText.parameterId = this.parameterId;
    this.setParameterRecommendationFields()
    this.setParameterLevelRecommendationResponseFields()
    this.parameterLevelRecommendationText.parameterLevelRecommendation = this.parameterRecommendation;
    this.appService.saveParameterRecommendation(this.parameterLevelRecommendationText).pipe(takeUntil(this.destroy$)).subscribe({
      next: (_data) => {
        this.sendRecommendation(this.parameterLevelRecommendationResponse)
        this.updateDataSavedStatus()
      }, error: _error => {
        this.showError("Data cannot be saved");
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
