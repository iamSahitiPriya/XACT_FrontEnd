/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Input, ViewChild} from '@angular/core';
import {TopicLevelAssessmentComponent} from "../topic-level-assessment/topic-level-assessment.component";

@Component({
  selector: 'app-functionalities',
  templateUrl: './functionalities.component.html',
  styleUrls: ['./functionalities.component.css']
})
export class FunctionalitiesComponent{
@ViewChild(TopicLevelAssessmentComponent) topicLevel:TopicLevelAssessmentComponent
@Input()selectedIndex:number
  next() {
    this.topicLevel.next()
  }
  previous(){
  this.topicLevel.previous()
  }
  cancel(){
  this.topicLevel.cancel()
  }
  save(){
  this.topicLevel.save()
  }
}
