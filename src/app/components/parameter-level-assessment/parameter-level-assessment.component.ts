/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {TopicStructure} from "../../types/topicStructure";
import {AssessmentQuestionComponent} from "../assessment-question/assessment-question.component";
import {AssessmentRecommendationComponent} from "../assessment-recommendation/assessment-recommendation.component";
import {Notes} from "../../types/notes";

@Component({
  selector: 'app-parameter-level-assessment',
  templateUrl: './parameter-level-assessment.component.html',
  styleUrls: ['./parameter-level-assessment.component.css']
})
export class ParameterLevelAssessmentComponent {
  notes: Notes[] = [];

  constructor() {
  }

  @Input() selectedIndex: number
  @Output() goNext = new EventEmitter<number>();
  @Output() goBack = new EventEmitter<number>();
  @Input()
  topicInput: TopicStructure;

  next() {
    this.selectedIndex += 1
    this.goNext.emit(this.selectedIndex)
  }

  previous() {
    if (this.selectedIndex != 0) {
      this.selectedIndex -= 1
      this.goBack.emit(this.selectedIndex)
    }
  }

  @ViewChild(AssessmentQuestionComponent)
  private assessmentQuestionComponent: AssessmentQuestionComponent;

  @ViewChild(AssessmentRecommendationComponent)
  private assessmentRecommendationComponent: AssessmentRecommendationComponent;

  cancel() {
    this.assessmentQuestionComponent.handleCancel()
    this.assessmentRecommendationComponent.handleCancel()

  }
}
