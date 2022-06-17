import {Component, Input, OnInit} from '@angular/core';
import {ParameterReference} from "../../types/parameterReference";
import {ParameterRatingAndRecommendation} from "../../types/parameterRatingAndRecommendation";
import {Store} from "@ngrx/store";
import {AssessmentState} from "../../reducers/app.states";
import * as fromReducer from "../../reducers/assessment.reducer";
import {AssessmentStructure} from "../../types/assessmentStructure";
import {Observable} from "rxjs";

@Component({
  selector: 'app-parameter-level-rating-and-recommendation',
  templateUrl: './parameter-level-rating-and-recommendation.component.html',
  styleUrls: ['./parameter-level-rating-and-recommendation.component.css']
})
export class ParameterLevelRatingAndRecommendationComponent implements OnInit{
  private answerResponse1: Observable<AssessmentStructure>;

  constructor(private store:Store<AssessmentState>) {
    this.answerResponse1 = this.store.select(fromReducer.getAssessments)

  }
  @Input()
  parameterScore: ParameterReference[];

  @Input()
  parameterRatingAndRecommendation: ParameterRatingAndRecommendation;

  @Input()
  parameterRecommendation: number;

  assessmentStatus: string;

  setRating(rating: string) {
    if (this.assessmentStatus === 'Active') {
      if (this.parameterRatingAndRecommendation.rating === rating) {
        this.parameterRatingAndRecommendation.rating = undefined;
      } else {
        this.parameterRatingAndRecommendation.rating = rating;
      }
      this.parameterRatingAndRecommendation.parameterId = this.parameterRecommendation;
    }
  }
  ngOnInit(){
    this.answerResponse1.subscribe(data =>{
      if(data !== undefined) {
        this.assessmentStatus = data.assessmentStatus
      }
    })
  }
}
