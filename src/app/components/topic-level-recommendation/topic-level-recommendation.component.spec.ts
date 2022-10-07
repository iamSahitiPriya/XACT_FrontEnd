/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TopicLevelRecommendationComponent} from './topic-level-recommendation.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatCardModule} from "@angular/material/card";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../reducers/reducers";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {of, throwError} from "rxjs";
import {TopicLevelRecommendationTextRequest} from "../../types/topicLevelRecommendationTextRequest";
import {TopicLevelRecommendation} from "../../types/topicLevelRecommendation";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatRadioModule} from "@angular/material/radio";
import {MatOptionModule} from "@angular/material/core";
import {MatIconModule} from "@angular/material/icon";


class MockAppService {
  saveTopicRecommendationText(topicLevelRecommendationText: TopicLevelRecommendationTextRequest) {
    if (topicLevelRecommendationText.topicId === 0) {
      return of(topicLevelRecommendationText)
    } else {
      return throwError("Error!")
    }
  }

  saveTopicRecommendationFields(topicLevelRecommendationText: TopicLevelRecommendationTextRequest) {
    if (topicLevelRecommendationText.topicId === 0) {
      return of(topicLevelRecommendationText)
    } else {
      return throwError("Error!")
    }
  }

  deleteTopicRecommendation(topicId: number) {
    if (topicId === 0) {
      return of(true)
    } else {
      return throwError("Error!")
    }
  }
}

describe('RecommendationComponent', () => {
  let component: TopicLevelRecommendationComponent;
  let fixture: ComponentFixture<TopicLevelRecommendationComponent>;
  let mockAppService: MockAppService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopicLevelRecommendationComponent],
      imports: [MatFormFieldModule, MatOptionModule, MatInputModule, NoopAnimationsModule, FormsModule, ReactiveFormsModule, MatInputModule, CommonModule, BrowserModule, MatSnackBarModule, MatCardModule, MatTooltipModule, HttpClientTestingModule, MatRadioModule, MatIconModule,
        StoreModule.forRoot(reducers)],
      providers: [{provide: AppServiceService, useClass: MockAppService}]
    })
      .compileComponents();
  });

  beforeEach(() => {
    mockAppService = new MockAppService()
    fixture = TestBed.createComponent(TopicLevelRecommendationComponent);
    component = fixture.componentInstance;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should auto save  recommendation", async () => {
    component.topicRecommendationResponse1 = of({
      assessmentId: 5,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentStatus: "Active",
      updatedAt: 1654664982698,
      assessmentPurpose:"Client Request",
      domain: "",
      industry: "",
      teamSize: 0,
      assessmentState:"inProgress",
      users: [],
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
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, recommendation: ""}]
    })
    let topicLevelRecommendationText = {
      assessmentId: 0, topicId: 0, topicLevelRecommendation: {recommendation: ""}
    };
    component.assessmentId = 1
    component.topicId = 0
    const keyEventData = {isTrusted: true, code: 'Key'};
    const keyEvent = new KeyboardEvent('keyup', keyEventData);

    jest.spyOn(component, 'updateDataSavedStatus')
    jest.spyOn(component, 'saveParticularTopicRecommendationText')
    component.recommendation = {
      recommendationId: 1,
      recommendation: "some more",
      impact: undefined,
      effort: undefined,
      deliveryHorizon: undefined
    }
    component.assessmentStatus = "Active"
    component.ngOnInit()
    component.saveParticularTopicRecommendationText(keyEvent);

    await new Promise((r) => setTimeout(r, 2000));

    mockAppService.saveTopicRecommendationText(topicLevelRecommendationText).subscribe(data => {
      expect(component.updateDataSavedStatus).toHaveBeenCalled()
      expect(data).toBe(topicLevelRecommendationText)
    })
    expect(component.topicLevelRecommendationResponse.recommendation).toBe("some more");
  });


  it("should auto save delivery horizon", async () => {
    component.topicRecommendationResponse1 = of({
      assessmentId: 5,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentStatus: "Active",
      assessmentPurpose:"Client Request",
      updatedAt: 1654664982698,
      domain: "",
      industry: "",
      assessmentState:"inProgress",
      teamSize: 0,
      users: [],
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
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, recommendation: ""}]
    })
    let topicLevelRecommendationText = {
      assessmentId: 0, topicId: 0, topicLevelRecommendation: {recommendation: ""}
    };
    component.assessmentId = 1
    component.topicId = 0
    jest.spyOn(component, 'updateDataSavedStatus')
    jest.spyOn(component, 'inputChange')
    component.recommendation = {
      recommendationId: undefined,
      recommendation: "some more",
      impact: undefined,
      effort: undefined,
      deliveryHorizon: "NOW"
    }
    component.assessmentStatus = "Active"
    component.ngOnInit()
    component.inputChange();

    mockAppService.saveTopicRecommendationFields(topicLevelRecommendationText).subscribe(data => {
      expect(data).toBe(topicLevelRecommendationText)
      expect(component.updateDataSavedStatus).toHaveBeenCalled()
    })
    expect(component.topicLevelRecommendationResponse.deliveryHorizon).toBe("NOW");
  });


  it("should auto save impact change", () => {
    component.topicRecommendationResponse1 = of({
      assessmentId: 5,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentStatus: "Active",
      assessmentPurpose:"Client Request",
      updatedAt: 1654664982698,
      domain: "",
      industry: "",
      assessmentState:"inProgress",
      teamSize: 0,
      users: [],
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
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, recommendation: ""}]
    })

    let topicLevelRecommendationText: TopicLevelRecommendationTextRequest = {
      assessmentId: 0,
      topicId: 0,
      topicLevelRecommendation: {
        recommendationId: 1,
        recommendation: "text",
        impact: "HIGH",
        effort: "LOW",
        deliveryHorizon: "some text"
      }
    };
    component.assessmentId = 5
    component.topicId = 0

    jest.spyOn(component, 'updateDataSavedStatus')
    jest.spyOn(component, 'inputChange')
    component.recommendation = {recommendationId: 1, recommendation: "", impact: "LOW", effort: "", deliveryHorizon: ""}
    component.ngOnInit()
    component.inputChange();

    mockAppService.saveTopicRecommendationFields(topicLevelRecommendationText).subscribe(data => {
      expect(data).toBe(topicLevelRecommendationText)
    })
    expect(component.topicLevelRecommendationResponse.impact).toBe("LOW");
  });

  it("should auto save effort change", () => {
    component.topicRecommendationResponse1 = of({
      assessmentId: 5,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentStatus: "Active",
      updatedAt: 1654664982698,
      assessmentPurpose:"Client Request",
      domain: "",
      industry: "",
      assessmentState:"inProgress",
      teamSize: 0,
      users: [],
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
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, recommendation: ""}]
    })
    component.assessmentId = 1
    component.topicId = 0

    let topicLevelRecommendationText: TopicLevelRecommendationTextRequest = {
      assessmentId: 0,
      topicId: 0,
      topicLevelRecommendation: {
        recommendationId: 1,
        recommendation: "text",
        impact: "HIGH",
        effort: "HIGH",
        deliveryHorizon: "some text"
      }
    };

    jest.spyOn(component, 'updateDataSavedStatus')
    jest.spyOn(component, 'inputChange')
    component.recommendation = {
      recommendationId: 1,
      recommendation: "",
      impact: "LOW",
      effort: "HIGH",
      deliveryHorizon: ""
    }
    component.ngOnInit()
    component.inputChange();

    mockAppService.saveTopicRecommendationFields(topicLevelRecommendationText).subscribe(data => {
      expect(data).toBe(topicLevelRecommendationText)
    })
    expect(component.topicLevelRecommendationResponse.effort).toBe("HIGH");
  });

  it('should able to delete recommendation template', () => {
    let recommendation = {
      recommendationId: 1,
      recommendation: "some text",
      impact: "HIGH",
      effort: "LOW",
      deliveryHorizon: "some dummy text"
    }
    let topicArray: TopicLevelRecommendation[];
    topicArray = [];
    component.topicRecommendationArray = topicArray;
    component.topicRecommendationArray?.push(recommendation);

    component.deleteTemplate(recommendation);

    expect(component.topicRecommendationArray?.length).toBe(0);
  })

  it('should be able to enable the fields when recommendationId is defined', () => {
    let recommendationId: number | undefined;
    let value: boolean;

    recommendationId = 1
    value = component.disableFields(recommendationId);

    expect(value).toBe(false);
  })

  it('should be able to disable the fields when recommendationId is undefined', () => {
    let recommendationId: number | undefined;
    let value: boolean;

    recommendationId = undefined
    value = component.disableFields(recommendationId);

    expect(value).toBe(true);
  })

  it("should call the error whenever a problem occurs", () => {
    jest.spyOn(component, "showError")
    component.showError("Error", "Close")
    expect(component.showError).toHaveBeenCalled()

  });

  it("should throw error when problem occurs if undefined is sent", async () => {
    component.topicRecommendationResponse1 = of({
      assessmentId: 5,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentStatus: "Active",
      assessmentPurpose:"Client Request",
      updatedAt: 1654664982698,
      assessmentState:"inProgress",
      domain: "",
      industry: "",
      teamSize: 0,
      users: [],
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
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, recommendation: ""}]
    })

    let topicLevelRecommendationText = {
      assessmentId: 5, topicId: 1, topicLevelRecommendation: {recommendationId: 1, deliveryHorizon: ""}
    };
    component.assessmentId = 5
    component.topicId = 1
    const keyEventData = {isTrusted: true, code: 'Key'};
    const keyEvent = new KeyboardEvent('keyup', keyEventData);

    jest.spyOn(component, 'saveParticularTopicRecommendationText')
    component.recommendation = {recommendationId: 1, recommendation: "", impact: "", effort: "", deliveryHorizon: ""}
    component.ngOnInit()
    component.saveParticularTopicRecommendationText(keyEvent);
    component.saveParticularTopicRecommendationText(keyEvent)
    component.inputChange()

    await new Promise((r) => setTimeout(r, 2000));


    mockAppService.saveTopicRecommendationFields(topicLevelRecommendationText).subscribe((data) => {
      expect(data).toBeUndefined()
    }, error => {
      expect(component.showError).toHaveBeenCalled()
      expect(error).toBe(new Error("Error!"))
    })
  });

  it('should update topic level recommendation according to recommendation response', function () {
    component.topicLevelRecommendationResponse = {
      assessmentId: 0,
      topicId: 0,
      recommendationId: 1,
      recommendation: "text",
      impact: "LOW",
      effort: "HIGH",
      deliveryHorizon: "text"
    }

    component.topicRecommendationSample = [{
      recommendationId: 1,
      recommendation: "sample text",
      impact: "LOW",
      effort: "HIGH",
      deliveryHorizon: "sample text"
    }];

    component.topicRecommendationIndex = -1

    component.getRecommendation(component.topicRecommendationSample, component.topicLevelRecommendationResponse)

    if (component.topicRecommendationSample) {
      expect(component.topicRecommendationSample[component.topicRecommendationIndex].recommendation).toBe("text");
    }
  });
});
