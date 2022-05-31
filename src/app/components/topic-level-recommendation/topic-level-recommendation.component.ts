import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {TopicRatingAndRecommendation} from "../../types/topicRatingAndRecommendation";
import {ControlContainer, NgForm} from "@angular/forms";
import {TopicScoreComponent} from "../topic-score/topic-score.component";

@Component({
  selector: 'app-topic-level-recommendation',
  templateUrl: './topic-level-recommendation.component.html',
  styleUrls: ['./topic-level-recommendation.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]

})
export class TopicLevelRecommendationComponent implements OnInit{

 @Input()
  topicRecommendation:number;
 @Input()
  topicRatingAndRecommendation: TopicRatingAndRecommendation;
 @ViewChild(TopicScoreComponent)
 topicScoreComponent: TopicScoreComponent;


  getRecommendation(topicId: number): TopicRatingAndRecommendation {
    if (topicId == this.topicRatingAndRecommendation.topicId) {
      console.log(this.topicRatingAndRecommendation)
      return this.topicRatingAndRecommendation;
    } else {
      const newRecommendation = {topicId: topicId}
      this.topicRatingAndRecommendation = <TopicRatingAndRecommendation>newRecommendation;
      return this.topicRatingAndRecommendation;
    }
  }

  ngOnInit(): void {
    console.log("TopicId",this.topicRatingAndRecommendation)
  }

}
