/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {QuestionLevelRatingComponent} from './question-level-rating.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCardModule} from "@angular/material/card";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../reducers/reducers";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {of, throwError} from "rxjs";
import {AppServiceService} from "../../services/app-service/app-service.service";

class MockAppService {
  saveQuestionRating(assessmentId: number, questionId: number, rating: number | undefined) {
    if (questionId === 1 || questionId === 3) {
      return of(rating)
    } else {
      return throwError("Error!")
    }

  }
}

describe('QuestionLevelRatingComponent', () => {
  let component: QuestionLevelRatingComponent;
  let fixture: ComponentFixture<QuestionLevelRatingComponent>;
  let mockAppService: MockAppService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionLevelRatingComponent],
      imports: [MatFormFieldModule, MatCardModule, NoopAnimationsModule, FormsModule, ReactiveFormsModule, CommonModule, MatSnackBarModule, HttpClientTestingModule,
        StoreModule.forRoot(reducers)],
      providers: [
        NgForm,
        {provide: AppServiceService, useClass: MockAppService}
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(QuestionLevelRatingComponent);
    component = fixture.componentInstance;
    mockAppService = new MockAppService()
    fixture.detectChanges();
    component.masterData = of({
      assessmentId: 5,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentStatus: "Active",
      assessmentPurpose: "Client Request",
      assessmentDescription: "description",
      updatedAt: 1654664982698,
      assessmentState: "inProgress",
      domain: "",
      industry: "",
      teamSize: 0,
      users: [],
      owner: true,
      answerResponseList: [
        {
          questionId: 1,
          answer: "answer1",
          rating: 1
        }],
      topicRatingAndRecommendation: [{
        topicId: 0, rating: 1, topicLevelRecommendation: [
          {
            recommendationId: 1,
            recommendationText: "some text",
            impact: "HIGH",
            effort: "LOW",
            deliveryHorizon: "some more text"
          }
        ]
      }],
      parameterRatingAndRecommendation: [{
        parameterId: 1,
        rating: 2,
        parameterLevelRecommendation: [{}]
      }, {parameterId: 2, rating: undefined, parameterLevelRecommendation: []}],
      userQuestionResponseList: []
    })
    component.question = {
      answer: "", questionId: 1, rating: 0

    }
    component.parameters = [{
      answerRequest: [{questionId: 1, answer: "", rating: undefined}],
      userQuestionRequestList: [],
      parameterRatingAndRecommendation: {parameterId: 1, rating: 2, parameterLevelRecommendation: []}
    },
      {
        answerRequest: [{questionId: 2, answer: "", rating: 1}],
        userQuestionRequestList: [],
        parameterRatingAndRecommendation: {parameterId: 2, rating: undefined, parameterLevelRecommendation: []}
      }]
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should able to set parameter rating', () => {
    component.ngOnInit();
    jest.spyOn(component, "setRating");
    jest.spyOn(component, 'updateAverageRating')
    component.assessmentStatus = 'Active'

    component.setRating(3)
    mockAppService.saveQuestionRating(1, 1, 3).subscribe(data => {
      expect(data).toBe(component.question.rating)
    })

    expect(component.question.rating).toEqual(3);
  });

  it("should update rating", () => {
    component.ngOnInit();
    jest.spyOn(component, "setRating");
    jest.spyOn(component, 'updateAverageRating')
    component.assessmentStatus = 'Active'

    component.setRating(3)
    component.updateAverageRating();

    expect(component.question.rating).toBe(3)

  });

  it("should throw error on unsuccessful update", () => {
    component.ngOnInit();
    jest.spyOn(component,'setRating')
    jest.spyOn(component, 'showError')
    component.question = {
      answer: "", questionId: 2, rating: 0
    };

    component.setRating(3)
    expect(component.showError).toHaveBeenCalled()
  });

  it("should reset the rating", () => {
    component.ngOnInit();
    jest.spyOn(component,'setRating')
    jest.spyOn(component, 'showError')
    component.question = {
      answer: "", questionId: 2, rating: 3
    };

    component.setRating(3)

    expect(component.question.rating).toBeUndefined();
  });

  it("should set rating for newly created question", () => {
    component.ngOnInit()
    component.question = {
      answer: "", questionId: 3, rating: 2
    };

    component.setRating(3);
    expect(component.assessmentResponse.answerResponseList.length).toBe(2);

  });
  it("should set answer response for newly created question", () => {
    component.ngOnInit()
    component.question = {
      answer: "", questionId: 3, rating: 2
    };
    // @ts-ignore
    component.assessmentResponse.answerResponseList = undefined;
    component.setRating(3);

    expect(component.assessmentResponse.answerResponseList).toBeDefined()
    expect(component.assessmentResponse.answerResponseList.length).toBe(1);
  });
});
