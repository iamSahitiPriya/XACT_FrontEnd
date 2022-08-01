import {Component, Input, OnInit} from '@angular/core';
import {ParameterReference} from "../../types/parameterReference";
import {ParameterRatingAndRecommendation} from "../../types/parameterRatingAndRecommendation";
import {FormBuilder} from "@angular/forms";
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
import {debounce} from "lodash";
import {TopicRatingResponse} from "../../types/topicRatingResponse";
import {data_local} from "../../../assets/messages";
import {ParameterRequest} from "../../types/parameterRequest";

let DEBOUNCE_TIME = 2000;

@Component({
  selector: 'app-parameter-level-rating-and-recommendation',
  templateUrl: './parameter-level-rating-and-recommendation.component.html',
  styleUrls: ['./parameter-level-rating-and-recommendation.component.css']
})
export class ParameterLevelRatingAndRecommendationComponent implements OnInit {
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
    this.saveParticularParameterRecommendation = debounce(this.saveParticularParameterRecommendation, DEBOUNCE_TIME)

  }

  @Input()
  parameterScore: ParameterReference[];

  @Input()
  parameterRatingAndRecommendation: ParameterRatingAndRecommendation;

  @Input()
  parameterRecommendation: number;

  assessmentStatus: string;

  @Input()
  assessmentId: number

  @Input()
  topicId: number

  @Input()
  parameterName: string

  @Input()
  parameterList: ParameterRequest[];


  parameterLevelRecommendation: ParameterRecommendation = {
    assessmentId: 0, parameterId: 0, recommendation: undefined
  };

  parameterLevelRating: ParameterRating = {
    assessmentId: 0, parameterId: 0, rating: undefined
  };

  parameterRecommendationResponse: ParameterRecommendationResponse = {
    parameterId: 0, recommendation: undefined
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
  }

  saveParticularParameterRecommendation(_$event: KeyboardEvent) {
    this.parameterLevelRecommendation.parameterId = this.parameterRecommendation
    this.parameterLevelRecommendation.assessmentId = this.assessmentId
    this.parameterLevelRecommendation.recommendation = this.parameterRatingAndRecommendation.recommendation
    this.parameterRecommendationResponse.parameterId = this.parameterRecommendation
    this.parameterRecommendationResponse.recommendation = this.parameterRatingAndRecommendation.recommendation
    this.appService.saveParameterRecommendation(this.parameterLevelRecommendation).subscribe({
      next: (_data) => {
        this.sendRecommendation(this.parameterRecommendationResponse)
        this.updateDataSavedStatus()
      }, error: _error => {
        this.showError("Data cannot be saved", "Close");
      }
    })

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
      this.parameterRatingAndRecommendation.parameterId = this.parameterRecommendation;
      this.parameterLevelRating.assessmentId = this.assessmentId
      this.parameterLevelRating.parameterId = this.parameterRecommendation
      this.parameterLevelRating.rating = this.parameterRatingAndRecommendation.rating
      this.parameterRatingResponse.parameterId = this.parameterRecommendation
      this.parameterRatingResponse.rating = this.parameterRatingAndRecommendation.rating
      this.sendRating(this.parameterRatingResponse)
      this.appService.saveParameterRating(this.parameterLevelRating).subscribe({
        next: (_data) => {
          this.updateDataSavedStatus()
        }, error: _error => {
          this.showError("Data cannot be saved", "Close");
        }
      })
      this.updateAverageRating();
    }
  }


  sendRecommendation(parameterRecommendation: ParameterRecommendationResponse) {
    let index = 0;
    let updatedRecommendationList = [];
    updatedRecommendationList.push(parameterRecommendation);
    this.cloneParameterResponse = Object.assign({}, this.answerResponse)
    if (this.cloneParameterResponse.parameterRatingAndRecommendation !== undefined) {
      index = this.cloneParameterResponse.parameterRatingAndRecommendation.findIndex(eachParameter => eachParameter.parameterId === parameterRecommendation.parameterId)
      if (index !== -1) {
        this.cloneParameterResponse.parameterRatingAndRecommendation[index].recommendation = parameterRecommendation.recommendation
      } else {
        this.cloneParameterResponse.parameterRatingAndRecommendation.push(parameterRecommendation)
      }
    } else {
      this.cloneParameterResponse.parameterRatingAndRecommendation = updatedRecommendationList
    }
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneParameterResponse}))
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
}
