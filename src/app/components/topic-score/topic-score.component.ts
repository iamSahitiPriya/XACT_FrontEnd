/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Input} from '@angular/core';
import {TopicReference} from "../../types/topicReference";

@Component({
  selector: 'app-topic-score',
  templateUrl: './topic-score.component.html',
  styleUrls: ['./topic-score.component.css']
})
export class TopicScoreComponent {

  @Input()
  topicScore: TopicReference[];

  next() {

  }
}
