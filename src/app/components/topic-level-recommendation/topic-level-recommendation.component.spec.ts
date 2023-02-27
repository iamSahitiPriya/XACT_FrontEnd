/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TopicLevelRecommendationComponent} from './topic-level-recommendation.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatInputModule} from "@angular/material/input";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatCardModule} from "@angular/material/card";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../reducers/reducers";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {of, throwError} from "rxjs";
import {TopicLevelRecommendation} from "../../types/topicLevelRecommendation";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatRadioModule} from "@angular/material/radio";
import {MatOptionModule} from "@angular/material/core";
import {MatIconModule} from "@angular/material/icon";
import {HttpClientModule} from "@angular/common/http";


class MockAppService {
  saveTopicRecommendation(assessmentId : number, topicId : number, topicLevelRecommendation: TopicLevelRecommendation) {
    if (topicLevelRecommendation.recommendationId === -1) {
      topicLevelRecommendation.recommendationId = 1;
      return of(topicLevelRecommendation)
    } else {
      return throwError("Error!")
    }
  }

  deleteTopicRecommendation(assessmentId: number, topicId: number, recommendationId: number) {
    if (recommendationId !== 0)
      return of(true)
    else
      return throwError("Error!")
  }
}

describe('RecommendationComponent', () => {
  let component: TopicLevelRecommendationComponent;
  let fixture: ComponentFixture<TopicLevelRecommendationComponent>;
  let mockAppService: MockAppService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopicLevelRecommendationComponent],
      imports: [MatFormFieldModule, MatOptionModule, MatInputModule, NoopAnimationsModule,  MatInputModule, MatSnackBarModule, MatCardModule, MatTooltipModule, HttpClientModule, MatRadioModule, MatIconModule,
        StoreModule.forRoot(reducers)],
      providers: [{provide: AppServiceService, useClass: MockAppService}]
    })
      .compileComponents();
  });

  beforeEach(() => {
    mockAppService = new MockAppService()
    fixture = TestBed.createComponent(TopicLevelRecommendationComponent);
    component = fixture.componentInstance;

    component.assessmentData = of({
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
        topicId: 1, rating: 1, topicLevelRecommendation: [
          {
            recommendationId: 1,
            recommendation: "some text",
            impact: "HIGH",
            effect: "LOW",
            deliveryHorizon: "NOW"
          }
        ]
      }],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, recommendation: ""}],
      userQuestionResponseList: []
    })
    component.assessmentId = 1
    component.topicId = 1
    component.recommendation = {
      recommendationId: 2,
      recommendation: "text",
      impact: "LOW",
      effort: "HIGH",
      deliveryHorizon: "text"
    }

    component.topicRecommendations = [{
      recommendationId: 2,
      recommendation: "new recommendation",
      impact: "MEDIUM",
      effort: "MEDIUM",
      deliveryHorizon: "NEXT"
    }]

    component.cloneTopicRecommendations = [{
      recommendationId: 1,
      recommendation: "sample text",
      impact: "LOW",
      effort: "HIGH",
      deliveryHorizon: "sample text"
    }];
  });
  it('should create', () => {
    component.ngOnInit()
    expect(component).toBeTruthy();
  });

  it("should auto save recommendation", async () => {
    component.ngOnInit()

    component.recommendation.recommendationId = -1
    jest.spyOn(component,"sendRecommendation")

    component.saveTopicRecommendation()
    await new Promise((r) => setTimeout(r, 800));

    expect(component.isSaving).toBeFalsy();
    expect(component.sendRecommendation).toHaveBeenCalled()
    expect(component.cloneTopicRecommendations?.length).toBe(1)
  });

  it("should save recommendation in new topic", async () => {
    component.ngOnInit()
    component.topicId = 5
    component.recommendation.recommendationId = -1
    jest.spyOn(component,"sendRecommendation")
    component.saveTopicRecommendation()
    await new Promise((r) => setTimeout(r, 800));

    expect(component.isSaving).toBeFalsy();
    expect(component.sendRecommendation).toHaveBeenCalled()
    expect(component.cloneAssessmentData.topicRatingAndRecommendation.length).toBe(2)
  });


  it("should throw error when there is a problem while saving recommendation", async () => {
    component.recommendation.recommendationId = 1
    jest.spyOn(component, "showError")
    component.saveTopicRecommendation()
    await new Promise((r) => setTimeout(r, 800));

    expect(component.showError).toHaveBeenCalled()
  });

  it('should able to delete recommendation template', () => {
    let recommendation = {recommendationId: 1}
    let topicArray : TopicLevelRecommendation[]= [];
    component.topicId = 0;

    component.topicRecommendations = topicArray;
    component.topicRecommendations?.push(recommendation);

    component.ngOnInit()
    component.deleteRecommendation(recommendation)

    expect(component.topicRecommendations.length).toBe(0);
  })

  it('should not delete recommendation and throw error', () => {
    let recommendation = {recommendationId: 0}
    component.topicRecommendations = [recommendation]

    component.ngOnInit()
    jest.spyOn(component, 'deleteRecommendation')
    jest.spyOn(component, 'showError')

    component.deleteRecommendation(recommendation);

    expect(component.showError).toHaveBeenCalled()
  })

  it('should be able to enable the fields when recommendationId is defined', () => {
    let recommendationId = 1
    let value = component.disableFields(recommendationId);

    expect(value).toBe(false);
  })

  it('should be able to disable the fields when recommendationId is undefined', () => {
    let recommendationId = undefined
    let value = component.disableFields(recommendationId);

    expect(value).toBe(true);
  })

  it("should call the error whenever a problem occurs", () => {
    jest.spyOn(component, "showError")
    component.showError("Error")
    expect(component.showError).toHaveBeenCalled()

  });

  it('should update topic level recommendation according to recommendation response', function () {
    component.recommendation = {
      recommendationId: 1,
      recommendation: "text",
      impact: "LOW",
      effort: "HIGH",
      deliveryHorizon: "text"
    }

    component.setRecommendation(component.cloneTopicRecommendations, component.recommendation)

    if (component.cloneTopicRecommendations) {
      expect(component.cloneTopicRecommendations[0].recommendation).toBe("text");
    }
  });

  it('should save new topic level recommendation to the array', () => {
    component.recommendation.recommendationId = 2
    component.setRecommendation(component.cloneTopicRecommendations, component.recommendation)

    // @ts-ignore
    expect(component.cloneTopicRecommendations[1].recommendation).toBe("sample text");

  });

  it("should set user email when other user is working on the particular recommendation", () => {
    component.activityRecords = [{identifier:1,activityType:"TOPIC_RECOMMENDATION",inputText:"some text",email:"abc@thoughtworks.com",fullName:"abc"}]
    component.recommendation = {recommendationId:1,recommendation:"hello"}

    component.ngOnChanges()

    expect(component.latestActivityRecord.email).toBe("abc@thoughtworks.com")
    expect(component.recommendation.recommendation).toBe("some text")
  })

  it("should empty user email when the record is empty", () => {
    component.activityRecords = []

    component.ngOnChanges()

    expect(component.latestActivityRecord.email.length).toBe(0)
  })

  it("should return true when the activity is already present in the array", () => {
    component.latestActivityRecord  = {identifier:1,activityType:"recommendation",inputText:"abc",email:"abc@thoughtworks.com",fullName:"abc"}
    component.recommendation = {recommendationId :1,recommendation:"text"}

    expect(component.isActivityFound()).toBeTruthy()
  });
});
