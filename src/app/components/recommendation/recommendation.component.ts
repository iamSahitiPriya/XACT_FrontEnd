import {Component, Input, OnInit} from '@angular/core';
import {TopicLevelRecommendation} from "../../types/topicLevelRecommendation";
import {data_local} from "../../../assets/messages";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {FormBuilder} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Store} from "@ngrx/store";
import {AssessmentState} from "../../reducers/app.states";
import * as fromReducer from "../../reducers/assessment.reducer";
import {debounce} from "lodash";
import {AssessmentNotes} from "../../types/assessmentNotes";
import {TopicLevelRecommendationTextRequest} from "../../types/topicLevelRecommendationTextRequest";
import {TopicLevelAssessmentComponent} from "../assessment-rating-and-recommendation/topic-level-assessment.component";
import {TopicRecommendationResponse} from "../../types/topicRecommendationRespose";

export const topicRecommendationData = [{}]
let DEBOUNCE_TIME = 1200;

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.css']
})
export class RecommendationComponent{

  @Input()
  recommendation : TopicLevelRecommendation

  @Input()
  assessmentId : number

  @Input()
  topicId : number

  recommendationLabel = data_local.ASSESSMENT_TOPIC.RECOMMENDATION_LABEL
  assessmentStatus : string;

  constructor(private appService: AppServiceService, private _snackBar: MatSnackBar, private store: Store<AssessmentState>) {
    // this.answerResponse1 = this.store.select(fromReducer.getAssessments)
    this.saveParticularRecommendationText = debounce(this.saveParticularRecommendationText, DEBOUNCE_TIME)

  }

  recommendations : TopicLevelRecommendation ={recommendationId:undefined,recommendation:undefined}

  topicLevelRecommendationText : TopicLevelRecommendationTextRequest={
    assessmentId:0 ,topicId:0, topicLevelRecommendation: this.recommendations
}
  topicRecommendationResponse: TopicRecommendationResponse = {
   assessmentId :0 ,topicId:0,recommendationId:undefined,recommendation:undefined
  };


  showError(message: string, action: string) {
    this._snackBar.open(message, action, {
      verticalPosition: 'top',
      panelClass: ['errorSnackbar'],
      duration: 2000
    })
  }

  // ngOnInit(): void {
  //   // console.log(this.recommendation);
  // }

  saveParticularRecommendationText(_$event: KeyboardEvent) {
    this.topicLevelRecommendationText.assessmentId =this.assessmentId;
    this.topicLevelRecommendationText.topicId=this.topicId;
    this.recommendations.recommendationId = this.recommendation.recommendationId;
    this.recommendations.recommendation=this.recommendation.recommendation;
    this.topicRecommendationResponse.topicId=this.topicId;
    this.topicRecommendationResponse.assessmentId=this.assessmentId;
    this.topicRecommendationResponse.recommendationId=this.recommendation.recommendationId;
    this.topicRecommendationResponse.recommendation=this.recommendation.recommendation;
    this.appService.saveTopicRecommendationText(this.topicLevelRecommendationText).subscribe({
      next: (_data) => {
        topicRecommendationData.push(this.topicLevelRecommendationText);
          this.topicRecommendationResponse.recommendationId=_data.recommendationId;
        this.recommendation.recommendationId=this.topicRecommendationResponse.recommendationId;
        // this.sendRecommendation(this.topicRecommendationResponse)
        // this.updateDataSavedStatus()
      }, error: _error => {
        this.showError("Data cannot be saved", "Close");
      }
    })

  }


}
