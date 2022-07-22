import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {TopicRatingAndRecommendation} from "../../types/topicRatingAndRecommendation";
import {TopicReference} from "../../types/topicReference";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
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
import {TopicLevelAssessmentComponent} from "../assessment-rating-and-recommendation/topic-level-assessment.component";
import {data_local} from "src/assets/messages"

export const topicRecommendationData = [{}]
export const topicRatingData = [{}]

let DEBOUNCE_TIME = 1200;

@Component({
  selector: 'app-topic-level-rating-and-recommendation',
  templateUrl: './topic-level-rating-and-recommendation.component.html',
  styleUrls: ['./topic-level-rating-and-recommendation.component.css']
})
export class TopicLevelRatingAndRecommendationComponent implements OnInit {
  answerResponse1: Observable<AssessmentStructure>;
  sendAverageScore : TopicRatingResponse;
  private cloneTopicResponse: AssessmentStructure;
  private cloneAnswerResponse1: AssessmentStructure;
  averageRating: TopicRatingResponse = {topicId: 0, rating: "0"}

  maturityScoreTitle = data_local.ASSESSMENT_TOPIC.MATURITY_SCORE_TITLE;
  recommendationLabel = data_local.ASSESSMENT_TOPIC.RECOMMENDATION_LABEL;


  constructor(private appService: AppServiceService, private _fb: FormBuilder, private _snackBar: MatSnackBar, private store: Store<AssessmentState>) {
    this.answerResponse1 = this.store.select(fromReducer.getAssessments)
    this.saveParticularRecommendation = debounce(this.saveParticularRecommendation, DEBOUNCE_TIME)
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

  @Input()
  topicName: string

  @ViewChild('topicLevelAssessmentComponent')
  topicLevelAssessmentComponent: TopicLevelAssessmentComponent

  recommendation = new FormControl("");
  saveCount = 0;


  topicLevelRecommendation: TopicRecommendation = {
    assessmentId: 0, topicId: 0, recommendation: undefined
  };

  topicLevelRating: TopicRating = {
    assessmentId: 0, topicId: 0, rating: undefined
  };

  topicRecommendationResponse: TopicRecommendationResponse = {
    topicId: 0, recommendation: undefined
  };

  topicRatingResponse: TopicRatingResponse = {
    topicId: 0, rating: undefined
  };

  answerResponse: AssessmentStructure
  form: FormGroup;

  ngOnInit() {
    this.answerResponse1.subscribe(data => {
      if (data !== undefined) {
        this.assessmentStatus = data.assessmentStatus
        this.answerResponse = data
      }
    })
    this.form = new FormGroup({
      recommendationTemplate: new FormArray([
        new FormGroup({
          name: new FormControl(''),
        })
      ])
    });
  }
  showError(message: string, action: string) {
    this._snackBar.open(message, action, {
      verticalPosition: 'top',
      panelClass: ['errorSnackbar'],
      duration: 2000
    })

  }
  saveParticularRecommendation(_$event: KeyboardEvent) {
    this.topicLevelRecommendation.topicId = this.topicId
    this.topicLevelRecommendation.assessmentId = this.assessmentId
    this.topicLevelRecommendation.recommendation = this.topicRatingAndRecommendation.recommendation
    this.topicRecommendationResponse.topicId = this.topicId
    this.topicRecommendationResponse.recommendation = this.topicRatingAndRecommendation.recommendation
    this.appService.saveTopicRecommendation(this.topicLevelRecommendation).subscribe({
    next:(_data)=> {
      topicRecommendationData.push(this.topicLevelRecommendation);
      this.sendRecommendation(this.topicRecommendationResponse)
      this.updateDataSavedStatus()
    },error:_error => {
      this.showError("Data cannot be saved","Close");
    }})

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
        this.topicLevelRating.rating = this.topicRatingAndRecommendation.rating

        this.topicRatingResponse.topicId = this.topicId
        this.topicRatingResponse.rating = this.topicRatingAndRecommendation.rating

        this.sendRating(this.topicRatingResponse)

        this.appService.saveTopicRating(this.topicLevelRating).subscribe({
        next: (_data) => {
          topicRatingData.push(this.topicLevelRating);
          this.updateDataSavedStatus()

        },error: _error => {
          this.showError("Data cannot be saved", "Close");
        }})
        if (this.topicRatingAndRecommendation.rating !== undefined) {
          this.sendAverageRating(this.topicRatingAndRecommendation.rating)
        } else {
          this.sendAverageRating("0")
        }
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

  private updateDataSavedStatus() {
    this.cloneAnswerResponse1 = Object.assign({}, this.answerResponse)
    this.cloneAnswerResponse1.updatedAt = Number(new Date(Date.now()))
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneAnswerResponse1}))
  }

  private sendAverageRating(rating: string) {
    this.sendAverageScore = {rating: rating, topicId: this.topicRecommendation}
    this.store.dispatch(fromActions.setAverageComputedScore({averageScoreDetails:this.sendAverageScore}))
  }

  get recommendationTemplate(): FormArray {
    return this.form.get('recommendationTemplate') as FormArray;
  }

  addTemplate() {
    this.recommendationTemplate.push(
      new FormGroup({
        name: new FormControl(''),
      })
    );
  }
}
