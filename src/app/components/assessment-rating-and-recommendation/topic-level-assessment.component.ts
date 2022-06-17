/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Input, OnInit} from '@angular/core';
import {TopicStructure} from "../../types/topicStructure";
import {Notes} from "../../types/answerRequest";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {FormBuilder} from "@angular/forms";
import {TopicRatingAndRecommendation} from "../../types/topicRatingAndRecommendation";
import {TopicRequest} from "../../types/topicRequest";
import {ParameterRequest} from "../../types/parameterRequest";
import {ParameterRatingAndRecommendation} from "../../types/parameterRatingAndRecommendation";
import {SaveRequest} from "../../types/saveRequest";
import {ParameterStructure} from "../../types/parameterStructure";
import {AssessmentStructure} from "../../types/assessmentStructure";
import {Store} from '@ngrx/store';
import * as fromReducer from '../../reducers/assessment.reducer';
import * as fromActions from '../../actions/assessment_data.actions'
import {AssessmentState} from "../../reducers/app.states";
import {Observable, takeUntil} from "rxjs";
import {AssessmentAnswerResponse} from "../../types/AssessmentAnswerResponse";


export const saveAssessmentData = [{}]

let topicId: number;
let topicRatingAndRecommendation: TopicRatingAndRecommendation;

export class parameterRequest {

  answerRequest1: Notes[] = [{questionId: 0, answer: ""}];
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
  styleUrls: ['./topic-level-assessment.component.css']
})


export class TopicLevelAssessmentComponent implements OnInit {
  averageRating: number = 0

  answerResponse: AssessmentStructure
  answerResponse1: Observable<AssessmentStructure>
  topicRequest: TopicRequest = {
    parameterLevel: parameterRequests = [],
    topicRatingAndRecommendation: topicRatingAndRecommendation
  };
  private cloneAnswerResponse: AssessmentStructure;
  private topicInputRequest: Observable<TopicStructure[]>;

  constructor(private appService: AppServiceService, private _fb: FormBuilder, private store: Store<AssessmentState>) {
    this.answerResponse1 = this.store.select(fromReducer.getAssessments)
  }

  public answerSaved: boolean = false;
  public makeDisable = false

  @Input() selectedIndex: number
  assessmentId: number
  @Input() topicInput: TopicStructure;
  assessmentStatus: string;

  topicRatingAndRecommendation: TopicRatingAndRecommendation = {
    rating: "",
    recommendation: "",
    topicId: topicId
  }

  ngOnInit(): void {
    this.answerResponse1.subscribe(data => {
      if (data !== undefined) {
        this.answerResponse = data
        this.assessmentId = this.answerResponse.assessmentId
        this.assessmentStatus = this.answerResponse.assessmentStatus
      }
    })
    this.getAssessment()
    this.getAverageRating()
  }

  save() {
    let answers: AssessmentAnswerResponse[] = []
    let parameterRatingAndRecomm: ParameterRatingAndRecommendation[] = []
    let topicRatingAndRecomm: TopicRatingAndRecommendation[] = []
    const saveRequest: SaveRequest = {
      assessmentId: this.assessmentId, topicRequest: this.topicRequest
    };
    this.appService.saveAssessment(saveRequest).subscribe((_data) => {
        if (saveRequest.topicRequest.topicRatingAndRecommendation !== undefined) {
          topicRatingAndRecomm.push(saveRequest.topicRequest.topicRatingAndRecommendation)
        }
        for (let eachParameter in saveRequest.topicRequest.parameterLevel) {
          if (saveRequest.topicRequest.parameterLevel[Number(eachParameter)].parameterRatingAndRecommendation !== undefined)
            parameterRatingAndRecomm.push(saveRequest.topicRequest.parameterLevel[Number(eachParameter)].parameterRatingAndRecommendation)
          for (let eachAnswer in saveRequest.topicRequest.parameterLevel[Number(eachParameter)].answerRequest) {
            if (saveRequest.topicRequest.parameterLevel[Number(eachParameter)].answerRequest[Number(eachAnswer)] !== undefined) {
              answers.push(<AssessmentAnswerResponse>saveRequest.topicRequest.parameterLevel[Number(eachParameter)].answerRequest[Number(eachAnswer)])
            }
          }
        }
        this.sendAnswers(answers, parameterRatingAndRecomm, topicRatingAndRecomm)
        saveAssessmentData.push(saveRequest);
      }
    )
    this.answerSaved = true
  }


  private getAssessment() {
    this.topicParameterValidation()
  }


  private topicParameterValidation() {
    if (this.topicInput.references != null) {
      for (let parameter in this.topicInput.parameters) {
        this.getParameterRequest(this.topicInput.parameters[parameter])
      }
      this.getTopicLevelRatingAndRecommendation()

    } else {
      for (let parameter in this.topicInput.parameters) {
        this.getParameterWithRatingAndRecommendationRequest(this.topicInput.parameters[parameter])
      }
    }
  }

  getNotes(questionId: number, answer: string): Notes {
    return {
      questionId: questionId, answer: answer
    };
  }


  getAnswersList(parameter: ParameterStructure): Notes[] {
    const answerRequest = []
    let answer = ""
    for (let question in parameter.questions) {
      if (this.answerResponse.answerResponseList !== undefined) {
        let indexQuestion = this.answerResponse.answerResponseList.findIndex(questionIdPos => questionIdPos.questionId == parameter.questions[question].questionId)
        if (indexQuestion !== -1) {
          answer = this.answerResponse.answerResponseList[indexQuestion].answer
        }
      }
      answerRequest.push(this.getNotes(parameter.questions[question].questionId, answer))
    }
    return answerRequest
  }


  getParameterRequest(parameter: ParameterStructure): ParameterRequest {
    let newParameterRequest = {
      answerRequest: this.getAnswersList(parameter)
    }
    this.topicRequest.parameterLevel.push(<ParameterRequest>newParameterRequest);
    return <ParameterRequest>newParameterRequest;
  }


  public getParameterWithRatingAndRecommendationRequest(parameter: ParameterStructure) {
    let indexByParameterId = 0
    let isRatingAndRecommendationPresent = false
    let newParameterRequest: ParameterRequest = {
      answerRequest: this.getAnswersList(parameter), parameterRatingAndRecommendation: {
        parameterId: parameter.parameterId, rating: "0", recommendation: ""
      }
    }

    if (this.answerResponse.parameterRatingAndRecommendation !== undefined) {
      indexByParameterId = this.answerResponse.parameterRatingAndRecommendation.findIndex(obj => obj.parameterId == parameter.parameterId)
      isRatingAndRecommendationPresent = this.answerResponse.parameterRatingAndRecommendation.some(el => el.rating || el.recommendation)
    }

    if (indexByParameterId !== -1 && isRatingAndRecommendationPresent) {
      newParameterRequest = {
        answerRequest: this.getAnswersList(parameter), parameterRatingAndRecommendation: {
          parameterId: parameter.parameterId,
          rating: this.answerResponse.parameterRatingAndRecommendation[indexByParameterId].rating,
          recommendation: this.answerResponse.parameterRatingAndRecommendation[indexByParameterId].recommendation
        }
      }
    }
    this.topicRequest.parameterLevel.push(newParameterRequest);
    return newParameterRequest;
  }


  private getTopicLevelRatingAndRecommendation() {
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

  private sendAnswers(answers: AssessmentAnswerResponse[], parameter: ParameterRatingAndRecommendation[], topic: TopicRatingAndRecommendation[]) {
    this.cloneAnswerResponse = Object.assign({}, this.answerResponse)
    if (answers[0] !== undefined) {
      this.cloneAnswerResponse.answerResponseList = this.cloneAnswerResponse.answerResponseList.filter(eachAnswer => !answers.find(eachAnswerQuestion =>
        eachAnswer['questionId'] === eachAnswerQuestion['questionId'])).concat(answers)
    }
    if (topic[0] !== undefined) {
      this.cloneAnswerResponse.topicRatingAndRecommendation = this.cloneAnswerResponse.topicRatingAndRecommendation.filter(eachTopic => !topic.find(eachAnswerQuestion =>
        eachTopic['topicId'] === eachAnswerQuestion['topicId'])).concat(topic)
    }
    if (parameter[0] !== undefined) {
      this.cloneAnswerResponse.parameterRatingAndRecommendation = this.cloneAnswerResponse.parameterRatingAndRecommendation.filter(eachParameter => !parameter.find(eachAnswerQuestion =>
        eachParameter['parameterId'] === eachAnswerQuestion['parameterId'])).concat(parameter)
    }
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneAnswerResponse}))
  }

  private getAverageRating() {
    let ratingSum = 0
    let ratingNumber = 0
    if (this.topicRequest.parameterLevel != null) {
      for (let parameter in this.topicRequest.parameterLevel) {
        if (this.topicRequest.parameterLevel[parameter].parameterRatingAndRecommendation) {
          ratingSum = ratingSum + Number(this.topicRequest.parameterLevel[parameter].parameterRatingAndRecommendation.rating);
          ratingNumber = ratingNumber + 1;
        }
      }
    }
    this.averageRating = ratingSum / ratingNumber;
  }
}

