import {Component, Input, OnInit} from '@angular/core';
import {TopicLevelRecommendation} from "../../types/topicLevelRecommendation";
import {data_local} from "../../../assets/messages";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Store} from "@ngrx/store";
import {AssessmentState} from "../../reducers/app.states";
import * as fromReducer from "../../reducers/assessment.reducer";
import {debounce} from "lodash";
import {TopicLevelRecommendationTextRequest} from "../../types/topicLevelRecommendationTextRequest";
import {TopicRecommendationResponse} from "../../types/topicRecommendationRespose";
import {Observable} from "rxjs";
import {AssessmentStructure} from "../../types/assessmentStructure";
import * as fromActions from "../../actions/assessment-data.actions";
import {MatRadioChange} from "@angular/material/radio";

export const topicRecommendationData = [{}]
let DEBOUNCE_TIME = 1200;

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.css']
})
export class RecommendationComponent implements OnInit {

  @Input()
  recommendation: TopicLevelRecommendation

  @Input()
  assessmentId: number

  @Input()
  topicId: number

  recommendationLabel = data_local.ASSESSMENT_TOPIC.RECOMMENDATION_LABEL
  assessmentStatus: string;
  answerResponse1: Observable<AssessmentStructure>;
  private cloneTopicResponse: AssessmentStructure;
  private cloneAnswerResponse: AssessmentStructure;
  answerResponse: AssessmentStructure;
  topicRecommendationIndex: number | undefined

  constructor(private appService: AppServiceService, private _snackBar: MatSnackBar, private store: Store<AssessmentState>) {
    this.answerResponse1 = this.store.select(fromReducer.getAssessments)
    this.saveParticularRecommendationText = debounce(this.saveParticularRecommendationText, DEBOUNCE_TIME)
    this.saveParticularRecommendationDeliveryHorizon=debounce(this.saveParticularRecommendationDeliveryHorizon,DEBOUNCE_TIME)
  }

  recommendations: TopicLevelRecommendation = {
    recommendationId: undefined,
    recommendation: undefined,
    impact: undefined
  }

  topicLevelRecommendationText: TopicLevelRecommendationTextRequest = {
    assessmentId: 0, topicId: 0, topicLevelRecommendation: this.recommendations
  }
  topicRecommendationResponse: TopicRecommendationResponse = {
    assessmentId: 0, topicId: 0, recommendationId: undefined, recommendation: undefined
  };


  showError(message: string, action: string) {
    this._snackBar.open(message, action, {
      verticalPosition: 'top',
      panelClass: ['errorSnackbar'],
      duration: 2000
    })
  }

  ngOnInit(): void {
    this.answerResponse1.subscribe(data => {
      if (data !== undefined) {
        this.assessmentStatus = data.assessmentStatus
        this.answerResponse = data
      }
    })
  }

  saveParticularRecommendationText(_$event: KeyboardEvent) {
    this.topicLevelRecommendationText.assessmentId = this.assessmentId;
    this.topicLevelRecommendationText.topicId = this.topicId;
    this.recommendations.recommendationId = this.recommendation.recommendationId;
    this.recommendations.recommendation = this.recommendation.recommendation;
    this.topicRecommendationResponse.topicId = this.topicId;
    this.topicRecommendationResponse.assessmentId = this.assessmentId;
    this.topicRecommendationResponse.recommendationId = this.recommendation.recommendationId;
    this.topicRecommendationResponse.recommendation = this.recommendation.recommendation;
    this.appService.saveTopicRecommendationText(this.topicLevelRecommendationText).subscribe({
      next: (_data) => {
        topicRecommendationData.push(this.topicLevelRecommendationText);
        this.topicRecommendationResponse.recommendationId = _data.recommendationId;
        this.recommendation.recommendationId = this.topicRecommendationResponse.recommendationId;
        this.sendRecommendation(this.topicRecommendationResponse)
        this.updateDataSavedStatus()
      }, error: _error => {
        this.showError("Data cannot be saved", "Close");
      }
    })

  }


  private sendRecommendation(topicRecommendationResponse: TopicRecommendationResponse) {
    let index = 0;
    let updatedRecommendationList = [];
    let topicRecommendationSample: TopicLevelRecommendation[] | undefined;
    updatedRecommendationList.push(topicRecommendationResponse);
    this.cloneTopicResponse = Object.assign({}, this.answerResponse)
    if (this.cloneTopicResponse.topicRatingAndRecommendation != undefined) {
      index = this.cloneTopicResponse.topicRatingAndRecommendation.findIndex(eachTopic => eachTopic.topicId === topicRecommendationResponse.topicId)
      if (index !== -1) {
        topicRecommendationSample = this.cloneTopicResponse.topicRatingAndRecommendation[index].topicLevelRecommendation;
        this.getRecommendation(topicRecommendationSample, topicRecommendationResponse)
        this.cloneTopicResponse.topicRatingAndRecommendation[index].topicLevelRecommendation = topicRecommendationSample;
      } else {
        this.cloneTopicResponse.topicRatingAndRecommendation.push(topicRecommendationResponse)
      }
    } else {
      this.cloneTopicResponse.topicRatingAndRecommendation = updatedRecommendationList
    }
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneTopicResponse}))

  }

  private getRecommendation(topicRecommendationSample: TopicLevelRecommendation[] | undefined, topicRecommendationResponse: TopicRecommendationResponse) {
    if (topicRecommendationSample != undefined) {
      this.topicRecommendationIndex = topicRecommendationSample.findIndex(eachRecommendation => eachRecommendation.recommendationId === topicRecommendationResponse.recommendationId);
      if (this.topicRecommendationIndex !== -1) {
        topicRecommendationSample[this.topicRecommendationIndex].recommendationId = topicRecommendationResponse.recommendationId;
        topicRecommendationSample[this.topicRecommendationIndex].recommendation = topicRecommendationResponse.recommendation;
        topicRecommendationSample[this.topicRecommendationIndex].impact = topicRecommendationResponse.impact;
        topicRecommendationSample[this.topicRecommendationIndex].effort = topicRecommendationResponse.effort;
        topicRecommendationSample[this.topicRecommendationIndex].deliveryHorizon= topicRecommendationResponse.deliveryHorizon;
      } else {
        topicRecommendationSample.push(topicRecommendationResponse);
      }
    }
  }

  private updateDataSavedStatus() {
    this.cloneAnswerResponse = Object.assign({}, this.answerResponse)
    this.cloneAnswerResponse.updatedAt = Number(new Date(Date.now()))
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneAnswerResponse}))
  }

  impactChange(event: MatRadioChange) {
    this.topicLevelRecommendationText.assessmentId = this.assessmentId;
    this.topicLevelRecommendationText.topicId = this.topicId;
    this.recommendations.recommendationId = this.recommendation.recommendationId;
    this.recommendations.impact = event.value;
    this.appService.saveTopicRecommendationFields(this.topicLevelRecommendationText).subscribe({
      next: (_data) => {
        topicRecommendationData.push(this.topicLevelRecommendationText);
        this.sendRecommendation(this.topicRecommendationResponse)
        this.updateDataSavedStatus()
      }, error: _error => {
        this.showError("Data cannot be saved", "Close");
      }
    })


  }


  effortChange(event: MatRadioChange) {
    this.topicLevelRecommendationText.assessmentId = this.assessmentId;
    this.topicLevelRecommendationText.topicId = this.topicId;
    this.recommendations.recommendationId = this.recommendation.recommendationId;
    this.recommendations.effort = event.value;
    this.appService.saveTopicRecommendationFields(this.topicLevelRecommendationText).subscribe({
      next: (_data) => {
        topicRecommendationData.push(this.topicLevelRecommendationText);
        this.sendRecommendation(this.topicRecommendationResponse)
        this.updateDataSavedStatus()
      }, error: _error => {
        this.showError("Data cannot be saved", "Close");
      }
    })
  }

  saveParticularRecommendationDeliveryHorizon(_$event: KeyboardEvent) {
    this.topicLevelRecommendationText.assessmentId = this.assessmentId;
    this.topicLevelRecommendationText.topicId = this.topicId;
    this.recommendations.recommendationId = this.recommendation.recommendationId;
    this.recommendations.deliveryHorizon=this.recommendation.deliveryHorizon;
    this.appService.saveTopicRecommendationFields(this.topicLevelRecommendationText).subscribe({
      next: (_data) => {
        topicRecommendationData.push(this.topicLevelRecommendationText);
        this.sendRecommendation(this.topicRecommendationResponse)
        this.updateDataSavedStatus()
      }, error: _error => {
        this.showError("Data cannot be saved", "Close");
      }
    })
  }
}
