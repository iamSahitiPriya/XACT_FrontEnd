import {Component, Input, OnInit} from '@angular/core';
import {TopicRatingAndRecommendation} from "../../types/topicRatingAndRecommendation";
import {TopicReference} from "../../types/topicReference";
import {FormBuilder, FormControl} from "@angular/forms";
import {debounceTime, Observable} from "rxjs";
import {TopicRecommendation} from "../../types/topicRecommendation";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TopicRating} from "../../types/topicRating";
import {stringify} from "querystring";

export const topicRecommendationData = [{}]
export const topicRatingData = [{}]


@Component({
  selector: 'app-topic-level-rating-and-recommendation',
  templateUrl: './topic-level-rating-and-recommendation.component.html',
  styleUrls: ['./topic-level-rating-and-recommendation.component.css']
})
export class TopicLevelRatingAndRecommendationComponent implements OnInit{

  @Input()
  topicRecommendation: number;

  @Input()
  topicRatingAndRecommendation: TopicRatingAndRecommendation;

  @Input()
  topicScore: TopicReference[];

  @Input()
  topicId: number;

  @Input()
  assessmentStatus: string;

  @Input()
  assessmentId : number

  recommendation = new FormControl("");
  saveIndicator$: Observable<string>;
  saveCount = 0;
  topicLevelRecommendation: TopicRecommendation ={
    assessmentId:0, topicId: 0 , recommendation:"  "
  } ;
  topicLevelRating: TopicRating ={
    assessmentId:0, topicId: 0 , rating:"0"
  } ;

  constructor(private appService: AppServiceService, private _fb: FormBuilder, private _snackBar: MatSnackBar) {

  }
  ngOnInit() {
    this.recommendation.valueChanges.pipe(
      debounceTime(100)
    ).subscribe({
      next: value => {
        this.topicLevelRecommendation.assessmentId = this.assessmentId
        this.topicLevelRecommendation.topicId = this.topicId
        if (value != "") {
          this.topicLevelRecommendation.recommendation = value
        }
        this.appService.saveTopicRecommendation(this.topicLevelRecommendation).subscribe((_data) => {
            topicRecommendationData.push(this.topicLevelRecommendation);
          }
        )
        console.log(this.topicLevelRecommendation)
      }
    });
  }

  setRating(rating: string) {
    if (this.assessmentStatus === 'Active') {
      this.topicRatingAndRecommendation.rating = rating;
      this.topicRatingAndRecommendation.topicId = this.topicId;
      if(this.topicRatingAndRecommendation.rating!="0"){
        this.topicLevelRating.assessmentId=this.assessmentId
        this.topicLevelRating.topicId=this.topicId
        this.topicLevelRating.rating=rating
        this.appService.saveTopicRating(this.topicLevelRating).subscribe((_data) => {
          topicRatingData.push(this.topicLevelRating);
        })
        console.log(this.topicLevelRating)
      }
    }

  }
}
