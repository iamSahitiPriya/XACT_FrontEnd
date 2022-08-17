import {Component, Input, OnInit} from '@angular/core';
import {ParameterLevelRecommendation} from "../../types/parameterLevelRecommendation";
import {data_local} from "../../../assets/messages";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Store} from "@ngrx/store";
import {AssessmentState} from "../../reducers/app.states";
import * as fromReducer from "../../reducers/assessment.reducer";
import {debounce} from "lodash";
import {ParameterLevelRecommendationTextRequest} from "../../types/parameterLevelRecommendationTextRequest";
import {ParameterRecommendationResponse} from "../../types/parameterRecommendationResponse";
import {Observable} from "rxjs";
import {AssessmentStructure} from "../../types/assessmentStructure";
import * as fromActions from "../../actions/assessment-data.actions";
import {ParameterRatingAndRecommendation} from "../../types/parameterRatingAndRecommendation";

let DEBOUNCE_TIME = 1200;

@Component({
  selector: 'app-parameter-level-recommendation',
  templateUrl: './parameter-level-recommendation.component.html',
  styleUrls: ['./parameter-level-recommendation.component.css']
})
export class ParameterLevelRecommendationComponent implements OnInit {

  @Input()
  recommendation: ParameterLevelRecommendation

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


  recommendationLabel = data_local.ASSESSMENT_TOPIC.RECOMMENDATION_LABEL
  assessmentStatus: string;
  parameterRecommendationResponse1: Observable<AssessmentStructure>;
  private cloneParameterRecommendationResponse: AssessmentStructure;
  private cloneParameterLevelRecommendationResponse: AssessmentStructure;
  parameterRecommendationResponse: AssessmentStructure;
  parameterRecommendationIndex: number | undefined

  constructor(private appService: AppServiceService, private _snackBar: MatSnackBar, private store: Store<AssessmentState>) {
    this.parameterRecommendationResponse1 = this.store.select(fromReducer.getAssessments)
    this.saveParticularRecommendationText = debounce(this.saveParticularRecommendationText, DEBOUNCE_TIME)
    this.saveParticularRecommendationDeliveryHorizon = debounce(this.saveParticularRecommendationDeliveryHorizon, DEBOUNCE_TIME)
  }

  recommendations: ParameterLevelRecommendation = {
    recommendationId: undefined,
    recommendation: "",
    impact: "",
    effort: "",
    deliveryHorizon: ""
  }

  parameterLevelRecommendationText: ParameterLevelRecommendationTextRequest = {
    assessmentId: 0, parameterId: 0, parameterLevelRecommendation: this.recommendations
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


  showError(message: string, action: string) {
    this._snackBar.open(message, action, {
      verticalPosition: 'top',
      panelClass: ['errorSnackbar'],
      duration: 2000
    })
  }

  ngOnInit(): void {
    this.parameterRecommendationResponse1.subscribe(data => {
      if (data !== undefined) {
        this.assessmentStatus = data.assessmentStatus
        this.parameterRecommendationResponse = data
      }
    })

  }

  saveParticularRecommendationText(_$event: KeyboardEvent) {

    this.parameterLevelRecommendationText.assessmentId = this.assessmentId;
    this.parameterLevelRecommendationText.parameterId = this.parameterId;
    this.recommendations.recommendationId = this.recommendation.recommendationId;
    this.recommendations.recommendation = this.recommendation.recommendation;
    this.parameterLevelRecommendationResponse.parameterId = this.parameterId;
    this.parameterLevelRecommendationResponse.assessmentId = this.assessmentId;
    this.parameterLevelRecommendationResponse.recommendationId = this.recommendation.recommendationId;
    this.parameterLevelRecommendationResponse.recommendation = this.recommendation.recommendation;

    this.appService.saveParameterRecommendationText(this.parameterLevelRecommendationText).subscribe({
      next: (_data) => {
        this.parameterLevelRecommendationResponse.recommendationId = _data.recommendationId;
        this.recommendation.recommendationId = this.parameterLevelRecommendationResponse.recommendationId;
      }, error: _error => {
        this.showError("Data cannot be saved", "Close");
      }
    })
    this.sendRecommendation(this.parameterLevelRecommendationResponse)
    this.updateDataSavedStatus()
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

  impactChange() {
    this.parameterLevelRecommendationText.assessmentId = this.assessmentId;
    this.parameterLevelRecommendationText.parameterId = this.parameterId;
    this.recommendations.recommendationId = this.recommendation.recommendationId;
    this.recommendations.impact = this.recommendation.impact;
    this.parameterLevelRecommendationResponse.impact = this.recommendation.impact;
    this.appService.saveParameterRecommendationFields(this.parameterLevelRecommendationText).subscribe({
      next: (_data) => {
        this.sendRecommendation(this.parameterLevelRecommendationResponse)
        this.updateDataSavedStatus()
      }, error: _error => {
        this.showError("Data cannot be saved", "Close");
      }
    })
  }


  effortChange() {
    this.parameterLevelRecommendationText.assessmentId = this.assessmentId;
    this.parameterLevelRecommendationText.parameterId = this.parameterId;
    this.recommendations.recommendationId = this.recommendation.recommendationId;
    this.recommendations.effort = this.recommendation.effort;
    this.parameterLevelRecommendationResponse.effort = this.recommendation.effort;
    this.appService.saveParameterRecommendationFields(this.parameterLevelRecommendationText).subscribe({
      next: (_data) => {
        this.sendRecommendation(this.parameterLevelRecommendationResponse)
        this.updateDataSavedStatus()
      }, error: _error => {
        this.showError("Data cannot be saved", "Close");
      }
    })
  }

  saveParticularRecommendationDeliveryHorizon(_$event: KeyboardEvent) {
    this.parameterLevelRecommendationText.assessmentId = this.assessmentId;
    this.parameterLevelRecommendationText.parameterId = this.parameterId;
    this.recommendations.recommendationId = this.recommendation.recommendationId;
    this.recommendations.deliveryHorizon = this.recommendation.deliveryHorizon;
    this.parameterLevelRecommendationResponse.deliveryHorizon = this.recommendation.deliveryHorizon;
    this.appService.saveParameterRecommendationFields(this.parameterLevelRecommendationText).subscribe({
      next: (_data) => {
        this.sendRecommendation(this.parameterLevelRecommendationResponse)
        this.updateDataSavedStatus()
      }, error: _error => {
        this.showError("Data cannot be saved", "Close");
      }
    })
  }

  deleteTemplate(recommendation: ParameterLevelRecommendation) {
    let index = -1;
    if (this.parameterRecommendationArray != undefined) {
      recommendation.recommendation = "";
      recommendation.deliveryHorizon = "";
      recommendation.effort = "";
      recommendation.impact = "";
      index = this.parameterRecommendationArray.indexOf(recommendation);
      if (index !== -1) {
        this.parameterRecommendationArray.splice(index, 1);
        this.deleteRecommendationTemplate(recommendation);
      }
    }

  }

  disableFields(recommendationId: number | undefined): boolean {
    return recommendationId === undefined;
  }

  private deleteRecommendationTemplate(recommendation: ParameterLevelRecommendation) {
    if (recommendation.recommendationId != undefined) {
      this.appService.deleteParameterRecommendation(this.assessmentId, this.parameterId, recommendation.recommendationId).subscribe({
        next: (_data) => {
        }, error: _error => {
          this.showError("Data cannot be deleted", "Close");
        }
      })
    }
  }

}
