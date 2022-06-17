import {Component, Input} from '@angular/core';
import {TopicRatingAndRecommendation} from "../../types/topicRatingAndRecommendation";
import {TopicReference} from "../../types/topicReference";

@Component({
  selector: 'app-topic-level-rating-and-recommendation',
  templateUrl: './topic-level-rating-and-recommendation.component.html',
  styleUrls: ['./topic-level-rating-and-recommendation.component.css']
})
export class TopicLevelRatingAndRecommendationComponent {

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

  setRating(rating: string) {
    if (this.assessmentStatus === 'Active') {
      if (this.topicRatingAndRecommendation.rating === rating) {
        this.topicRatingAndRecommendation.rating = undefined;
      } else {
        this.topicRatingAndRecommendation.rating = rating;
      }
      this.topicRatingAndRecommendation.topicId = this.topicId;
    }
  }
}
