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
import {AssessmentStructure} from "../../types/assessmentStructure";
import EventEmitter from "events";


export const saveAssessmentData = [{}]

let topicId: number;
let topicRatingAndRecommendation: TopicRatingAndRecommendation;

export class parameterRequest {

  answerRequest: Notes[] = [];
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
  answerResponse: AssessmentStructure
  topicRequest: TopicRequest = {
    parameterLevel: parameterRequests = [],
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

  dataEmitter = new EventEmitter();
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

  getNotes(questionId: number, answer: string): Notes {
    return {
      questionId: questionId, answer: answer
    };
  }


  getParameterRequest(parameter: ParameterStructure): ParameterRequest {
    const answerRequest = []
    for (let question in parameter.questions) {
      const answer = this.answerResponse.answerResponseList[parameter.questions[question].questionId - 1].answer
      if(answer !== undefined ) {
        answerRequest.push(this.getNotes(parameter.questions[question].questionId, answer))
      }else{
        answerRequest.push(this.getNotes(parameter.questions[question].questionId, ""))
      }
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

      const indexQuestion = this.answerResponse.answerResponseList.findIndex(questionIdPos => questionIdPos.questionId == parameter.questions[question].questionId)
      const answer = this.answerResponse.answerResponseList[indexQuestion].answer
      if (answer !== undefined) {
        answerRequest.push(this.getNotes(parameter.questions[question].questionId, answer))
      }else{
        answerRequest.push(this.getNotes(parameter.questions[question].questionId, ""))
      }
    }
    const indexByParameterId = this.answerResponse.parameterRatingAndRecommendation.findIndex(obj =>
      obj.parameterId == parameter.parameterId)

    const isRatingAndRecommendationPresent = this.answerResponse.parameterRatingAndRecommendation.some(el => el.rating || el.recommendation)

    if (indexByParameterId !== -1 && isRatingAndRecommendationPresent) {
      const newParameterRequest: ParameterRequest = {
        answerRequest: answerRequest, parameterRatingAndRecommendation: {
          parameterId: parameter.parameterId,
          rating: this.answerResponse.parameterRatingAndRecommendation[indexByParameterId].rating,
          recommendation: this.answerResponse.parameterRatingAndRecommendation[indexByParameterId].recommendation
        }
      }
      this.topicRequest.parameterLevel.push(newParameterRequest);
      return newParameterRequest;
    } else {
      const newParameterRequest: ParameterRequest = {
        answerRequest: answerRequest, parameterRatingAndRecommendation: {
          parameterId: parameter.parameterId, rating: undefined, recommendation: ""
        }
      }
      this.topicRequest.parameterLevel.push(newParameterRequest);
      return newParameterRequest;
    }
  }

  ngOnInit(): void {
    this.getAssessment()
  }

  private setTopicLevelRatingAndRecommendation() {
    const isRatingAndTopicPresent = this.answerResponse.topicRatingAndRecommendation.some(el => el.rating && el.topicId == this.topicInput.topicId)
    const indexByTopicId = this.answerResponse.topicRatingAndRecommendation.findIndex(obj => obj.topicId == this.topicInput.topicId)

    if (isRatingAndTopicPresent) {
      this.topicRequest.topicRatingAndRecommendation = {
        rating: this.answerResponse.topicRatingAndRecommendation[indexByTopicId].rating,
        recommendation: this.answerResponse.topicRatingAndRecommendation[indexByTopicId].recommendation,
        topicId: this.topicInput.topicId
      }
    } else {
      this.topicRequest.topicRatingAndRecommendation = {
        rating: undefined,
        recommendation: "",
        topicId: this.topicInput.topicId
      }
    }
  }

  private getAssessment() {
    this.appService.getAssessment(this.assessmentId).subscribe((_data) => {
      this.answerResponse = _data
      this.topicParameterValidation()
    })

  }

  private topicParameterValidation() {
    if (this.topicInput.references != null) {
      for (let parameter in this.topicInput.parameters) {
        this.getParameterRequest(this.topicInput.parameters[parameter])
      }
      this.setTopicLevelRatingAndRecommendation()

    } else {
      for (let parameter in this.topicInput.parameters) {
        this.getParameterWithRatingAndRecommendationRequest(this.topicInput.parameters[parameter])
      }
    }
  }
}

