/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {TopicStructure} from "../../types/topicStructure";
import {AssessmentQuestionComponent} from "../assessment-question/assessment-question.component";
import {Notes} from "../../types/answerRequest";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {MatDialog} from "@angular/material/dialog";
import {ControlContainer, FormBuilder, NgForm} from "@angular/forms";
import {TopicRatingAndRecommendation} from "../../types/topicRatingAndRecommendation";
import {TopicRequest} from "../../types/topicRequest";
import {ParameterRequest} from "../../types/parameterRequest";
import {TopicLevelRecommendationComponent} from "../topic-level-recommendation/topic-level-recommendation.component";
import {ParameterRatingAndRecommendation} from "../../types/parameterRatingAndRecommendation";
import {SaveRequest} from "../../types/saveRequest";
import {ParameterStructure} from "../../types/parameterStructure";


export const saveAssessmentData = [{}]

let topicId: number;
let topicRatingAndRecommendation: TopicRatingAndRecommendation;

export class parameterRequest {

  answerRequest: Notes[] = []
  parameterRatingAndRecommendation: ParameterRatingAndRecommendation

  constructor(answerRequest: Notes[], parameterRatingAndRecommendation: ParameterRatingAndRecommendation) {
    this.answerRequest = answerRequest;
    this.parameterRatingAndRecommendation = parameterRatingAndRecommendation;
  }
}

let parameterRequests: parameterRequest[];

@Component({
  selector: 'app-topic-level-assessment',
  templateUrl: './topic-level-assessment.component.html',
  styleUrls: ['./topic-level-assessment.component.css'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})


export class TopicLevelAssessmentComponent implements OnInit {

  topicRequest: TopicRequest = {
    parameterLevel: parameterRequests=[],
    topicRatingAndRecommendation: topicRatingAndRecommendation
  };

  constructor(public dialog: MatDialog, private appService: AppServiceService, private _fb: FormBuilder) {
  }


  public answerSaved: boolean = false;
  public makeDisable = false
  @Input() selectedIndex: number
  @Input() assessmentId: number
  @Input() topicInput: TopicStructure;
  @Input() assessmentStatus: string;

  topicRatingAndRecommendation: TopicRatingAndRecommendation = {
    rating: "",
    recommendation: "",
    topicId: topicId
  }

  @ViewChild(AssessmentQuestionComponent)
  assessmentQuestionComponent: AssessmentQuestionComponent;

  @ViewChild(TopicLevelRecommendationComponent)
  topicLevelRecommendationComponent: TopicLevelRecommendationComponent;

  save() {

    const saveRequest: SaveRequest = {
      assessmentId: this.assessmentId, topicRequest: this.topicRequest
    };
    this.appService.saveAssessment(saveRequest).subscribe((_data) => {
        saveAssessmentData.push(saveRequest);
      }
    )
    this.answerSaved = true
  }

  receiveRating(topicRating: TopicRatingAndRecommendation) {
    this.topicRatingAndRecommendation.rating = topicRating.rating
    this.topicLevelRecommendationComponent.topicRatingAndRecommendation.rating = topicRating.rating;
  }

  getNotes(questionId: number): Notes {
    return {
      questionId: questionId, answer: ""
    };
  }


  getParameterRequest(parameter: ParameterStructure): ParameterRequest {
    const answerRequest = []
    for (let question in parameter.questions) {
      answerRequest.push(this.getNotes(parameter.questions[question].questionId))
    }
    const newParameterRequest = {
      answerRequest: answerRequest
    }
    this.topicRequest.parameterLevel.push(<ParameterRequest>newParameterRequest);
    return <ParameterRequest>newParameterRequest;
  }


  getParameterWithRatingAndRecommendationRequest(parameter: ParameterStructure): ParameterRequest {
    const answerRequest = []
    for (let question in parameter.questions) {
      answerRequest.push(this.getNotes(parameter.questions[question].questionId))
    }
    const newParameterRequest = {
      answerRequest: answerRequest, parameterRatingAndRecommendation: {
        parameterId: parameter.parameterId, rating:undefined, recommendation: ""
      }
    }
    this.topicRequest.parameterLevel.push(<ParameterRequest>newParameterRequest);
    return <ParameterRequest>newParameterRequest;
  }

  ngOnInit(): void {
    if (this.topicInput.references!= null) {
      for (let parameter in this.topicInput.parameters) {
        this.getParameterRequest(this.topicInput.parameters[parameter])
      }
      this.topicRequest.topicRatingAndRecommendation = {
        rating: undefined,
        recommendation: undefined,
        topicId: this.topicInput.topicId
      }

    } else {
        for (let parameter in this.topicInput.parameters) {
          this.getParameterWithRatingAndRecommendationRequest(this.topicInput.parameters[parameter])
        }
      }
  }
}
