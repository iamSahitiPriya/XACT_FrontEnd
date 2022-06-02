import {Component, Input, ViewChild} from '@angular/core';
import {TopicRatingAndRecommendation} from "../../types/topicRatingAndRecommendation";
import {ControlContainer, NgForm} from "@angular/forms";
import {TopicScoreComponent} from "../topic-score/topic-score.component";

@Component({
  selector: 'app-topic-level-recommendation',
  templateUrl: './topic-level-recommendation.component.html',
  styleUrls: ['./topic-level-recommendation.component.css'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class TopicLevelRecommendationComponent {

  @Input()
  topicRecommendation: number;
  @Input()
  topicRatingAndRecommendation: TopicRatingAndRecommendation;
  @ViewChild(TopicScoreComponent)
  topicScoreComponent: TopicScoreComponent;


}
