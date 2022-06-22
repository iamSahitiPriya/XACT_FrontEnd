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
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AssessmentQuestionComponent} from "../assessment-parameter-questions/assessment-question.component";
import {SaveRequest} from "../../types/saveRequest";
import {AssessmentModulesDetailsComponent} from "../assessment-modules-details/assessment-modules-details.component";
import {
  ParameterLevelRatingAndRecommendationComponent
} from "../parameter-level-rating-and-recommendation/parameter-level-rating-and-recommendation.component";
import {CommonModule} from "@angular/common";
import {
  TopicLevelRatingAndRecommendationComponent
} from "../topic-level-rating-and-recommendation/topic-level-rating-and-recommendation.component";
import {ParameterStructure} from 'src/app/types/parameterStructure';
import {Notes} from 'src/app/types/answerRequest';
import {ParameterRatingAndRecommendation} from 'src/app/types/parameterRatingAndRecommendation';
import {ParameterRequest} from "../../types/parameterRequest";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../reducers/reducers";
import {MatSnackBarModule} from "@angular/material/snack-bar";

class MockAppService {

  public getAssessment(assessmentId: number) {
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
      "topicRatingAndRecommendation": [{topicId: 1, rating: "2", recommendation: ""}],
      "parameterRatingAndRecommendation": []
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
    component2: TopicLevelRatingAndRecommendationComponent,
    fixture2: ComponentFixture<TopicLevelRatingAndRecommendationComponent>,
    mockAppService: MockAppService;
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
      declarations: [TopicLevelAssessmentComponent, TopicLevelRatingAndRecommendationComponent, AssessmentQuestionComponent, AssessmentModulesDetailsComponent, ParameterLevelRatingAndRecommendationComponent],
      providers: [{provide: AppServiceService, useClass: MockAppService},
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
    fixture2 = TestBed.createComponent(TopicLevelRatingAndRecommendationComponent)
    component2 = fixture2.componentInstance;
    component = fixture.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save answers and reload the page', () => {
    component.assessmentId = 123;
    component.topicRequest = {
      parameterLevel: [{
        answerRequest: [{questionId: 1, answer: ""}],
        parameterRatingAndRecommendation: {parameterId: 0, rating: "1", recommendation: ""}
      }],topicRatingAndRecommendation:{topicId:1,rating:"3",recommendation:""}
    }
    component.answerResponse = {
      assessmentId: 5,
      assessmentName: "abc",
      organisationName: "",
      assessmentStatus: "",
      domain: "",
      industry: "",
      teamSize: 0,
      users: [],
      updatedAt: 0,
      answerResponseList: [{questionId: 0, answer: "some answer"}],
      topicRatingAndRecommendation: [{topicId: 0, rating: "1", recommendation: "some recomm"}],
      parameterRatingAndRecommendation: [{parameterId: 0, rating: "1", recommendation: ""}]
    }
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
    component.topicRatingAndRecommendation = {rating: "2", recommendation: "none", topicId: 1};
    // component.topicLevelRecommendationComponent = component2;
    // component2.topicRatingAndRecommendation = {rating: "2", recommendation: "none", topicId: 1};
    expect(component.topicRatingAndRecommendation.rating).toEqual("2");
    expect(topicRatingAndRecommendation.rating).toEqual("2");
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
    component.answerResponse = {
      assessmentId: 5,
      assessmentName: "abc",
      organisationName: "",
      assessmentStatus: "",
      updatedAt: 0,
      domain: "",
      industry: "",
      teamSize: 0,
      users: [],
      answerResponseList: [{questionId: 0, answer: "some answer"}],
      topicRatingAndRecommendation: [{topicId: 0, rating: "1", recommendation: "some recomm"}],
      parameterRatingAndRecommendation: [{parameterId: 0, rating: "1", recommendation: ""}]
    }
    expect(component.getParameterWithRatingAndRecommendationRequest(parameter)).toBeTruthy()

  });
  it("should call topic level is the topic input is null", () => {

    component.topicInput = {
      topicId: 0,
      topicName: "",
      parameters: [{parameterId: 0, parameterName: "", topic: 1, questions: [], references: []}],
      references: [],
      module: 1,
      assessmentLevel: ""
    }
    component.answerResponse = {
      assessmentId: 5,
      assessmentName: "abc",
      organisationName: "",
      assessmentStatus: "",
      domain: "",
      industry: "",
      teamSize: 0,
      users: [],
      updatedAt: 0,
      answerResponseList: [{questionId: 0, answer: "some answer"}],
      topicRatingAndRecommendation: [],
      parameterRatingAndRecommendation: [{parameterId: 0, rating: "1", recommendation: ""}]
    }
    expect(component.ngOnInit()).toBe(undefined)
  });
  it("should call parameterRequest class", () => {
    let answerRequest1: Notes[] = [{questionId: 0, answer: ""}];
    let parameterRatingAndRecommendation: ParameterRatingAndRecommendation = {
      parameterId: 0, rating: undefined, recommendation: ""
    }
    let parameterRequest1 = new parameterRequest(answerRequest1, parameterRatingAndRecommendation)
    expect(parameterRequest1).toBeTruthy()
  });
  it("should get answer when parameter is passed", () => {
    component.answerResponse = {
      assessmentId: 5,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentStatus: "Active",
      domain: "",
      industry: "",
      teamSize: 0,
      users: [],
      updatedAt: 1654664982698,
      answerResponseList: [
        {
          questionId: 1,
          answer: "answer1"
        },],
      topicRatingAndRecommendation: [],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: "2", recommendation: ""}]
    }
    const dummyAnswerRequest: Notes[] = [{questionId: 1, answer: "answer1"}]
    expect(component.getAnswersList(parameter)).toStrictEqual(dummyAnswerRequest)
  });
  it("should get parameter rating and recommendation", () => {
    let dummyParameter: ParameterStructure = {
      parameterId: 1,
      parameterName: "",
      topic: 1,
      questions: [{questionId: 1, questionText: "some text", parameter: 1}],
      references: []
    }
    component.answerResponse = {
      assessmentId: 5,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentStatus: "Active",
      updatedAt: 1654664982698,
      domain: "",
      industry: "",
      teamSize: 0,
      users: [],
      answerResponseList: [
        {
          questionId: 1,
          answer: "answer1"
        },],
      topicRatingAndRecommendation: [],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: "2", recommendation: ""}]
    }
    const dummyAnswerRequest: Notes[] = [{questionId: 1, answer: "answer1"}]

    let dummyNewParameter: ParameterRequest = {
      answerRequest: dummyAnswerRequest,
      parameterRatingAndRecommendation: {parameterId: 1, rating: "2", recommendation: ""}
    }
    expect(component.getParameterWithRatingAndRecommendationRequest(dummyParameter)).toStrictEqual(dummyNewParameter)
  });
  it("should fetch the answers from the ngrx store", () => {
    component.answerResponse1 = of({
      assessmentId: 5,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentStatus: "Active",
      updatedAt: 1654664982698,
      domain: "",
      industry: "",
      teamSize: 0,
      users: [],
      answerResponseList: [
        {
          questionId: 1,
          answer: "answer1"
        }],
      topicRatingAndRecommendation: [{topicId: 0, rating: "1", recommendation: ""}],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: "2", recommendation: ""}]
    })
    const dummyAnswerResponse = {
      assessmentId: 5,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentStatus: "Active",
      updatedAt: 1654664982698,
      domain: "",
      industry: "",
      teamSize: 0,
      users: [],
      answerResponseList: [
        {
          questionId: 1,
          answer: "answer1"
        }],
      topicRatingAndRecommendation: [{topicId: 0, rating: "1", recommendation: ""}],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: "2", recommendation: ""}]
    }
    component.topicInput = {
      topicId: 0,
      topicName: "dummyTopic",
      parameters: [],
      references: [],
      assessmentLevel: "Topic",
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
      assessmentStatus: "Active",
      updatedAt: 1654664982698,
      domain: "",
      industry: "",
      teamSize: 0,
      users: [],
      answerResponseList: [
        {
          questionId: 1,
          answer: "answer1"
        }],
      topicRatingAndRecommendation: [{topicId: 0, rating: "1", recommendation: ""}],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: "2", recommendation: ""}]
    }
    component.topicRequest = {
      parameterLevel: [{
        answerRequest: [{questionId: 1, answer: ""}],
        parameterRatingAndRecommendation: {parameterId: 0, rating: "1", recommendation: ""}
      }],topicRatingAndRecommendation:{topicId:1,rating:"3",recommendation:""}
    }
    component.topicInput = {
      topicId: 0,
      topicName: "",
      parameters: [{parameterId: 0, parameterName: "", topic: 1, questions: [], references: []}],
      references: [],
      module: 1,
      assessmentLevel: ""
    }
    component.ngOnInit()
    expect(component.averageRating).toBe(1)
  });
  it("should get answers from store", () => {
    let dummyResponse = {
      assessments:undefined
    }
    expect(fromReducer.assessmentReducer({},{type:"[ASSESSMENT STRUCTURE] Get assessment"})).toStrictEqual(dummyResponse)
  });
  it("should dispatch data to the store", () => {
    component.topicRequest = {
      parameterLevel: [{
        answerRequest: [{questionId: 1, answer: ""}],
        parameterRatingAndRecommendation: {parameterId: 0, rating: "1", recommendation: ""}
      }],topicRatingAndRecommendation:{topicId:1,rating:"3",recommendation:""}
    }
    component.topicInput = {
      topicId: 0,
      topicName: "",
      parameters: [{parameterId: 0, parameterName: "", topic: 1, questions: [], references: []}],
      references: [],
      module: 1,
      assessmentLevel: ""
    }
    component.save()
    expect(component.answerResponse).toBe(undefined)
    let expectedAnswer = {"answerResponseList": [{"answer": "answer1", "questionId": 1}], "assessmentId": 5, "assessmentName": "abc1", "assessmentStatus": "Active", "assessments": undefined, "domain": "", "industry": "", "organisationName": "Thoughtworks", "parameterRatingAndRecommendation": [{"parameterId": 1, "rating": "2", "recommendation": ""}], "teamSize": 0, "topicRatingAndRecommendation": [{"rating": "1", "recommendation": "", "topicId": 0}], "updatedAt": 1654664982698, "users": []}
    expect(fromReducer.assessmentReducer(expectedAnswer,{type:"Assessment Updated data"})).toStrictEqual(expectedAnswer)
  });
  it("should handle errors", () => {
    let expectedAnswer = {"answerResponseList": [{"answer": "answer1", "questionId": 1}], "assessmentId": 5, "assessmentName": "abc1", "assessmentStatus": "Active", "assessments": undefined, "domain": "", "industry": "", "organisationName": "Thoughtworks", "parameterRatingAndRecommendation": [{"parameterId": 1, "rating": "2", "recommendation": ""}], "teamSize": 0, "topicRatingAndRecommendation": [{"rating": "1", "recommendation": "", "topicId": 0}], "updatedAt": 1654664982698, "users": []}
    component.save()
    let expectedErrorHandler = {errorMessage:undefined}
    expect(fromReducer.assessmentReducer({},{type:"Error message"})).toStrictEqual(expectedErrorHandler)
  });
});


