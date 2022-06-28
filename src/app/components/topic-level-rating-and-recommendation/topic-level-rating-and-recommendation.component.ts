import {Component, Input, OnInit} from '@angular/core';
import {TopicRatingAndRecommendation} from "../../types/topicRatingAndRecommendation";
import {TopicReference} from "../../types/topicReference";
import {FormBuilder, FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {TopicRecommendation} from "../../types/topicRecommendation";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TopicRating} from "../../types/topicRating";
import {AssessmentStructure} from "../../types/assessmentStructure";
import {Store} from "@ngrx/store";
import {AssessmentState} from "../../reducers/app.states";
import * as fromReducer from "../../reducers/assessment.reducer";
import * as fromActions from "../../actions/assessment-data.actions";
import {TopicRecommendationResponse} from "../../types/topicRecommendationRespose";
import {TopicRatingResponse} from "../../types/topicRatingResponse";
import {debounce} from "lodash";

export const topicRecommendationData = [{}]
export const topicRatingData = [{}]

let DEBOUNCE_TIME = 2000;

@Component({
  selector: 'app-topic-level-rating-and-recommendation',
  templateUrl: './topic-level-rating-and-recommendation.component.html',
  styleUrls: ['./topic-level-rating-and-recommendation.component.css']
})
export class TopicLevelRatingAndRecommendationComponent implements OnInit {
  answerResponse1: Observable<AssessmentStructure>;
  private cloneTopicResponse: AssessmentStructure;

  constructor(private appService: AppServiceService, private _fb: FormBuilder, private _snackBar: MatSnackBar, private store: Store<AssessmentState>) {
    this.answerResponse1 = this.store.select(fromReducer.getAssessments)
    this.saveParticularRecommendation =debounce(this.saveParticularRecommendation, DEBOUNCE_TIME)
  }

  @Input()
  topicRecommendation: number;

  @Input()
  topicRatingAndRecommendation: TopicRatingAndRecommendation;

  @Input()
  topicScore: TopicReference[];

  @Input()
  topicId: number;

  assessmentStatus: string;

  @Input()
  assessmentId: number

  recommendation = new FormControl("");
  saveCount = 0;
  topicLevelRecommendation: TopicRecommendation = {
    assessmentId: 0, topicId: 0, recommendation: undefined
  };

  topicLevelRating: TopicRating = {
    assessmentId: 0, topicId: 0, rating: "0"
  };

  topicRecommendationResponse: TopicRecommendationResponse = {
    topicId: 0, recommendation: undefined
  };

  topicRatingResponse: TopicRatingResponse = {
    topicId: 0, rating: "0"
  };

  answerResponse: AssessmentStructure

  ngOnInit() {
    this.answerResponse1.subscribe(data => {
      if (data !== undefined) {
        this.assessmentStatus = data.assessmentStatus
        this.answerResponse = data
      }
    })

  }

  setRating(rating: string) {
    if (this.assessmentStatus === 'Active') {
      if (this.topicRatingAndRecommendation.rating === rating) {
        this.topicRatingAndRecommendation.rating = undefined;
      } else {
        this.topicRatingAndRecommendation.rating = rating;
      }
      this.topicRatingAndRecommendation.topicId = this.topicId;
      if (this.topicRatingAndRecommendation.rating != "0") {
        this.topicLevelRating.assessmentId = this.assessmentId
        this.topicLevelRating.topicId = this.topicId
        this.topicLevelRating.rating = rating
        this.topicRatingResponse.topicId = this.topicId
        this.topicRatingResponse.rating = rating
        this.sendRating(this.topicRatingResponse)

        this.appService.saveTopicRating(this.topicLevelRating).subscribe((_data) => {
          topicRatingData.push(this.topicLevelRating);
        })

      }
    }
  }

  private sendRecommendation(topicRecommendation: TopicRecommendationResponse) {
    let index = 0;
    let updatedRecommendationList = [];
    updatedRecommendationList.push(topicRecommendation);
    this.cloneTopicResponse = Object.assign({}, this.answerResponse)
    if (this.cloneTopicResponse.topicRatingAndRecommendation != undefined) {
      index = this.cloneTopicResponse.topicRatingAndRecommendation.findIndex(eachTopic => eachTopic.topicId === topicRecommendation.topicId)
      if (index !== -1) {
        this.cloneTopicResponse.topicRatingAndRecommendation[index].recommendation = topicRecommendation.recommendation
      } else {
        this.cloneTopicResponse.topicRatingAndRecommendation.push(topicRecommendation)
      }
    } else {
      this.cloneTopicResponse.topicRatingAndRecommendation = updatedRecommendationList
    }
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneTopicResponse}))
  }

  private sendRating(topicRating: TopicRatingResponse) {
    let index = 0;
    let updatedRatingList = [];
    updatedRatingList.push(topicRating);
    this.cloneTopicResponse = Object.assign({}, this.answerResponse)
    if (this.cloneTopicResponse.topicRatingAndRecommendation !== undefined) {
      index = this.cloneTopicResponse.topicRatingAndRecommendation.findIndex(eachTopic => eachTopic.topicId === topicRating.topicId)
      if (index !== -1) {
        this.cloneTopicResponse.topicRatingAndRecommendation[index].rating = topicRating.rating
      } else {
        this.cloneTopicResponse.topicRatingAndRecommendation.push(topicRating)
      }
    } else {
      this.cloneTopicResponse.topicRatingAndRecommendation = updatedRatingList
    }
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneTopicResponse}))
  }


  saveParticularRecommendation(_$event: KeyboardEvent) {
    this.topicLevelRecommendation.topicId = this.topicId
    this.topicLevelRecommendation.assessmentId = this.assessmentId
    this.topicLevelRecommendation.recommendation = this.topicRatingAndRecommendation.recommendation
    this.topicRecommendationResponse.topicId = this.topicId
    this.topicRecommendationResponse.recommendation = this.topicRatingAndRecommendation.recommendation
    this.appService.saveTopicRecommendation(this.topicLevelRecommendation).subscribe((_data) => {
      topicRecommendationData.push(this.topicLevelRecommendation);
    })
    this.sendRecommendation(this.topicRecommendationResponse)
  }
}
