/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ParameterLevelRatingComponent} from './parameter-level-rating.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {MatCardModule} from "@angular/material/card";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../reducers/reducers";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {of, throwError} from "rxjs";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {ParameterRating} from "../../types/parameterRating";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ParameterLevelRecommendation} from "../../types/parameterLevelRecommendation";

class MockAppService {
  saveParameterRecommendation(parameterRecommendation: ParameterLevelRecommendation) {
    return of(parameterRecommendation)

  }

  saveParameterRating(parameterRating: ParameterRating) {
    if (parameterRating.parameterId === 1) {
      return of(parameterRating)
    } else {
      return throwError("Error!")
    }

  }
}

describe('ParameterLevelRatingAndRecommendationComponent', () => {
  let component: ParameterLevelRatingComponent;
  let fixture: ComponentFixture<ParameterLevelRatingComponent>;
  let mockAppService: MockAppService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParameterLevelRatingComponent],
      imports: [MatFormFieldModule, NoopAnimationsModule, FormsModule, ReactiveFormsModule, MatInputModule, CommonModule, BrowserModule, MatSnackBarModule, MatCardModule, MatTooltipModule, HttpClientTestingModule,
        StoreModule.forRoot(reducers)],
      providers: [
        NgForm,
        {provide: AppServiceService, useClass: MockAppService}
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    mockAppService = new MockAppService()
    fixture = TestBed.createComponent(ParameterLevelRatingComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should able to set parameter rating', () => {
    component.answerResponse = {
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
          rating : 3
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
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, parameterLevelRecommendation: [{}]}],
      userQuestionResponseList: []
    }
    const parameterRatingAndRecommendation = {
      rating: 2,
      recommendation: "some text",
      parameterId: 2
    }
    jest.spyOn(component, "setRating");
    let parameterRating = {
      assessmentId: 0, parameterId: 0, rating: 0
    };
    component.parameterRatingAndRecommendation = parameterRatingAndRecommendation;
    component.assessmentStatus = "Active"
    component.setRating(3)
    expect(parameterRatingAndRecommendation.rating).toEqual(3);
  });
  it("should deselect rating", () => {
    const parameterRatingAndRecommendation = {
      rating: 2,
      recommendation: "some text",
      parameterId: 1
    }
    let parameterRating = {
      assessmentId: 0, parameterId: 0
    };
    component.answerResponse = {
      assessmentId: 5,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentPurpose: "Client Request",
      assessmentDescription: "description",
      assessmentStatus: "Active",
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
          answer: "answer1"
        }],
      topicRatingAndRecommendation: [{topicId: 0, rating: 1, topicLevelRecommendation: [{}]}],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, parameterLevelRecommendation: [{}]}],
      userQuestionResponseList: []
    }
    jest.spyOn(component, "setRating");
    component.parameterRatingAndRecommendation = parameterRatingAndRecommendation;
    component.parameterId = 2
    component.assessmentStatus = "Active"
    component.setRating(3)
    mockAppService.saveParameterRating(parameterRating).subscribe(data => {
      expect(data).toBe(parameterRating)
    })
    expect(parameterRatingAndRecommendation.rating).toEqual(3);
  });

  it("should push the parameter rating if it is not present", () => {
    component.answerResponse = {
      assessmentId: 5,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentStatus: "Active",
      assessmentState: "inProgress",
      updatedAt: 1654664982698,
      assessmentPurpose: "Client Request",
      assessmentDescription: "description",
      domain: "",
      industry: "",
      teamSize: 0,
      users: [],
      owner: true,
      answerResponseList: [
        {
          questionId: 1,
          answer: "answer1"
        }],
      topicRatingAndRecommendation: [{topicId: 0, rating: 1, topicLevelRecommendation: [{}]}],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, parameterLevelRecommendation: [{}]}],
      userQuestionResponseList: []
    }
    const parameterRatingAndRecommendation = {
      rating: undefined,
      recommendation: "some text",
      parameterId: 1
    }
    component.parameterId = 1
    jest.spyOn(component, "setRating");
    component.parameterRatingAndRecommendation = parameterRatingAndRecommendation;
    component.assessmentStatus = "Active"
    expect(parameterRatingAndRecommendation.rating).toEqual(undefined);
    component.parameterId = 1
    component.setRating(3)
    expect(parameterRatingAndRecommendation.rating).toEqual(3);
  });

  it('should able to set parameter rating', () => {
    component.answerResponse1 = of({
      assessmentId: 5,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentStatus: "Active",
      assessmentPurpose: "Client Request",
      assessmentDescription: "description",
      updatedAt: 1654664982698,
      domain: "",
      industry: "",
      assessmentState: "inProgress",
      teamSize: 0,
      users: [],
      owner: true,
      answerResponseList: [
        {
          questionId: 1,
          answer: "answer1"
        }],
      topicRatingAndRecommendation: [],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, recommendation: ""}],
      userQuestionResponseList: []
    })

    component.parameterList = [{
      answerRequest: [{questionId: 0, answer: ""}],
      userQuestionRequestList: [],
      parameterRatingAndRecommendation: {parameterId: 1, rating: 2, parameterLevelRecommendation: []}
    }]
    const parameterRatingAndRecommendation = {
      rating: 2,
      recommendation: "some text",
      parameterId: 1
    }
    component.parameterId = 1
    jest.spyOn(component, "setRating");
    component.parameterRatingAndRecommendation = parameterRatingAndRecommendation;
    component.assessmentStatus = "Active"
    component.ngOnInit()
    component.setRating(3)
    expect(parameterRatingAndRecommendation.rating).toEqual(3);
  });

  it("should able to set parameter rating if it is not defined", () => {
    component.answerResponse = {
      assessmentId: 5,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentPurpose: "Client Request",
      assessmentDescription: "description",
      assessmentStatus: "Active",
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
          answer: "answer1"
        }],
      topicRatingAndRecommendation: [],
      parameterRatingAndRecommendation: [],
      userQuestionResponseList: []
    }
    const parameterRatingAndRecommendation = {
      rating: 2,
      recommendation: "some text",
      parameterId: 1
    }
    // @ts-ignore
    component.answerResponse.parameterRatingAndRecommendation = undefined
    component.parameterId = 1
    jest.spyOn(component, "setRating");
    component.parameterRatingAndRecommendation = parameterRatingAndRecommendation;
    component.assessmentStatus = "Active"
    component.setRating(3)
    expect(parameterRatingAndRecommendation.rating).toEqual(3);
  });




  it("should call the error whenever a problem occurs", () => {
    jest.spyOn(component, "showError")
    component.showError("Error")
    expect(component.showError).toHaveBeenCalled()
  });

  it('should able to set parameter rating to undefined when clicked again', () => {
    component.answerResponse1 = of({
      assessmentId: 5,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentState: "inProgress",
      assessmentStatus: "Active",
      assessmentPurpose: "Client Request",
      assessmentDescription: "description",
      updatedAt: 1654664982698,
      domain: "",
      industry: "",
      teamSize: 0,
      users: [],
      owner: true,
      answerResponseList: [
        {
          questionId: 1,
          answer: "answer1"
        }],
      topicRatingAndRecommendation: [],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, recommendation: ""}],
      userQuestionResponseList: []
    })

    component.parameterList = [{
      answerRequest: [{questionId: 0, answer: "",rating:3}],
      userQuestionRequestList: [],
      parameterRatingAndRecommendation: {parameterId: 1, rating: 2, parameterLevelRecommendation: []}
    }]
    const parameterRatingAndRecommendation = {
      rating: 2,
      recommendation: "some text",
      parameterId: 1
    }
    component.parameterId = 1
    jest.spyOn(component, "setRating");
    component.parameterRatingAndRecommendation = parameterRatingAndRecommendation;
    component.assessmentStatus = "Active"
    component.ngOnInit()
    component.setRating(2)
    expect(parameterRatingAndRecommendation.rating).toBeUndefined();
  });

  it('should throw error when an error happened in api call', () => {
    component.answerResponse1 = of({
      assessmentId: 5,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentPurpose: "Client Request",
      assessmentDescription: "description",
      assessmentStatus: "Active",
      assessmentState: "inProgress",
      updatedAt: 1654664982698,
      domain: "",
      industry: "",
      teamSize: 0,
      users: [],
      owner: true,
      answerResponseList: [
        {
          questionId: 1,
          answer: "answer1"
        }],
      topicRatingAndRecommendation: [],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, recommendation: ""}],
      userQuestionResponseList: []
    })

    component.parameterList = [{
      answerRequest: [{questionId: 0, answer: "",rating:3}],
      userQuestionRequestList: [],
      parameterRatingAndRecommendation: {parameterId: 1, rating: 2, parameterLevelRecommendation: []}
    }]
    const parameterRatingAndRecommendation = {
      rating: 2,
      recommendation: "some text",
      parameterId: 2
    }
    component.parameterId = 2
    jest.spyOn(component, "setRating");
    jest.spyOn(component, "showError");
    component.parameterRatingAndRecommendation = parameterRatingAndRecommendation;
    component.assessmentStatus = "Active"
    component.ngOnInit()
    component.setRating(2)
    expect(component.showError).toHaveBeenCalled();
  });
});
