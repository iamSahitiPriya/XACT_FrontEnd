import {Component, Input, OnInit} from '@angular/core';
import {ParameterReference} from "../../types/parameterReference";
import {ParameterRatingAndRecommendation} from "../../types/parameterRatingAndRecommendation";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Observable} from "rxjs";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ParameterRecommendation} from "../../types/parameterRecommendation";
import {ParameterRating} from "../../types/parameterRating";
import {Store} from "@ngrx/store";
import {AssessmentState} from "../../reducers/app.states";
import * as fromReducer from "../../reducers/assessment.reducer";
import {AssessmentStructure} from 'src/app/types/assessmentStructure';
import * as fromActions from "../../actions/assessment-data.actions";
import {ParameterRecommendationResponse} from "../../types/parameterRecommendationResponse";
import {ParameterRatingResponse} from "../../types/parameterRatingResponse";
import {TopicRatingResponse} from "../../types/topicRatingResponse";
import {data_local} from "../../../assets/messages";
import {ParameterRequest} from "../../types/parameterRequest";
import {ParameterLevelRecommendation} from "../../types/parameterLevelRecommendation";

let RECOMMENDATION_MAX_LIMIT = 10;

@Component({
  selector: 'app-parameter-level-rating',
  templateUrl: './parameter-level-rating.component.html',
  styleUrls: ['./parameter-level-rating.component.css']
})
export class ParameterLevelRatingComponent implements OnInit {
  answerResponse1: Observable<AssessmentStructure>;
  sendAverageScore: TopicRatingResponse;

  maturityScoreTitle = data_local.ASSESSMENT_PARAMETER.MATURITY_SCORE_TITLE;
  recommendationLabel = data_local.ASSESSMENT_PARAMETER.RECOMMENDATION_LABEL;
  inputWarningLabel = data_local.LEGAL_WARNING_MSG_FOR_INPUT;

  private cloneParameterResponse: AssessmentStructure;
  answerResponse: AssessmentStructure
  private cloneAnswerResponse1: AssessmentStructure;

  constructor(private appService: AppServiceService, private _fb: FormBuilder, private _snackBar: MatSnackBar, private store: Store<AssessmentState>) {
    this.answerResponse1 = this.store.select(fromReducer.getAssessments)
  }

  @Input()
  parameterScore: ParameterReference[];

  @Input()
  parameterRatingAndRecommendation: ParameterRatingAndRecommendation;

  @Input()
  parameterId: number;

  assessmentStatus: string;

  @Input()
  assessmentId: number

  @Input()
  topicId: number

  @Input()
  parameterName: string

  @Input()
  parameterList: ParameterRequest[];

  saveCount = 0;
  recommendationCount: number = 0;

  recommendationSample: ParameterLevelRecommendation = {
    recommendationId: undefined,
    recommendation: "",
    impact: "",
    effort: "",
    deliveryHorizon: ""

  }

  form : FormGroup

  parameterLevelRecommendation: ParameterRecommendation = {
    assessmentId: 0, parameterId: 0, parameterLevelRecommendation: undefined
  };

  parameterLevelRating: ParameterRating = {
    assessmentId: 0, parameterId: 0, rating: undefined
  };

  parameterRecommendationResponse: ParameterRecommendationResponse = {
    assessmentId: 0, parameterId: 0, recommendation: undefined
  };

  parameterRatingResponse: ParameterRatingResponse = {
    parameterId: 0, rating: undefined
  };


  ngOnInit() {
    this.answerResponse1.subscribe(data => {
      if (data !== undefined) {
        this.answerResponse = data
        this.assessmentStatus = data.assessmentStatus
      }
    })
    this.parameterRatingAndRecommendation.parameterLevelRecommendation?.reverse();
  }

  showError(message: string, action: string) {
    this._snackBar.open(message, action, {
      verticalPosition: 'top',
      panelClass: ['errorSnackbar'],
      duration: 2000
    })
  }

  setRating(rating: number) {
    if (this.assessmentStatus === 'Active') {
      if (this.parameterRatingAndRecommendation.rating === rating) {
        this.parameterRatingAndRecommendation.rating = undefined;
      } else {
        this.parameterRatingAndRecommendation.rating = rating;
      }
      this.parameterRatingAndRecommendation.parameterId = this.parameterId;
      this.parameterLevelRating.assessmentId = this.assessmentId
      this.parameterLevelRating.parameterId = this.parameterId
      this.parameterLevelRating.rating = this.parameterRatingAndRecommendation.rating
      this.parameterRatingResponse.parameterId = this.parameterId
      this.parameterRatingResponse.rating = this.parameterRatingAndRecommendation.rating
      this.sendRating(this.parameterRatingResponse)
      this.appService.saveParameterRating(this.parameterLevelRating).subscribe({
        next: () => {
          this.updateDataSavedStatus()
        }, error: _error => {
          this.showError("Data cannot be saved", "Close");
        }
      })
      this.updateAverageRating();
    }
  }

  private sendRating(parameterRating: ParameterRatingResponse) {
    let index = 0;
    let updatedRatingList = [];
    updatedRatingList.push(parameterRating);
    this.cloneParameterResponse = Object.assign({}, this.answerResponse)
    if (this.cloneParameterResponse.parameterRatingAndRecommendation !== undefined) {
      index = this.cloneParameterResponse.parameterRatingAndRecommendation.findIndex(eachParameter => eachParameter.parameterId === parameterRating.parameterId)
      if (index !== -1) {
        this.cloneParameterResponse.parameterRatingAndRecommendation[index].rating = parameterRating.rating
      } else {
        this.cloneParameterResponse.parameterRatingAndRecommendation.push(parameterRating)
      }
    } else {
      this.cloneParameterResponse.parameterRatingAndRecommendation = updatedRatingList
    }
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneParameterResponse}))
  }

  private updateDataSavedStatus() {
    this.cloneAnswerResponse1 = Object.assign({}, this.answerResponse)
    this.cloneAnswerResponse1.updatedAt = Number(new Date(Date.now()))
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneAnswerResponse1}))
  }

  public updateAverageRating() {
    let averageRating = 0;
    let ratingSum = 0
    let ratingNumber = 0
    let index = 0;
    for (let pId in this.parameterList) {
      index = this.cloneParameterResponse.parameterRatingAndRecommendation.findIndex(eachParameter => eachParameter.parameterId === this.parameterList[pId].parameterRatingAndRecommendation.parameterId)
      if (index != -1 && this.cloneParameterResponse.parameterRatingAndRecommendation[index].rating != undefined) {
        ratingSum = ratingSum + Number(this.cloneParameterResponse.parameterRatingAndRecommendation[index].rating);
        ratingNumber = ratingNumber + 1;
      }
    }


    if (ratingSum !== 0 && ratingNumber !== 0) {
      averageRating = Math.round(ratingSum / ratingNumber);
    }
    this.sendAverageRating(averageRating);
  }

  private sendAverageRating(rating: number) {
    this.sendAverageScore = {rating: rating, topicId: this.topicId}
    this.store.dispatch(fromActions.setAverageComputedScore({averageScoreDetails: this.sendAverageScore}))
  }


  addTemplate(parameterLevelRecommendation: any) {
    if (parameterLevelRecommendation.length != RECOMMENDATION_MAX_LIMIT) {
      this.recommendationSample = {
        recommendationId: undefined,
        recommendation: "",
        impact: "",
        effort: "",
        deliveryHorizon: ""
      };
      parameterLevelRecommendation.unshift(this.recommendationSample);
    }
  }
}
