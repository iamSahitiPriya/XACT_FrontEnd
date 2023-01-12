/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';
import * as fromReducer from '../../reducers/assessment.reducer';
import {parameterRequest, TopicLevelAssessmentComponent} from './topic-level-assessment.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCardModule} from "@angular/material/card";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {of} from "rxjs";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AssessmentQuestionComponent} from "../assessment-parameter-questions/assessment-question.component";
import {SaveRequest} from "../../types/saveRequest";
import {AssessmentModulesDetailsComponent} from "../assessment-modules-details/assessment-modules-details.component";
import {ParameterLevelRatingComponent} from "../parameter-level-rating/parameter-level-rating.component";
import {CommonModule} from "@angular/common";
import {TopicLevelRatingComponent} from "../topic-level-rating/topic-level-rating.component";
import {ParameterStructure} from 'src/app/types/parameterStructure';
import {Notes} from 'src/app/types/answerNotes';
import {ParameterRatingAndRecommendation} from 'src/app/types/parameterRatingAndRecommendation';
import {ParameterRequest} from "../../types/parameterRequest";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../reducers/reducers";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {debounce} from "lodash";
import {AssessmentAverageRatingComponent} from "../assessment-average-rating/assessment-average-rating.component";
import {AssessmentStructure} from "../../types/assessmentStructure";
import {UserQuestion} from "../../types/UserQuestion";
import {UserQuestionSaveRequest} from "../../types/userQuestionSaveRequest";
import {OKTA_AUTH} from "@okta/okta-angular";
import oktaAuth from "@okta/okta-auth-js";

class MockAppService {

  public getAssessment(assessmentId: number) {
    const mockAssessmentStructure = {
      assessmentId: 5,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentStatus: "Active",
      updatedAt: 1654664982698,
      answerResponseList: [
        {
          questionId: 1,
          answer: "answer1"
        },
      ],
      "userQuestionResponseList":[],
      "topicRatingAndRecommendation": [{topicId: 1, rating: 2, recommendation: ""}],
      "parameterRatingAndRecommendation": [],
      isOwner: false
    }
    return of(mockAssessmentStructure)

  }

  saveAssessment(saveRequest: SaveRequest) {
    return of(saveRequest);
  }
}


let parameter: { parameterId: number; references: any[]; questions: { questionId: number; parameter: number; questionText: string }[];userQuestions:{questionId: number; question:string; answer:string}[]; topic: number; parameterName: string, active: false, updatedAt: 0, comments: "" }
jest.useFakeTimers();

describe('TopicLevelAssessmentComponent', () => {
  let func: jest.Mock;
  let debouncedFunc: Function;
  let component: TopicLevelAssessmentComponent, fixture: ComponentFixture<TopicLevelAssessmentComponent>,
    component1: AssessmentQuestionComponent, fixture1: ComponentFixture<AssessmentQuestionComponent>,
    component2: TopicLevelRatingComponent,
    fixture2: ComponentFixture<TopicLevelRatingComponent>,
    mockAppService: MockAppService;

  const original = window.location;
  const reloadFn = () => {
    window.location.reload();
  };

  beforeEach(async () => {
    func = jest.fn();
    debouncedFunc = debounce(func, 1000);
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {reload: jest.fn()}
    })
    await TestBed.configureTestingModule({
      declarations: [TopicLevelAssessmentComponent, TopicLevelRatingComponent, AssessmentQuestionComponent, AssessmentModulesDetailsComponent, ParameterLevelRatingComponent, AssessmentAverageRatingComponent],
      providers: [{provide: AppServiceService, useClass: MockAppService},
        {provide: debounce, useValue: debouncedFunc},
        {provide: OKTA_AUTH, useValue: oktaAuth},
      ],
      imports: [MatFormFieldModule, MatCardModule, NoopAnimationsModule, FormsModule, ReactiveFormsModule, CommonModule, MatSnackBarModule,
        StoreModule.forRoot(reducers)]

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
    fixture2 = TestBed.createComponent(TopicLevelRatingComponent)
    component2 = fixture2.componentInstance;
    component = fixture.debugElement.componentInstance;

  });

  it('should create', () => {
    // @ts-ignore
    expect(component).toBeTruthy();
  });

  it('should save answers and reload the page', () => {
    component.assessmentId = 123;
    component.topicRequest = {
      parameterLevel: [{
        answerRequest: [{questionId: 1, answer: ""}],
        userQuestionRequestList:[{questionId:1,parameterId:1,question:"new",answer:"new"}],

        parameterRatingAndRecommendation: {parameterId: 0, rating: 1, parameterLevelRecommendation: [{}]}
      }], topicRatingAndRecommendation: {
        topicId: 1, rating: 3, topicLevelRecommendation: [
          {
            recommendationId: 1,
            recommendation: "some text",
            impact: "HIGH",
            effort: "LOW",
            deliveryHorizon: "some more text"
          }
        ]
      }
    }
    component.answerResponse = {
      assessmentId: 5,
      assessmentName: "abc",
      organisationName: "",
      assessmentStatus: "",
      assessmentPurpose: "",
      domain: "",
      industry: "",
      teamSize: 0,
      assessmentState: "inProgress",
      users: [],
      updatedAt: 0,
      owner:true,
      answerResponseList: [{questionId: 0, answer: "some answer"}],
      userQuestionResponseList:[{questionId:1,question:"new",answer:"new",parameterId:1}],

      topicRatingAndRecommendation: [{
        topicId: 0, rating: 1, topicLevelRecommendation: [
          {
            recommendationId: 1,
            recommendation: "some text",
            impact: "HIGH",
            effort: "LOW",
            deliveryHorizon: "some more text"
          }
        ]
      }],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, parameterLevelRecommendation: [{}]}]
    }
    component.save();
    reloadFn()
    expect(window.location.reload).toHaveBeenCalled()
  });

  it('should able to receive rating', () => {
    const topicRatingAndRecommendation = {
      rating: 2,
      recommendation: "some text",
      topicId: 1
    }

    component.topicRequest.topicRatingAndRecommendation = {rating: 2, topicId: 1, topicLevelRecommendation: []};
    expect(component.topicRequest.topicRatingAndRecommendation.rating).toEqual(2);
    expect(topicRatingAndRecommendation.rating).toEqual(2);
  })

  it('should able to get the parameter level details from the parameter structure', () => {
    parameter = {
      comments: "",
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
      userQuestions:[],
      active: false,
      updatedAt: 0,
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
      active: false, comments: "", updatedAt: 0,
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
      userQuestions: [],
      references: []
    }
    component.answerResponse = {
      assessmentId: 5,
      assessmentName: "abc",
      organisationName: "",
      assessmentPurpose: "",
      assessmentStatus: "",
      updatedAt: 0,
      domain: "",
      assessmentState: "inProgress",
      industry: "",
      teamSize: 0,
      users: [],
      owner:true,
      answerResponseList: [{questionId: 0, answer: "some answer"}],
      userQuestionResponseList:[],
      topicRatingAndRecommendation: [{
        topicId: 0, rating: 1, topicLevelRecommendation: [
          {
            recommendationId: 1,
            recommendation: "some text",
            impact: "HIGH",
            effort: "LOW",
            deliveryHorizon: "some more text"
          }
        ]
      }],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, parameterLevelRecommendation: [{}]}]
    }
    expect(component.getParameterWithRatingAndRecommendationRequest(parameter)).toBeTruthy()

  });
  it("should call topic level is the topic input is null", () => {

    component.topicInput = {
      active: false,
     updatedAt: 0,
      topicId: 0,
      topicName: "",

      parameters: [{parameterId: 0, parameterName: "", topic: 1,active: false, updatedAt:0, questions: [],userQuestions:[], references: []}],

      references: [],
      module: 1
    }
    component.answerResponse = {
      assessmentId: 5,
      assessmentName: "abc",
      organisationName: "",
      assessmentPurpose: "",
      assessmentStatus: "",
      domain: "",
      assessmentState: "inProgress",
      industry: "",
      teamSize: 0,
      users: [],
      updatedAt: 0,
      owner: true,
      answerResponseList: [{questionId: 0, answer: "some answer"}],
      topicRatingAndRecommendation: [],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, parameterLevelRecommendation: [{}]}],
      userQuestionResponseList:[]
    }
    expect(component.ngOnInit()).toBe(undefined)
  });
  it("should call parameterRequest class", () => {
    let answerRequest1: Notes[] = [{questionId: 0, answer: ""}];
    let parameterRatingAndRecommendation: ParameterRatingAndRecommendation = {
      parameterId: 0, rating: undefined, parameterLevelRecommendation: [{}]
    }
    let userQuestionRequestList: UserQuestion[] =[];
    let parameterRequest1 = new parameterRequest(answerRequest1,userQuestionRequestList, parameterRatingAndRecommendation)
    expect(parameterRequest1).toBeTruthy()
  });
  it("should get answer when parameter is passed", () => {
    component.answerResponse = {
      assessmentId: 5,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentPurpose: "Client Request",
      assessmentStatus: "Active",
      domain: "",
      industry: "",
      assessmentState: "inProgress",
      teamSize: 0,
      users: [],
      owner:true,
      updatedAt: 1654664982698,
      answerResponseList: [
        {
          questionId: 1,
          answer: "answer1"
        },],
      topicRatingAndRecommendation: [],

      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, parameterLevelRecommendation: [{}]}],
      userQuestionResponseList:[]
    }
    const dummyAnswerRequest: Notes[] = [{questionId: 1, answer: "answer1"}]
    expect(component.getAnswersList(parameter)).toStrictEqual(dummyAnswerRequest)
  });
  it("should get parameter rating and recommendation when undefined", () => {
    let dummyParameter: ParameterStructure = {
      parameterId: 1,
      parameterName: "",
      active: false,
      updatedAt: 0,
      topic: 1,
      questions: [{questionId: 1, questionText: "some text", parameter: 1}],
      references: [],
      userQuestions:[]
    }
    component.answerResponse = {
      answerResponseList: [],
      assessmentId: 0,
      assessmentName: "",
      assessmentPurpose: "",
      assessmentState: "",
      assessmentStatus: "",
      domain: "",
      industry: "",
      organisationName: "",
      parameterRatingAndRecommendation: [],
      topicRatingAndRecommendation: [],
      updatedAt: 0,
      users: [],
      userQuestionResponseList:[],
      owner: true

    }
    const dummyAnswerRequest: Notes[] = [{questionId: 1,answer:undefined}]
    let dummyUserQuestionRequestList: UserQuestionSaveRequest[] =[];

    let dummyNewParameter: ParameterRequest = {

      answerRequest: dummyAnswerRequest,
      userQuestionRequestList:dummyUserQuestionRequestList,

      parameterRatingAndRecommendation: {
        parameterId: 1, rating: 0, parameterLevelRecommendation: [{
          "deliveryHorizon": "",
          "effort": "",
          "impact": "",
          "recommendation": "",
          "recommendationId": undefined
        }]
      }
    }
    expect(component.getParameterWithRatingAndRecommendationRequest(dummyParameter)).toStrictEqual(dummyNewParameter)
  });
  it("should fetch the answers from the ngrx store", () => {
    component.answerResponse1 = of({
      assessmentId: 5,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentStatus: "Active",
      assessmentPurpose: "Client Request",
      updatedAt: 1654664982698,
      domain: "",
      assessmentState: "inProgress",
      industry: "",
      teamSize: 0,
      users: [],
      owner: true,
      answerResponseList: [
        {
          questionId: 1,
          answer: "answer1"
        }],

      topicRatingAndRecommendation: [{
        topicId: 0, rating: 1, topicLevelRecommendation: [
          {
            recommendationId: 1,
            recommendation: "some text",
            impact: "HIGH",
            effect: "LOW",
            deliveryHorizon: "some more text"
          }
        ]
      }],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, recommendation: ""}],
      userQuestionResponseList:[]
    })
    const dummyAnswerResponse = {
      assessmentId: 5,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentStatus: "Active",
      assessmentPurpose: "Client Request",
      updatedAt: 1654664982698,
      assessmentState: "inProgress",
      domain: "",
      industry: "",
      teamSize: 0,
      users: [],
      owner:true,
      answerResponseList: [
        {
          questionId: 1,
          answer: "answer1"
        }],
      topicRatingAndRecommendation: [{
        topicId: 0, rating: 1, topicLevelRecommendation: [
          {
            recommendationId: 1,
            recommendation: "some text",
            impact: "HIGH",
            effect: "LOW",
            deliveryHorizon: "some more text"
          }
        ]
      }],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, recommendation: ""}],
      userQuestionResponseList:[]
    }
    component.topicInput = {
      active: false, updatedAt: 0,
      topicId: 0,
      topicName: "dummyTopic",
      parameters: [],
      references: [],
      module: 1
    }
    component.ngOnInit()
    expect(component.answerResponse).toStrictEqual(dummyAnswerResponse)
  });
  it("should calculate average rating", () => {
    component.answerResponse = {
      assessmentId: 5,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentPurpose: "Client Request",
      assessmentStatus: "Active",
      updatedAt: 1654664982698,
      domain: "",
      assessmentState: "inProgress",
      industry: "",
      teamSize: 0,
      users: [],
      owner: true,
      answerResponseList: [
        {
          questionId: 1,
          answer: "answer1"
        }],
      topicRatingAndRecommendation: [{
        topicId: 0, rating: 1, topicLevelRecommendation: [
          {
            recommendationId: 1,
            recommendation: "some text",
            impact: "HIGH",
            effort: "LOW",
            deliveryHorizon: "some more text"
          }
        ]
      }],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, parameterLevelRecommendation: [{}]}],
      userQuestionResponseList:[]
    }
    component.topicRequest = {
      parameterLevel: [{
        answerRequest: [{questionId: 1, answer: ""}],
        userQuestionRequestList:[],
        parameterRatingAndRecommendation: {parameterId: 0, rating: 1, parameterLevelRecommendation: [{}]}
      }], topicRatingAndRecommendation: {topicId: 1, rating: 3, topicLevelRecommendation: []}
    }
    component.topicInput = {
      active: false, updatedAt: 0,
      topicId: 0,
      topicName: "",
      parameters: [{parameterId: 0, parameterName: "", topic: 1, questions: [],userQuestions:[],active:false,updatedAt:12334, references: []}],
      references: [],
      module: 1
    }
    component.ngOnInit()
  });
  it("should get answers from store", () => {
    let dummyResponse = {
      assessments: undefined
    }
    expect(fromReducer.assessmentReducer({}, {type: "[ASSESSMENT STRUCTURE] Get assessment"})).toStrictEqual(dummyResponse)
  });
  it("should dispatch data to the store", () => {
    component.topicRequest = {
      parameterLevel: [{
        answerRequest: [{questionId: 1, answer: ""}],
        userQuestionRequestList:[],

        parameterRatingAndRecommendation: {parameterId: 0, rating: 1, parameterLevelRecommendation: [{}]}
      }], topicRatingAndRecommendation: {topicId: 1, rating: 3, topicLevelRecommendation: []}
    }
    component.topicInput = {
      active: false, updatedAt: 0,
      topicId: 0,
      topicName: "",
      parameters: [{parameterId: 0, parameterName: "", topic: 1, active: false, updatedAt: 0, comments: "", questions: [], userQuestions:[],references: []}],
      references: [],
      module: 1
    }
    component.save()
    expect(component.answerResponse).toBe(undefined)
    let expectedAnswer = {
      "answerResponseList": [{"answer": "answer1", "questionId": 1}],
      "assessmentId": 5,
      "assessmentName": "abc1",
      "assessmentStatus": "Active",
      "assessments": undefined,
      "domain": "",
      "industry": "",
      "organisationName": "Thoughtworks",
      "parameterRatingAndRecommendation": [{"parameterId": 1, "rating": "2", "recommendation": ""}],
      "teamSize": 0,
      "topicRatingAndRecommendation": [{"rating": "1", "recommendation": "", "topicId": 0}],
      "updatedAt": 1654664982698,
      "users": [],
      "userQuestionResponseList":[]
    }
    expect(fromReducer.assessmentReducer(expectedAnswer, {type: "Assessment Updated data"})).toStrictEqual(expectedAnswer)
  });
  it("should handle errors", () => {
    component.save()
    let expectedErrorHandler = {errorMessage: undefined}
    expect(fromReducer.assessmentReducer({}, {type: "Error message"})).toStrictEqual(expectedErrorHandler)
  });
  it("should call paramater response when topic reference is null", () => {
    component.answerResponse1 = of({
      assessmentId: 5,
      assessmentName: "abc1",
      assessmentPurpose: "Client Request",
      organisationName: "Thoughtworks",
      assessmentStatus: "Active",
      updatedAt: 1654664982698,
      domain: "",
      assessmentState: "inProgress",
      industry: "",
      teamSize: 0,
      users: [],
      owner: true,
      answerResponseList: [
        {
          questionId: 1,
          answer: "answer1"
        }],

      topicRatingAndRecommendation: [{
        topicId: 0, rating: 1, topicLevelRecommendation: [
          {
            recommendationId: 1,
            recommendation: "some text",
            impact: "HIGH",
            effect: "LOW",
            deliveryHorizon: "some more text"
          }
        ]
      }],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, parameterLevelRecommendation: [{}]}],
      userQuestionResponseList:[]
    })
    jest.spyOn(component, "getParameterWithRatingAndRecommendationRequest")
    // @ts-ignore
    component.topicInput = {
      topicId: 1,
      topicName: "",
      parameters: [{parameterId: 1, parameterName: "hello", topic: 1,active:false,updatedAt:0,comments:"", references: [], questions: [],userQuestions:[]}],
      module: 1
    }
    component.ngOnInit()
    expect(component.getParameterWithRatingAndRecommendationRequest).toHaveBeenCalled()

  });
  it('should not able to calculate the rating when none of the rating is selected', () => {
    component.topicRequest = {
      parameterLevel: [{
        answerRequest: [{questionId: 1, answer: ""}],
        userQuestionRequestList:[],

        parameterRatingAndRecommendation: {parameterId: 0, rating: 0, parameterLevelRecommendation: [{}]}
      }], topicRatingAndRecommendation: {topicId: 1, rating: 0, topicLevelRecommendation: []}
    }
    component.topicInput = {
      active: false, updatedAt: 0,
      topicId: 2,
      topicName: "",
      parameters: [{parameterId: 0, parameterName: "", topic: 1, active: false, updatedAt: 0, comments: "", questions: [],userQuestions:[], references: []}],
      references: [],
      module: 1
    }
    component.ngOnInit();
    component.updateAverageRating();

    expect(component.averageRating.topicId).toEqual(2);
    expect(component.averageRating.rating).toEqual(0);
  })

  it('should be able to set average rating when none of the parameter rating is selected', () => {
    component.averageRating.rating = 4;
    component.averageRating.topicId = 1;
    component.topicRequest = {
      parameterLevel: [{
        answerRequest: [{questionId: 1, answer: ""}],
        userQuestionRequestList:[],
        parameterRatingAndRecommendation: {parameterId: 0, parameterLevelRecommendation: [{}]}
      }]
    }
    component.topicInput={module: 0, parameters: [], references: [], topicId: 1, topicName: "",updatedAt: 12345, active : true}
    jest.spyOn(component,'updateAverageRating')
    component.updateAverageRating();
    expect(component.averageRating.rating).toBe(0)
  })
});


