/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Input, OnDestroy, OnInit, Optional} from '@angular/core';
import {TopicStructure} from "../../types/topicStructure";
import {Notes} from "../../types/answerRequest";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {TopicRatingAndRecommendation} from "../../types/topicRatingAndRecommendation";
import {TopicRequest} from "../../types/topicRequest";
import {ParameterRequest} from "../../types/parameterRequest";
import {ParameterRatingAndRecommendation} from "../../types/parameterRatingAndRecommendation";
import {SaveRequest} from "../../types/saveRequest";
import {ParameterStructure} from "../../types/parameterStructure";
import {AssessmentStructure} from "../../types/assessmentStructure";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Store} from '@ngrx/store';
import * as fromReducer from '../../reducers/assessment.reducer';
import * as fromActions from '../../actions/assessment-data.actions'
import {AssessmentState} from "../../reducers/app.states";
import {Observable, Subject, takeUntil} from "rxjs";
import {AssessmentAnswerResponse} from "../../types/AssessmentAnswerResponse";
import {TopicRatingResponse} from "../../types/topicRatingResponse";
import {data_local} from "../../../assets/messages";

export const saveAssessmentData = [{}]

let topicRatingAndRecommendation: TopicRatingAndRecommendation;

export class parameterRequest {

  answerRequest1: Notes[] = [{questionId: 0, answer: ""}];
  parameterRatingAndRecommendation: ParameterRatingAndRecommendation

  constructor(answerRequest: Notes[], parameterRatingAndRecommendation: ParameterRatingAndRecommendation) {
    this.answerRequest1 = answerRequest;
    this.parameterRatingAndRecommendation = parameterRatingAndRecommendation
  }
}

let parameterRequests: parameterRequest[];

@Component({
  selector: 'app-topic-level-assessment',
  templateUrl: './topic-level-assessment.component.html',
  styleUrls: ['./topic-level-assessment.component.css']
})


export class TopicLevelAssessmentComponent implements OnInit, OnDestroy {
  averageRating: TopicRatingResponse = {topicId: 0, rating: 0}
  disableRating: number = 0
  form: FormGroup

  saveButtonToolTip = data_local.SAVE_ASSESSMENT_BUTTON.TOOLTIP;
  saveButtonText = data_local.SAVE_ASSESSMENT_BUTTON.TITLE;

  answerResponse: AssessmentStructure
  answerResponse1: Observable<AssessmentStructure>
  topicRequest: TopicRequest = {
    parameterLevel: parameterRequests = [],
    topicRatingAndRecommendation: topicRatingAndRecommendation
  };

  private cloneAnswerResponse: AssessmentStructure;
  private cloneAnswerResponse1: AssessmentStructure;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private _snackBar: MatSnackBar, @Optional() private appService: AppServiceService, @Optional() private _fb: FormBuilder, @Optional() private store: Store<AssessmentState>) {
    this.answerResponse1 = this.store.select(fromReducer.getAssessments)
  }


  public answerSaved: string
  public makeDisable = false

  @Input() selectedIndex: number
  assessmentId: number
  @Input() topicInput: TopicStructure;
  assessmentStatus: string;


  ngOnInit(): void {
    this.answerResponse1.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data !== undefined) {
        this.answerResponse = {...data}
        this.assessmentId = this.answerResponse.assessmentId
        this.assessmentStatus = this.answerResponse.assessmentStatus
      }
    })
    this.getAssessment()
    this.updateAverageRating()
  }

  save() {
    let answers: AssessmentAnswerResponse[] = []
    let parameterRatingAndRecomm: ParameterRatingAndRecommendation[] = []
    let topicRatingAndRecomm: TopicRatingAndRecommendation[] = []
    const saveRequest: SaveRequest = {
      assessmentId: this.assessmentId, topicRequest: this.topicRequest
    };
    this.appService.saveAssessment(saveRequest).pipe(takeUntil(this.destroy$)).subscribe(() => {
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
        window.location.reload();
      }
    )
    this.updateDataSavedStatus()
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

  getNotes(questionId: number, answer: string | undefined): Notes {
    return {
      questionId: questionId, answer: answer
    };
  }


  getAnswersList(parameter: ParameterStructure): Notes[] {
    const answerRequest = []
    let answer: string | undefined;
    for (let question in parameter.questions) {
      if (this.answerResponse.answerResponseList !== undefined) {
        let indexQuestion = this.answerResponse.answerResponseList.findIndex(questionIdPos => questionIdPos.questionId == parameter.questions[question].questionId)
        if (indexQuestion !== -1) {
          answer = this.answerResponse.answerResponseList[indexQuestion].answer
        }
      }
      answerRequest.push(this.getNotes(parameter.questions[question].questionId, answer))
      answer = undefined;
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
    let newParameterRequest: ParameterRequest;


    if (this.answerResponse.parameterRatingAndRecommendation !== undefined) {
      indexByParameterId = this.answerResponse.parameterRatingAndRecommendation.findIndex(obj => obj.parameterId == parameter.parameterId)
      isRatingAndRecommendationPresent = this.answerResponse.parameterRatingAndRecommendation.some(el => el.parameterId == parameter.parameterId)
    }
    if (indexByParameterId !== -1 && isRatingAndRecommendationPresent) {
      newParameterRequest = {
        answerRequest: this.getAnswersList(parameter), parameterRatingAndRecommendation: {
          parameterId: parameter.parameterId,
          rating: this.answerResponse.parameterRatingAndRecommendation[indexByParameterId].rating,
          parameterLevelRecommendation: this.answerResponse.parameterRatingAndRecommendation[indexByParameterId].parameterLevelRecommendation ? this.answerResponse.parameterRatingAndRecommendation[indexByParameterId].parameterLevelRecommendation : [{
            recommendationId: undefined,
            recommendation: "",
            impact: "",
            effort: "",
            deliveryHorizon: ""
          }]
        }
      }
    } else {
      newParameterRequest = {
        answerRequest: this.getAnswersList(parameter),
        parameterRatingAndRecommendation: {
          rating: 0,
          parameterLevelRecommendation: [{
            recommendationId: undefined,
            recommendation: "",
            impact: "",
            effort: "",
            deliveryHorizon: ""
          }],
          parameterId: parameter.parameterId
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
      isRatingAndTopicPresent = this.answerResponse.topicRatingAndRecommendation.some(el => el.topicId == this.topicInput.topicId)
      indexByTopicId = this.answerResponse.topicRatingAndRecommendation.findIndex(obj => obj.topicId == this.topicInput.topicId)
    }
    if (isRatingAndTopicPresent) {
      this.topicRequest.topicRatingAndRecommendation = {
        rating: this.answerResponse.topicRatingAndRecommendation[indexByTopicId].rating ? this.answerResponse.topicRatingAndRecommendation[indexByTopicId].rating : 0,
        topicLevelRecommendation: this.answerResponse.topicRatingAndRecommendation[indexByTopicId].topicLevelRecommendation ? this.answerResponse.topicRatingAndRecommendation[indexByTopicId].topicLevelRecommendation : [{
          recommendationId: undefined,
          recommendation: "",
          impact: "",
          effort: "",
          deliveryHorizon: ""
        }],
        topicId: this.topicInput.topicId
      }
    } else {
      this.topicRequest.topicRatingAndRecommendation = {
        rating: 0,
        topicLevelRecommendation: [{
          recommendationId: undefined,
          recommendation: "",
          impact: "",
          effort: "",
          deliveryHorizon: ""
        }],
        topicId: this.topicInput.topicId
      }
    }
  }


  private sendAnswers(answers: AssessmentAnswerResponse[], parameter: ParameterRatingAndRecommendation[], topic: TopicRatingAndRecommendation[]) {
    this.cloneAnswerResponse = Object.assign({}, this.answerResponse)
    if (answers[0] !== undefined && this.cloneAnswerResponse.answerResponseList !== undefined) {
      this.cloneAnswerResponse.answerResponseList = this.cloneAnswerResponse.answerResponseList.filter(eachAnswer => !answers.find(eachAnswerQuestion =>
        eachAnswer['questionId'] === eachAnswerQuestion['questionId'])).concat(answers)
    } else {
      this.cloneAnswerResponse.answerResponseList = answers
    }
    if (topic[0] !== undefined && this.cloneAnswerResponse.topicRatingAndRecommendation !== undefined) {
      this.cloneAnswerResponse.topicRatingAndRecommendation = this.cloneAnswerResponse.topicRatingAndRecommendation.filter(eachTopic => !topic.find(eachAnswerQuestion =>
        eachTopic['topicId'] === eachAnswerQuestion['topicId'])).concat(topic)
    } else {
      this.cloneAnswerResponse.topicRatingAndRecommendation = topic
    }
    if (parameter[0] !== undefined && this.cloneAnswerResponse.parameterRatingAndRecommendation !== undefined) {
      this.cloneAnswerResponse.parameterRatingAndRecommendation = this.cloneAnswerResponse.parameterRatingAndRecommendation.filter(eachParameter => !parameter.find(eachAnswerQuestion =>
        eachParameter['parameterId'] === eachAnswerQuestion['parameterId'])).concat(parameter)
    } else {
      this.cloneAnswerResponse.parameterRatingAndRecommendation = parameter
    }
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneAnswerResponse}))
  }

  public updateAverageRating() {
    let ratingSum = 0
    let ratingNumber = 0
    if (this.topicRequest.topicRatingAndRecommendation) {
      this.averageRating.rating = this.topicRequest.topicRatingAndRecommendation.rating
      this.averageRating.topicId = this.topicInput.topicId
    } else {
      for (let parameter in this.topicRequest.parameterLevel) {
        if (this.topicRequest.parameterLevel[parameter].parameterRatingAndRecommendation) {
          ratingSum = ratingSum + Number(this.topicRequest.parameterLevel[parameter].parameterRatingAndRecommendation.rating);
          if (Number(this.topicRequest.parameterLevel[parameter].parameterRatingAndRecommendation.rating) > 0) {
            ratingNumber = ratingNumber + 1;
          }
        }
      }
      if (ratingSum !== 0 && ratingNumber !== 0) {
        this.averageRating.rating = Math.round(ratingSum / ratingNumber);
        this.averageRating.topicId = this.topicInput.topicId


      } else {
        this.averageRating.rating = 0
        this.averageRating.topicId = this.topicInput.topicId
      }
    }
  }

  private updateDataSavedStatus() {
    this.cloneAnswerResponse1 = Object.assign({}, this.answerResponse)
    this.cloneAnswerResponse1.updatedAt = Number(new Date(Date.now()))
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneAnswerResponse1}))
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
