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
import {TopicRatingAndRecommendation} from "../../types/topicRatingAndRecommendation";
import {FormGroup} from "@angular/forms";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";

export const topicRecommendationData = [{}]
let DEBOUNCE_TIME = 1200;

@Component({
  selector: 'app-topic-level-recommendation',
  templateUrl: './topic-level-recommendation.component.html',
  styleUrls: ['./topic-level-recommendation.component.css']
})
export class TopicLevelRecommendationComponent implements OnInit {

  @Input()
  recommendation: TopicLevelRecommendation

  @Input()
  assessmentId: number

  @Input()
  topicId: number

  @Input()
  topicRecommendationArray: TopicLevelRecommendation[] | undefined

  @Input()
  index: number;

  form: FormGroup;

  recommendationLabel = data_local.ASSESSMENT_TOPIC.RECOMMENDATION_LABEL
  inputWarningLabel = data_local.LEGAL_WARNING_MSG_FOR_TEXT_FIELDS;

  assessmentStatus: string;
  topicRecommendationResponse1: Observable<AssessmentStructure>;
  private cloneTopicRecommendationResponse: AssessmentStructure;
  private cloneTopicLevelRecommendationResponse: AssessmentStructure;
  topicRecommendationResponse: AssessmentStructure;
  topicRecommendationIndex: number | undefined

  constructor(private appService: AppServiceService, private _snackBar: MatSnackBar, private store: Store<AssessmentState>) {
    this.topicRecommendationResponse1 = this.store.select(fromReducer.getAssessments)
    this.saveParticularTopicRecommendationText = debounce(this.saveParticularTopicRecommendationText, DEBOUNCE_TIME)
  }

  recommendations: TopicLevelRecommendation = {
    recommendationId: undefined,
    recommendation: "",
    impact: "",
    effort: "",
    deliveryHorizon: ""
  }

  topicLevelRecommendationText: TopicLevelRecommendationTextRequest = {
    assessmentId: 0, topicId: 0, topicLevelRecommendation: this.recommendations
  }
  topicLevelRecommendationResponse: TopicRecommendationResponse = {
    assessmentId: 0,
    topicId: 0,
    recommendationId: undefined,
    recommendation: "",
    impact: "",
    effort: "",
    deliveryHorizon: ""
  };

  topicRecommendationSample: TopicLevelRecommendation[] | undefined;
  deleteRecommendationText: string = "Delete Recommendation";




  showError(message: string, action: string) {
    this._snackBar.open(message, action, {
      verticalPosition: 'top',
      panelClass: ['errorSnackbar'],
      duration: 2000
    })
  }

  ngOnInit(): void {
    this.topicRecommendationResponse1.subscribe(data => {
      if (data !== undefined) {
        this.assessmentStatus = data.assessmentStatus
        this.topicRecommendationResponse = data
      }
    })

  }

  saveParticularTopicRecommendationText(_$event: KeyboardEvent) {

    this.topicLevelRecommendationText.assessmentId = this.assessmentId;
    this.topicLevelRecommendationText.topicId = this.topicId;
    this.setRecommendationsFields();
    this.setTopicLevelRecommendationResponse();
    this.topicLevelRecommendationText.topicLevelRecommendation= this.recommendations;
    this.appService.saveTopicRecommendationText(this.topicLevelRecommendationText).subscribe({
      next: (_data) =>
      {
        this.topicLevelRecommendationResponse.recommendationId = _data.recommendationId;
        this.recommendation.recommendationId = this.topicLevelRecommendationResponse.recommendationId;
      }, error: _error => {
        this.showError("Data cannot be saved", "Close");
      }
    })
    this.sendRecommendation(this.topicLevelRecommendationResponse)
    this.updateDataSavedStatus()
  }

  private setRecommendationsFields() {
    this.recommendations.recommendationId = this.recommendation.recommendationId;
    this.recommendations.recommendation = this.recommendation.recommendation;
    this.recommendations.effort = this.recommendation.effort;
    this.recommendations.impact = this.recommendation.impact;
    this.recommendations.deliveryHorizon = this.recommendation.deliveryHorizon;
  }

  private setTopicLevelRecommendationResponse() {
    this.topicLevelRecommendationResponse.topicId = this.topicId;
    this.topicLevelRecommendationResponse.assessmentId = this.assessmentId;
    this.topicLevelRecommendationResponse.recommendationId = this.recommendation.recommendationId;
    this.topicLevelRecommendationResponse.recommendation = this.recommendation.recommendation;
    this.topicLevelRecommendationResponse.effort = this.recommendation.effort;
    this.topicLevelRecommendationResponse.impact = this.recommendation.impact;
    this.topicLevelRecommendationResponse.deliveryHorizon = this.recommendation.deliveryHorizon;
  }

  private sendRecommendation(topicLevelRecommendationResponse: TopicRecommendationResponse) {

    let index = 0;
    let updatedRecommendationList = [];
    this.cloneTopicRecommendationResponse = Object.assign({}, this.topicRecommendationResponse)
    let topicRecommendation: TopicRatingAndRecommendation = {
      topicId: topicLevelRecommendationResponse.topicId,
      rating: 0,
      topicLevelRecommendation: [{
        recommendationId: topicLevelRecommendationResponse.recommendationId,
        recommendation: topicLevelRecommendationResponse.recommendation,
        impact: topicLevelRecommendationResponse.impact,
        effort: topicLevelRecommendationResponse.effort,
        deliveryHorizon: topicLevelRecommendationResponse.deliveryHorizon
      }]
    };
    updatedRecommendationList.push(topicRecommendation);
    if (this.cloneTopicRecommendationResponse.topicRatingAndRecommendation != undefined) {
      index = this.cloneTopicRecommendationResponse.topicRatingAndRecommendation.findIndex(eachTopic => eachTopic.topicId === topicLevelRecommendationResponse.topicId)
      if (index !== -1) {
        this.topicRecommendationSample = this.cloneTopicRecommendationResponse.topicRatingAndRecommendation[index].topicLevelRecommendation;
        this.getRecommendation(this.topicRecommendationSample, topicLevelRecommendationResponse)
        topicRecommendation.rating = this.cloneTopicRecommendationResponse.topicRatingAndRecommendation[index].rating;
        this.cloneTopicRecommendationResponse.topicRatingAndRecommendation[index].topicLevelRecommendation = this.topicRecommendationSample;
      } else {
        this.cloneTopicRecommendationResponse.topicRatingAndRecommendation.push(topicRecommendation);

      }
    } else {
      this.cloneTopicRecommendationResponse.topicRatingAndRecommendation = updatedRecommendationList;
    }
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneTopicRecommendationResponse}))

  }

  getRecommendation(topicRecommendationSample: TopicLevelRecommendation[] | undefined, topicRecommendationResponse: TopicRecommendationResponse) {
    if (topicRecommendationSample != undefined) {
      this.topicRecommendationIndex = topicRecommendationSample.findIndex(eachRecommendation => eachRecommendation.recommendationId === topicRecommendationResponse.recommendationId);
      if (this.topicRecommendationIndex !== -1) {
        topicRecommendationSample[this.topicRecommendationIndex].recommendationId = topicRecommendationResponse.recommendationId;
        topicRecommendationSample[this.topicRecommendationIndex].recommendation = topicRecommendationResponse.recommendation;
        topicRecommendationSample[this.topicRecommendationIndex].impact = topicRecommendationResponse.impact;
        topicRecommendationSample[this.topicRecommendationIndex].effort = topicRecommendationResponse.effort;
        topicRecommendationSample[this.topicRecommendationIndex].deliveryHorizon = topicRecommendationResponse.deliveryHorizon;
      } else {
        topicRecommendationSample.push(topicRecommendationResponse);
      }
    }
  }

  updateDataSavedStatus() {
    this.cloneTopicLevelRecommendationResponse = Object.assign({}, this.topicRecommendationResponse)
    this.cloneTopicLevelRecommendationResponse.updatedAt = Number(new Date(Date.now()))
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneTopicLevelRecommendationResponse}))
  }

  inputChange() {
    this.topicLevelRecommendationText.assessmentId = this.assessmentId;
    this.topicLevelRecommendationText.topicId = this.topicId;
    this.setRecommendationsFields()
    this.setTopicLevelRecommendationResponse()
    this.appService.saveTopicRecommendationFields(this.topicLevelRecommendationText).subscribe({
      next: (_data) => {
        this.sendRecommendation(this.topicLevelRecommendationResponse)
        this.updateDataSavedStatus()
      }, error: _error => {
        this.showError("Data cannot be saved", "Close");
      }
    })
  }


  deleteTemplate(recommendation: TopicLevelRecommendation) {
    let index = -1;
    if (this.topicRecommendationArray != undefined) {
      recommendation.recommendation = "";
      recommendation.deliveryHorizon = "";
      recommendation.effort = "";
      recommendation.impact = "";
      index = this.topicRecommendationArray.indexOf(recommendation);
      if (index !== -1) {
        this.topicRecommendationArray.splice(index, 1);
        this.deleteRecommendationTemplate(recommendation);
      }
    }

  }

  disableFields(recommendationId: number | undefined): boolean {
    return recommendationId === undefined;
  }

  private deleteRecommendationTemplate(recommendation: TopicLevelRecommendation) {
    if (recommendation.recommendationId != undefined) {
      this.appService.deleteTopicRecommendation(this.assessmentId, this.topicId, recommendation.recommendationId).subscribe({
        next: (_data) => {
        }, error: _error => {
          this.showError("Data cannot be deleted", "Close");
        }
      })
    }
  }


}
