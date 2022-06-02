/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TopicReference} from "../../types/topicReference";
import {TopicRatingAndRecommendation} from "../../types/topicRatingAndRecommendation";

@Component({
  selector: 'app-topic-score',
  templateUrl: './topic-score.component.html',
  styleUrls: ['./topic-score.component.css']
})
export class TopicScoreComponent {

  @Input()
  topicScore: TopicReference[];

  @Input()
  topicId: number;

  @Input()
  topicRatingAndRecommendation: TopicRatingAndRecommendation;

  @Output() topicRatingEmitter = new EventEmitter<TopicRatingAndRecommendation>();


  sendRating() {
    this.topicRatingEmitter.emit(this.topicRatingAndRecommendation)
  }


  setRating(rating: string) {
    this.topicRatingAndRecommendation.rating = rating;
    this.topicRatingAndRecommendation.topicId=this.topicId;
  }

}
