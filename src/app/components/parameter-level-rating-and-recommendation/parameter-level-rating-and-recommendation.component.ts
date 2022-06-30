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


export const parameterRecommendationData = [{}]
export const parameterRatingData = [{}]


let DEBOUNCE_TIME = 1500;

@Component({
  selector: 'app-parameter-level-rating-and-recommendation',
  templateUrl: './parameter-level-rating-and-recommendation.component.html',
  styleUrls: ['./parameter-level-rating-and-recommendation.component.css']
})
export class ParameterLevelRatingAndRecommendationComponent implements OnInit {
  answerResponse1: Observable<AssessmentStructure>;
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

  parameterLevelRecommendation: ParameterRecommendation = {
    assessmentId: 0, parameterId: 0, recommendation: undefined
  };

  parameterLevelRating: ParameterRating = {
    assessmentId: 0, parameterId: 0, rating: ""
  };

  parameterRecommendationResponse: ParameterRecommendationResponse = {
    parameterId: 0, recommendation: undefined
  };

  parameterRatingResponse: ParameterRatingResponse = {
    parameterId: 0, rating: ""
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
    this.appService.saveParameterRecommendation(this.parameterLevelRecommendation).subscribe((_data) => {
      parameterRecommendationData.push(this.parameterLevelRecommendation);
      this.sendRecommendation(this.parameterRecommendationResponse)
      this.updateDataSavedStatus()
    },_error => {
      this.showError("Data cannot be saved","Close");
    })

  }

  showError(message: string, action: string) {
    this._snackBar.open(message, action, {
      verticalPosition: 'top',
      panelClass: ['errorSnackbar'],
      duration: 2000
    })
  }
  setRating(rating: string) {
    if (this.assessmentStatus === 'Active') {
      if (this.parameterRatingAndRecommendation.rating === rating) {
        this.parameterRatingAndRecommendation.rating = undefined;
      } else {
        this.parameterRatingAndRecommendation.rating = rating;
      }
      this.parameterRatingAndRecommendation.parameterId = this.parameterRecommendation;
      if (this.parameterRatingAndRecommendation.rating !== undefined) {
        this.parameterLevelRating.assessmentId = this.assessmentId
        this.parameterLevelRating.parameterId = this.parameterRecommendation
        this.parameterLevelRating.rating = this.parameterRatingAndRecommendation.rating
        this.parameterRatingResponse.parameterId = this.parameterRecommendation
        this.parameterRatingResponse.rating = this.parameterRatingAndRecommendation.rating
        this.sendRating(this.parameterRatingResponse)
        this.appService.saveParameterRating(this.parameterLevelRating).subscribe((_data) => {
          parameterRatingData.push(this.parameterLevelRating);
          this.updateDataSavedStatus()

        },_error => {
          this.showError("Data cannot be saved","Close");
        })
      }
    }
  }

  private sendRecommendation(parameterRecommendation: ParameterRecommendationResponse) {
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
  private sendAverageRating(){

  }

}
