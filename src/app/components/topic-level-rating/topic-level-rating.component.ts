import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TopicRatingAndRecommendation} from "../../types/topicRatingAndRecommendation";
import {TopicReference} from "../../types/topicReference";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Observable, Subject, takeUntil} from "rxjs";
import {TopicRecommendation} from "../../types/topicRecommendation";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TopicRating} from "../../types/topicRating";
import {AssessmentStructure} from "../../types/assessmentStructure";
import {Store} from "@ngrx/store";
import {AssessmentState} from "../../reducers/app.states";
import * as fromReducer from "../../reducers/assessment.reducer";
import * as fromActions from "../../actions/assessment-data.actions";
import {TopicRatingResponse} from "../../types/topicRatingResponse";
import {TopicLevelAssessmentComponent} from "../assessment-rating-and-recommendation/topic-level-assessment.component";
import {data_local} from "src/assets/messages"
import {TopicLevelRecommendation} from "../../types/topicLevelRecommendation";


export const topicRecommendationData = [{}]
export const topicRatingData = [{}]

let RECOMMENDATION_MAX_LIMIT = 20;

@Component({
  selector: 'app-topic-level-rating',
  templateUrl: './topic-level-rating.component.html',
  styleUrls: ['./topic-level-rating.component.css']
})
export class TopicLevelRatingComponent implements OnInit, OnDestroy {
  answerResponse1: Observable<AssessmentStructure>;
  sendAverageScore: TopicRatingResponse;
  private cloneTopicResponse: AssessmentStructure;
  private cloneAnswerResponse1: AssessmentStructure;
  averageRating: TopicRatingResponse = {topicId: 0, rating: 0}

  maturityScoreTitle = data_local.ASSESSMENT_TOPIC.MATURITY_SCORE_TITLE;
  recommendationLabel = data_local.ASSESSMENT_TOPIC.RECOMMENDATION_LABEL;
  inputWarningLabel = data_local.LEGAL_WARNING_MSG_FOR_INPUT;


  constructor(private appService: AppServiceService, private _fb: FormBuilder, private _snackBar: MatSnackBar, private store: Store<AssessmentState>) {
    this.answerResponse1 = this.store.select(fromReducer.getAssessments)
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

  form: FormGroup;


  saveCount = 0;
  recommendationCount: number = 0;

  recommendationSample: TopicLevelRecommendation = {
    recommendationId: undefined,
    recommendation: "",
    impact: "",
    effort: "",
    deliveryHorizon: ""

  }

  topicLevelRecommendation: TopicRecommendation = {
    assessmentId: 0, topicId: 0, topicLevelRecommendation: []
  };

  topicLevelRating: TopicRating = {
    assessmentId: 0, topicId: 0, rating: undefined
  };


  topicRatingResponse: TopicRatingResponse = {
    topicId: 0, rating: undefined
  };

  answerResponse: AssessmentStructure;
  private destroy$: Subject<void> = new Subject<void>();


  ngOnInit() {
    this.answerResponse1.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data !== undefined) {
        this.assessmentStatus = data.assessmentStatus
        this.answerResponse = data
      }
    })
    this.topicRatingAndRecommendation.topicLevelRecommendation?.reverse()
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
      if (this.topicRatingAndRecommendation.rating === rating) {
        this.topicRatingAndRecommendation.rating = undefined;
      } else {
        this.topicRatingAndRecommendation.rating = rating;
      }
      this.topicRatingAndRecommendation.topicId = this.topicId;
      if (this.topicRatingAndRecommendation.rating != 0) {
        this.topicLevelRating.assessmentId = this.assessmentId
        this.topicLevelRating.topicId = this.topicId
        this.topicLevelRating.rating = this.topicRatingAndRecommendation.rating

        this.topicRatingResponse.topicId = this.topicId
        this.topicRatingResponse.rating = this.topicRatingAndRecommendation.rating

        this.sendRating(this.topicRatingResponse)

        this.appService.saveTopicRating(this.topicLevelRating).pipe(takeUntil(this.destroy$)).subscribe({
          next: (_data) => {
            topicRatingData.push(this.topicLevelRating);
            this.updateDataSavedStatus()

          }, error: _error => {
            this.showError("Data cannot be saved", "Close");
          }
        })
        if (this.topicRatingAndRecommendation.rating !== undefined) {
          this.sendAverageRating(this.topicRatingAndRecommendation.rating)
        } else {
          this.sendAverageRating(0)
        }
      }
    }
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

  private sendAverageRating(rating: number) {
    this.sendAverageScore = {rating: rating, topicId: this.topicRecommendation}
    this.store.dispatch(fromActions.setAverageComputedScore({averageScoreDetails: this.sendAverageScore}))
  }


  addTemplate(topicLevelRecommendation: any) {
    if (topicLevelRecommendation.length != RECOMMENDATION_MAX_LIMIT) {
      this.recommendationSample = {
        recommendationId: undefined,
        recommendation: "",
        impact: "",
        effort: "",
        deliveryHorizon: ""
      };
      topicLevelRecommendation.unshift(this.recommendationSample);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
