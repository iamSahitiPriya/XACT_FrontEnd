/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {parameterRequest, TopicLevelAssessmentComponent} from './topic-level-assessment.component';
import {TopicScoreComponent} from "../topic-score/topic-score.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCardModule} from "@angular/material/card";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {of} from "rxjs";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AssessmentQuestionComponent} from "../assessment-question/assessment-question.component";
import {SaveRequest} from "../../types/saveRequest";
import {AssessmentModulesDetailsComponent} from "../assessment-modules-details/assessment-modules-details.component";
import {
  ParameterLevelRatingAndRecommendationComponent
} from "../parameter-level-rating-and-recommendation/parameter-level-rating-and-recommendation.component";
import {TopicLevelRecommendationComponent} from "../topic-level-recommendation/topic-level-recommendation.component";
import {CommonModule} from "@angular/common";
import {ParameterStructure} from "../../types/parameterStructure";
import {ParameterRequest} from "../../types/parameterRequest";
import {ParameterRatingAndRecommendation} from "../../types/parameterRatingAndRecommendation";
import {Notes} from "../../types/answerRequest";

class MockAppService {

  public getAssessment(assessmentId : number) {
    const mockAssessmentStructure = {
      "assessmentId": 5,
      "assessmentName": "abc1",
      "organisationName": "Thoughtworks",
      "assessmentStatus": "Active",
      "updatedAt": 1654664982698,
      "answerResponseList": [
      {
        "questionId": 1,
        "answer": "answer1"
      },
     ],
      "topicRatingAndRecommendation": [{topicId:1,rating:"2",recommendation:""}],
      "parameterRatingAndRecommendation":[]
    }
    return of(mockAssessmentStructure)

  }

  saveAssessment(saveRequest: SaveRequest) {
    return of(saveRequest);
  }
}

let parameter: { parameterId: number; references: any[]; questions: { questionId: number; parameter: number; questionText: string }[]; topic: number; parameterName: string }


describe('TopicLevelAssessmentComponent', () => {
  let component: TopicLevelAssessmentComponent, fixture: ComponentFixture<TopicLevelAssessmentComponent>,
    component1: AssessmentQuestionComponent, fixture1: ComponentFixture<AssessmentQuestionComponent>,
    component2: TopicLevelRecommendationComponent, fixture2: ComponentFixture<TopicLevelRecommendationComponent>,
    mockAppService: MockAppService,
    dialog: any, matDialog: any;
  const original = window.location;
  const reloadFn = () => {
    window.location.reload();
  };

  beforeEach(async () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {reload: jest.fn()}
    })
    await TestBed.configureTestingModule({
      declarations: [TopicLevelAssessmentComponent, TopicScoreComponent, AssessmentQuestionComponent, AssessmentModulesDetailsComponent, ParameterLevelRatingAndRecommendationComponent, TopicLevelRecommendationComponent],
      providers: [{provide: AppServiceService, useClass: MockAppService},
      ],
      imports: [MatFormFieldModule, MatCardModule, MatDialogModule, NoopAnimationsModule, FormsModule, ReactiveFormsModule, BrowserAnimationsModule, CommonModule],

    })
      .compileComponents();
  });
  afterAll(() => {
    Object.defineProperty(window, 'location', {configurable: true, value: original});
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicLevelAssessmentComponent);
    component = fixture.componentInstance;
    fixture1 = TestBed.createComponent(AssessmentQuestionComponent);
    component1 = fixture1.componentInstance;
    fixture2 = TestBed.createComponent(TopicLevelRecommendationComponent)
    component2 = fixture2.componentInstance;
    dialog = TestBed.inject(MatDialog);
    matDialog = fixture.debugElement.injector.get(MatDialog)
    component = fixture.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save answers and reload the page', () => {
    component.assessmentId = 123;
    component.save();
    reloadFn()
    expect(window.location.reload).toHaveBeenCalled()
  });

  it('should able to receive rating', () => {
    const topicRatingAndRecommendation = {
      rating: "2",
      recommendation: "some text",
      topicId: 1
    }
    component.topicRatingAndRecommendation = {rating: "1", recommendation: "none", topicId: 1};
    component.topicLevelRecommendationComponent = component2;
    component2.topicRatingAndRecommendation = {rating: "1", recommendation: "none", topicId: 1};
    component.receiveRating(topicRatingAndRecommendation)
    expect(component.topicRatingAndRecommendation.rating).toEqual("2");
    expect(component.topicLevelRecommendationComponent.topicRatingAndRecommendation.rating).toEqual("2");
  })

  it('should able to get the parameter level details from the parameter structure', () => {
    parameter = {
      parameterId: 1,
      parameterName: "hello",
      topic: 1,
      questions: [
        {
          questionId: 1,
          questionText: "some text",
          parameter: 1
        }
      ],
      references: []
    }
    let answerRequest = []
    for (let question in parameter.questions) {
      answerRequest.push(parameter.questions[question].questionId)
    }
    expect(answerRequest[0]).toEqual(1);
  })
  it("should get the parameter level answer request", () => {
    parameter = {
      parameterId: 1,
      parameterName: "hello",
      topic: 1,
      questions: [
        {
          questionId: 1,
          questionText: "some text",
          parameter: 1
        }
      ],
      references: []
    }
    component.answerResponse = {assessmentId:5, assessmentName:"abc",organisationName:"",assessmentStatus:"",
    updatedAt:0,answerResponseList:[{questionId:0,answer:"some answer"}],topicRatingAndRecommendation:[{topicId:0,rating:"1",recommendation:"some recomm"}],
    parameterRatingAndRecommendation:[{parameterId:0,rating:"1",recommendation:""}]}
    expect(component.getParameterWithRatingAndRecommendationRequest(parameter)).toBeTruthy()

  });
  it("should call topic level is the topic input is null", () => {
    component.topicInput = {topicId:0,topicName:"",parameters:[{parameterId:0,parameterName:"",topic:1,questions:[],references:[]}],references:[],module:1,assessmentLevel:""}
    expect(component.ngOnInit()).toBe(undefined)
  });
  it("should call parameterRequest class", () => {
    let answerRequest1: Notes[] = [{questionId: 0, answer: ""}];
    let parameterRatingAndRecommendation: ParameterRatingAndRecommendation = {
      parameterId:0,rating:undefined,recommendation:""
    }
    let parameterRequest1 = new parameterRequest(answerRequest1,parameterRatingAndRecommendation)
    expect(parameterRequest1).toBeTruthy()
  });
  it("should get answer when parameter is passed", () => {
    component.answerResponse = {
      assessmentId: 5,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentStatus: "Active",
      updatedAt: 1654664982698,
      answerResponseList: [
        {
          questionId: 1,
          answer: "answer1"
        },],
      topicRatingAndRecommendation: [],
      parameterRatingAndRecommendation:[{parameterId:1,rating:"2",recommendation:""}]
    }
    const dummyAnswerRequest:Notes[] = [{questionId:1,answer:"answer1"}]
    expect(component.getAnswersList(parameter)).toStrictEqual(dummyAnswerRequest)
  });
  it("should get parameter rating and recommendation", () => {
    let dummyParameter:ParameterStructure = { parameterId:1,
      parameterName:"",
      topic:1,
      questions:[{questionId:1,questionText:"some text",parameter:1}],
      references:[]}
    component.answerResponse = {
      assessmentId: 5,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentStatus: "Active",
      updatedAt: 1654664982698,
      answerResponseList: [
        {
          questionId: 1,
          answer: "answer1"
        },],
      topicRatingAndRecommendation: [],
      parameterRatingAndRecommendation:[{parameterId:1,rating:"2",recommendation:""}]
    }
    const dummyAnswerRequest:Notes[] = [{questionId:1,answer:"answer1"}]

    let dummyNewParameter:ParameterRequest = {answerRequest:dummyAnswerRequest,parameterRatingAndRecommendation:{parameterId:1,rating:"2",recommendation:""}}
    expect(component.getParameterWithRatingAndRecommendationRequest(dummyParameter)).toStrictEqual(dummyNewParameter)
  });
});



