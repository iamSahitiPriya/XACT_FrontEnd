/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TopicLevelRatingComponent} from './topic-level-rating.component';
import {MatCardModule} from "@angular/material/card";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../reducers/reducers";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatFormFieldModule} from "@angular/material/form-field";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {of, throwError} from "rxjs";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {TopicRating} from "../../types/topicRating";
import {MatRadioModule} from "@angular/material/radio";
import {TopicLevelRecommendationComponent} from "../topic-level-recommendation/topic-level-recommendation.component";
import {RouterTestingModule} from "@angular/router/testing";


class MockAppService {
  saveTopicRating(topicRating: TopicRating) {
    if (topicRating.topicId === 0) {
      return of(topicRating)
    } else {
      return throwError("Error!")
    }

  }
}

const answerResponse = {
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
  parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, parameterLevelRecommendation: [{}]}]
  , userQuestionResponseList: []
}

describe('TopicLevelRatingAndRecommendationComponent', () => {
  let component: TopicLevelRatingComponent, fixture: ComponentFixture<TopicLevelRatingComponent>,
    component1: TopicLevelRecommendationComponent, fixture1: ComponentFixture<TopicLevelRecommendationComponent>;

  let mockAppService: MockAppService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopicLevelRatingComponent],
      imports: [MatFormFieldModule, NoopAnimationsModule, FormsModule, ReactiveFormsModule, MatInputModule, CommonModule, BrowserModule, MatSnackBarModule, MatCardModule, HttpClientTestingModule, MatRadioModule,
        StoreModule.forRoot(reducers), RouterTestingModule],
      providers: [RouterTestingModule, {provide: AppServiceService, useClass: MockAppService}]
    })
      .compileComponents();
  });

  beforeEach(() => {
    mockAppService = new MockAppService()
    fixture = TestBed.createComponent(TopicLevelRatingComponent);
    component = fixture.componentInstance;
    fixture1 = TestBed.createComponent(TopicLevelRecommendationComponent);
    component1 = fixture1.componentInstance;

  });

  it('should create ', () => {
    expect(component).toBeTruthy();
  });

  it('should able to set topic rating', () => {
    component.answerResponse = answerResponse
    const topicRatingAndRecommendation = {
      rating: 2,
      recommendation: "some text",
      topicId: 0
    }
    jest.spyOn(component, "setRating");
    let topicRating = {
      assessmentId: 0, topicId: 0, rating: 0
    };
    component.topicRatingAndRecommendation = topicRatingAndRecommendation;
    component.topicId = 0
    component.assessmentStatus = "Active"
    component.setRating(3)
    mockAppService.saveTopicRating(topicRating).subscribe(data => {
      expect(data).toBe(topicRating)
    })
    expect(component.topicRatingAndRecommendation.rating).toEqual(3);
  });

  it("should deselect rating", () => {
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
    };
    const topicRatingAndRecommendation = {
      rating: 3,
      recommendation: "some text",
      topicId: 1
    }
    component.topicId = 1
    jest.spyOn(component, "setRating");
    component.topicRatingAndRecommendation = topicRatingAndRecommendation;
    component.assessmentStatus = "Active"
    component.setRating(3)
    expect(topicRatingAndRecommendation.rating).toEqual(undefined);
  });

  it('should able to set topic rating', () => {
    component.answerResponse1 = of({
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
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, recommendation: ""}],
      userQuestionResponseList: []
    })
    const topicRatingAndRecommendation = {
      rating: 2,
      recommendation: "some text",
      topicId: 1
    }
    component.topicId = 1
    jest.spyOn(component, "setRating");
    component.topicRatingAndRecommendation = topicRatingAndRecommendation;
    component.assessmentStatus = "Active"
    component.ngOnInit()
    component.setRating(3)
    expect(topicRatingAndRecommendation.rating).toEqual(3);
  });

  it("should able to set topic rating if it is not defined", () => {
    component.answerResponse = answerResponse
    const topicRatingAndRecommendation = {
      rating: 2,
      recommendation: "some text",
      topicId: 1
    }
    // @ts-ignore
    component.answerResponse.topicRatingAndRecommendation = undefined
    component.topicId = 1
    jest.spyOn(component, "setRating");
    component.topicRatingAndRecommendation = topicRatingAndRecommendation;
    component.assessmentStatus = "Active"
    component.setRating(3)
    expect(topicRatingAndRecommendation.rating).toEqual(3);
  });

  it("should call the error whenever a problem occurs", () => {
    jest.spyOn(component, "showError")
    component.showError("Error")
    expect(component.showError).toHaveBeenCalled()
  });
  it('should call the error whenever the problem occurs during api call', () => {
    component.answerResponse = answerResponse;
    const topicRatingAndRecommendation = {
      rating: 2,
      recommendation: "some text",
      topicId: 1
    }
    component.topicLevelRating = {
      assessmentId: 0, topicId: 0, rating: 1
    };
    jest.spyOn(component, "setRating");
    component.topicRatingAndRecommendation = topicRatingAndRecommendation;
    component.topicId = 1
    component.assessmentStatus = "Active"
    jest.spyOn(component, "showError")
    component.setRating(3)
    expect(component.showError).toHaveBeenCalled();

  });

});
