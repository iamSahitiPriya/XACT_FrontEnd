import {Component, Input, OnInit} from '@angular/core';
import {ParameterReference} from "../../types/parameterReference";
import {ParameterRatingAndRecommendation} from "../../types/parameterRatingAndRecommendation";
import {FormBuilder, FormControl} from "@angular/forms";
import {debounceTime, Observable} from "rxjs";
import {TopicRecommendation} from "../../types/topicRecommendation";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {topicData} from "../topic-level-rating-and-recommendation/topic-level-rating-and-recommendation.component";
import {ParameterRecommendation} from "../../types/parameterRecommendation";

export const parameterData = [{}]

@Component({
  selector: 'app-parameter-level-rating-and-recommendation',
  templateUrl: './parameter-level-rating-and-recommendation.component.html',
  styleUrls: ['./parameter-level-rating-and-recommendation.component.css']
})
export class ParameterLevelRatingAndRecommendationComponent implements OnInit{

  @Input()
  parameterScore: ParameterReference[];

  @Input()
  parameterRatingAndRecommendation: ParameterRatingAndRecommendation;

  @Input()
  parameterRecommendation: number;

  @Input()
  assessmentStatus: string;

  @Input()
  assessmentId: number

  recommendation = new FormControl("");
  saveIndicator$: Observable<string>;
  saveCount = 0;
  parameterLevelRecommendation: ParameterRecommendation ={
    assessmentId:0, parameterId: 0 , recommendation:"  "
  } ;
  constructor(private appService: AppServiceService, private _fb: FormBuilder, private _snackBar: MatSnackBar) {

  }
  ngOnInit() {
    this.recommendation.valueChanges.pipe(
      debounceTime(100)
    ).subscribe({
      next: value => {
        this.parameterLevelRecommendation.assessmentId = this.assessmentId
        this.parameterLevelRecommendation.parameterId = this.parameterRecommendation
        if (value != "") {
          this.parameterLevelRecommendation.recommendation = value
        }
        this.appService.saveParameterRecommendation(this.parameterLevelRecommendation).subscribe((_data) => {
            parameterData.push(this.parameterLevelRecommendation);
          }
        )
        console.log(this.parameterLevelRecommendation)
      }
    });
  }

  setRating(rating: string) {
    if (this.assessmentStatus === 'Active') {
      this.parameterRatingAndRecommendation.rating = rating;
      this.parameterRatingAndRecommendation.parameterId = this.parameterRecommendation;
    }
  }
}
