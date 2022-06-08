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
import {AssessmentAnswerResponse} from "../../types/AssessmentAnswerResponse";


export const saveAssessmentData = [{}]

let topicId: number;
let topicRatingAndRecommendation: TopicRatingAndRecommendation;

export class parameterRequest {

  answerRequest1: Notes[] = [{questionId:0, answer:""}];
  parameterRatingAndRecommendation: ParameterRatingAndRecommendation

  constructor(answerRequest: Notes[], parameterRatingAndRecommendation: ParameterRatingAndRecommendation) {
    this.answerRequest1 = answerRequest;
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
  answer:AssessmentAnswerResponse[]
  topicRatingAndRecommendations:TopicRatingAndRecommendation[]
  parameterRatingAndRecommendations:ParameterRatingAndRecommendation[]

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
    let indexQuestion = 0
    let answer = ""
    let newParameterRequest: { answerRequest: Notes[] }
    for (let question in parameter.questions) {
      if (this.answerResponse.answerResponseList !== undefined) {
        indexQuestion = this.answerResponse.answerResponseList.findIndex(questionIdPos => questionIdPos.questionId == parameter.questions[question].questionId)
        if (indexQuestion !== -1) {
          answer = this.answerResponse.answerResponseList[indexQuestion].answer
        }
      }
      answerRequest.push(this.getNotes(parameter.questions[question].questionId, answer))
    }

    newParameterRequest = {
      answerRequest: answerRequest
    }
    this.topicRequest.parameterLevel.push(<ParameterRequest>newParameterRequest);
    return <ParameterRequest>newParameterRequest;
  }


  getParameterWithRatingAndRecommendationRequest(parameter: ParameterStructure): ParameterRequest {
    const answerRequest = []
    let answer = ""
    let indexQuestion = 0
    for (let question in parameter.questions) {
      if (this.answerResponse.answerResponseList !== undefined) {
        indexQuestion = this.answerResponse.answerResponseList.findIndex(questionIdPos => questionIdPos.questionId == parameter.questions[question].questionId)
        if (indexQuestion !== -1) {
          answer = this.answerResponse.answerResponseList[indexQuestion].answer
        }
      }
      answerRequest.push(this.getNotes(parameter.questions[question].questionId, answer))
    }
    let ans = this.setParameterRatingAndRecommendation(answerRequest, parameter.parameterId)
    return ans
  }

  ngOnInit(): void {
    this.getAssessment()
  }

  private setParameterRatingAndRecommendation(answerRequest: Notes[], parameterId: number) {
    let indexByParameterId = 0
    let isRatingAndRecommendationPresent = false
    let newParameterRequest: ParameterRequest = {
      answerRequest: answerRequest, parameterRatingAndRecommendation: {
        parameterId: parameterId, rating:"0", recommendation: ""
      }}
    if (this.answerResponse.parameterRatingAndRecommendation !== undefined) {
      indexByParameterId = this.answerResponse.parameterRatingAndRecommendation.findIndex(obj => obj.parameterId == parameterId)
      isRatingAndRecommendationPresent = this.answerResponse.parameterRatingAndRecommendation.some(el => el.rating || el.recommendation)
    }
    if (indexByParameterId !== -1 && isRatingAndRecommendationPresent) {
      newParameterRequest = {
        answerRequest: answerRequest, parameterRatingAndRecommendation: {
          parameterId: parameterId,
          rating: this.answerResponse.parameterRatingAndRecommendation[indexByParameterId].rating,
          recommendation: this.answerResponse.parameterRatingAndRecommendation[indexByParameterId].recommendation
        }
      }
    }
    this.topicRequest.parameterLevel.push(newParameterRequest);
    return newParameterRequest;
  }

  private setTopicLevelRatingAndRecommendation() {
    let isRatingAndTopicPresent = false
    let indexByTopicId = 0
    if (this.answerResponse.topicRatingAndRecommendation !== undefined) {
      isRatingAndTopicPresent = this.answerResponse.topicRatingAndRecommendation.some(el => el.rating && el.topicId == this.topicInput.topicId)
      indexByTopicId = this.answerResponse.topicRatingAndRecommendation.findIndex(obj => obj.topicId == this.topicInput.topicId)

    }
    if (isRatingAndTopicPresent) {
      this.topicRequest.topicRatingAndRecommendation = {
        rating: this.answerResponse.topicRatingAndRecommendation[indexByTopicId].rating,
        recommendation: this.answerResponse.topicRatingAndRecommendation[indexByTopicId].recommendation,
        topicId: this.topicInput.topicId
      }
    } else {
      this.topicRequest.topicRatingAndRecommendation = {
        rating: "0",
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
        if(this.topicInput.parameters[parameter].questions) {
          this.getParameterRequest(this.topicInput.parameters[parameter])
        }
      }
      this.setTopicLevelRatingAndRecommendation()

    } else {
      for (let parameter in this.topicInput.parameters) {
        if (this.topicInput.parameters[parameter].questions) {
          this.getParameterWithRatingAndRecommendationRequest(this.topicInput.parameters[parameter])
        }
      }
    }
  }
}

