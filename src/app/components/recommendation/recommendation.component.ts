import {Component, Input, OnInit} from '@angular/core';
import {TopicLevelRecommendation} from "../../types/topicLevelRecommendation";
import {data_local} from "../../../assets/messages";

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.css']
})
export class RecommendationComponent{

  @Input()
  recommendation : TopicLevelRecommendation

  recommendationLabel = data_local.ASSESSMENT_TOPIC.RECOMMENDATION_LABEL
  assessmentStatus : string;
  constructor() { }

  // ngOnInit(): void {
  //   // console.log(this.recommendation);
  // }

  // saveParticularRecommendation(_$event: KeyboardEvent) {
  //   this.topicLevelRecommendation.topicId = this.topicId
  //   this.topicLevelRecommendation.assessmentId = this.assessmentId
  //   this.topicLevelRecommendation.topicLevelRecommendation = this.topicRatingAndRecommendation.topicLevelRecommendation
  //   this.topicRecommendationResponse.topicId = this.topicId
  //   this.topicRecommendationResponse.topicLevelRecommendation = this.topicRatingAndRecommendation.topicLevelRecommendation
  //   this.appService.saveTopicRecommendation(this.topicLevelRecommendation).subscribe({
  //     next: (_data) => {
  //       topicRecommendationData.push(this.topicLevelRecommendation);
  //       this.sendRecommendation(this.topicRecommendationResponse)
  //       this.updateDataSavedStatus()
  //     }, error: _error => {
  //       this.showError("Data cannot be saved", "Close");
  //     }
  //   })



}
