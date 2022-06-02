import {Component, Input} from '@angular/core';
import {ParameterReference} from "../../types/parameterReference";
import {ParameterRatingAndRecommendation} from "../../types/parameterRatingAndRecommendation";
import {ControlContainer, NgForm} from "@angular/forms";

@Component({
  selector: 'app-parameter-level-rating-and-recommendation',
  templateUrl: './parameter-level-rating-and-recommendation.component.html',
  styleUrls: ['./parameter-level-rating-and-recommendation.component.css'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class ParameterLevelRatingAndRecommendationComponent {

  @Input()
  parameterScore: ParameterReference[];

  @Input()
  parameterRatingAndRecommendation: ParameterRatingAndRecommendation;

  @Input()
  parameterRecommendation: number;

  setRating(rating: string) {
    this.parameterRatingAndRecommendation.rating = rating;
    this.parameterRatingAndRecommendation.parameterId = this.parameterRecommendation;

  }
}
