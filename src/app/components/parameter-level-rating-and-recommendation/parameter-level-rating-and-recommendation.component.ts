import {Component, Input, OnInit} from '@angular/core';
import {ParameterReference} from "../../types/parameterReference";
import {ParameterRatingAndRecommendation} from "../../types/parameterRatingAndRecommendation";
import {FormBuilder, FormControl} from "@angular/forms";
import {debounceTime, Observable} from "rxjs";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";

import {ParameterRecommendation} from "../../types/parameterRecommendation";
import {ParameterRating} from "../../types/parameterRating";

export const parameterRecommendationData = [{}]
export const parameterRatingData = [{}]

import {Store} from "@ngrx/store";
import {AssessmentState} from "../../reducers/app.states";
import * as fromReducer from "../../reducers/assessment.reducer";
import { AssessmentStructure } from 'src/app/types/assessmentStructure';
import {AssessmentAnswerResponse} from "../../types/AssessmentAnswerResponse";
import * as fromActions from "../../actions/assessment_data.actions";
import {ParameterRecommendationResponse} from "../../types/parameterRecommendationResponse";
import {getUpdatedAssessmentData} from "../../actions/assessment_data.actions";

@Component({
  selector: 'app-parameter-level-rating-and-recommendation',
  templateUrl: './parameter-level-rating-and-recommendation.component.html',
  styleUrls: ['./parameter-level-rating-and-recommendation.component.css']
})
export class ParameterLevelRatingAndRecommendationComponent implements OnInit{
  private answerResponse1: Observable<AssessmentStructure>;
  recommendationResponse: AssessmentStructure
  private cloneRecommendationResponse: AssessmentStructure;


  constructor(private appService: AppServiceService, private _fb: FormBuilder, private _snackBar: MatSnackBar,private store:Store<AssessmentState>) {
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
  saveIndicator$: Observable<string>;
  saveCount = 0;
  parameterLevelRecommendation: ParameterRecommendation ={
    assessmentId:0, parameterId: 0 , recommendation:" "
  } ;
  parameterLevelRating: ParameterRating ={
    assessmentId:0, parameterId: 0 , rating:""
  } ;

  parameterRecommendationResponse: ParameterRecommendationResponse = {
    parameterId:0,recommendation:" "
  }



  ngOnInit() {
    this.answerResponse1.subscribe(data =>{
      if(data !== undefined) {
        this.answerResponse=data
        this.assessmentStatus = data.assessmentStatus
      }
    })
    this.recommendation.valueChanges.pipe(
      debounceTime(100)
    ).subscribe({
      next: value => {
        this.parameterLevelRecommendation.assessmentId = this.assessmentId
        this.parameterRecommendationResponse.parameterId=this.parameterRecommendation
        this.parameterLevelRecommendation.parameterId = this.parameterRecommendation
        if (value !== "") {
          this.parameterLevelRecommendation.recommendation = value
          this.parameterRecommendationResponse.recommendation=value
          this.sendRecommendation(this.parameterRecommendationResponse)
        }
        this.appService.saveParameterRecommendation(this.parameterLevelRecommendation).subscribe((_data) => {
            parameterRecommendationData.push(this.parameterLevelRecommendation);

          }
        )
        console.log(this.parameterLevelRecommendation)
      }
    });
  }
  answerResponse: AssessmentStructure


  private sendRecommendation(parameterRecommendation: ParameterRecommendationResponse) {
    let index = 0;
    let updatedAnswerList = [];
    updatedAnswerList.push(parameterRecommendation);
    this.cloneRecommendationResponse = Object.assign({},this.answerResponse)
    if(this.cloneRecommendationResponse.parameterRatingAndRecommendation!=undefined){
      index=this.cloneRecommendationResponse.parameterRatingAndRecommendation.findIndex(eachQuestion => eachQuestion.parameterId === parameterRecommendation.parameterId)
      if(index !== -1){
        this.cloneRecommendationResponse.parameterRatingAndRecommendation[index].recommendation = parameterRecommendation.recommendation
      }
      else{
        this.cloneRecommendationResponse.parameterRatingAndRecommendation.push(parameterRecommendation)
      }
    }
    else{
      this.cloneRecommendationResponse.parameterRatingAndRecommendation=updatedAnswerList
      console.log(updatedAnswerList)
    }
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneRecommendationResponse}))
  }

  setRating(rating: string) {
    if (this.assessmentStatus === 'Active') {
      if (this.parameterRatingAndRecommendation.rating === rating) {
        this.parameterRatingAndRecommendation.rating = undefined;
      } else {
        this.parameterRatingAndRecommendation.rating = rating;
      }
      this.parameterRatingAndRecommendation.parameterId = this.parameterRecommendation;
      if(this.parameterRatingAndRecommendation.rating !== undefined){
        this.parameterLevelRating.assessmentId=this.assessmentId
        this.parameterLevelRating.parameterId=this.parameterRecommendation
        this.parameterLevelRating.rating=rating
        this.appService.saveParameterRating(this.parameterLevelRating).subscribe((_data) => {
          parameterRatingData.push(this.parameterLevelRating);
        })
        console.log(this.parameterLevelRating)
      }
    }
  }

}
