import {Component, Input, OnInit} from '@angular/core';
import {ParameterReference} from "../../types/parameterReference";
import {ParameterRatingAndRecommendation} from "../../types/parameterRatingAndRecommendation";
import {FormBuilder, FormControl} from "@angular/forms";
import {debounceTime, Observable} from "rxjs";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";

import {ParameterRecommendation} from "../../types/parameterRecommendation";
import {ParameterRating} from "../../types/parameterRating";
import {Store} from "@ngrx/store";
import {AssessmentState} from "../../reducers/app.states";
import * as fromReducer from "../../reducers/assessment.reducer";
import {AssessmentStructure} from 'src/app/types/assessmentStructure';
import * as fromActions from "../../actions/assessment_data.actions";
import {ParameterRecommendationResponse} from "../../types/parameterRecommendationResponse";
import {ParameterRatingResponse} from "../../types/parameterRatingResponse";

export const parameterRecommendationData = [{}]
export const parameterRatingData = [{}]


let DEBOUNCE_TIME = 2000;

@Component({
  selector: 'app-parameter-level-rating-and-recommendation',
  templateUrl: './parameter-level-rating-and-recommendation.component.html',
  styleUrls: ['./parameter-level-rating-and-recommendation.component.css']
})
export class ParameterLevelRatingAndRecommendationComponent implements OnInit {
  answerResponse1: Observable<AssessmentStructure>;
  private cloneParameterResponse: AssessmentStructure;
  answerResponse: AssessmentStructure

  constructor(private appService: AppServiceService, private _fb: FormBuilder, private _snackBar: MatSnackBar, private store: Store<AssessmentState>) {
    this.answerResponse1 = this.store.select(fromReducer.getAssessments)
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

  recommendation = new FormControl("");

  parameterLevelRecommendation: ParameterRecommendation = {
    assessmentId: 0, parameterId: 0, recommendation: " "
  };

  parameterLevelRating: ParameterRating = {
    assessmentId: 0, parameterId: 0, rating: ""
  };

  parameterRecommendationResponse: ParameterRecommendationResponse = {
    parameterId: 0, recommendation: " "
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

    this.recommendation.valueChanges.pipe(
      debounceTime(DEBOUNCE_TIME)
    ).subscribe({
      next: value => {
        this.parameterLevelRecommendation.assessmentId = this.assessmentId
        this.parameterRecommendationResponse.parameterId = this.parameterRecommendation
        this.parameterLevelRecommendation.parameterId = this.parameterRecommendation
        if (value !== "") {
          this.parameterLevelRecommendation.recommendation = value
          this.parameterRecommendationResponse.recommendation = value
        }
        this.appService.saveParameterRecommendation(this.parameterLevelRecommendation).subscribe((_data) => {
            parameterRecommendationData.push(this.parameterLevelRecommendation);
          }
        )
        this.sendRecommendation(this.parameterRecommendationResponse)
      }
    });
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
        this.parameterLevelRating.rating = rating
        this.parameterRatingResponse.parameterId = this.parameterRecommendation
        this.parameterRatingResponse.rating = rating
        this.sendRating(this.parameterRatingResponse)
        this.appService.saveParameterRating(this.parameterLevelRating).subscribe((_data) => {
          parameterRatingData.push(this.parameterLevelRating);
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
}
