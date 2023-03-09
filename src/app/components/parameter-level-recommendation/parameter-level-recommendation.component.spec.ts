/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ParameterLevelRecommendationComponent} from './parameter-level-recommendation.component';
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
import {ParameterLevelRecommendation} from "../../types/parameterLevelRecommendation";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatRadioModule} from "@angular/material/radio";
import {MatOptionModule} from "@angular/material/core";
import {MatIconModule} from "@angular/material/icon";


class MockAppService {
  saveParameterRecommendation(assessmentId : number, parameterId : number,parameterLevelRecommendation: ParameterLevelRecommendation) {
    if (parameterLevelRecommendation.recommendationId === -1) {
      parameterLevelRecommendation.recommendationId = 1
      return of(parameterLevelRecommendation)
    } else {
      return throwError("Error!")
    }
  }

  deleteParameterRecommendation(assessmentId: number, parameterId: number, recommendationId: number) {
    if (recommendationId !== 0) {
      return of(true)
    }
    return throwError("Error")
  }
}

describe('ParameterRecommendationComponent', () => {
  let component: ParameterLevelRecommendationComponent;
  let fixture: ComponentFixture<ParameterLevelRecommendationComponent>;
  let mockAppService: MockAppService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParameterLevelRecommendationComponent],
      imports: [MatFormFieldModule, MatOptionModule, NoopAnimationsModule, FormsModule, ReactiveFormsModule, MatInputModule, CommonModule, BrowserModule, MatSnackBarModule, MatCardModule, MatTooltipModule, HttpClientTestingModule, MatRadioModule, MatIconModule,
        StoreModule.forRoot(reducers)],
      providers: [{provide: AppServiceService, useClass: MockAppService}]
    })
      .compileComponents();
  });

  beforeEach(() => {
    mockAppService = new MockAppService()
    fixture = TestBed.createComponent(ParameterLevelRecommendationComponent);
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
        topicId: 0, rating: 1, topicLevelRecommendation: [
          {
            recommendationId: 1,
            recommendationText: "some text",
            impact: "HIGH",
            effect: "LOW",
            deliveryHorizon: "some more text"
          }
        ]
      }],
      parameterRatingAndRecommendation: [{
        parameterId: 0, rating: 2, parameterLevelRecommendation: [
          {
            recommendationId: 1,
            recommendationText: "some text",
            impact: "HIGH",
            effect: "LOW",
            deliveryHorizon: "some more text"
          }
        ]
      }],
      userQuestionResponseList: []
    })
    component.assessmentId = 1
    component.parameterId = 0
    component.recommendation = {
      recommendationId: 2,
      recommendationText: "text",
      impact: "LOW",
      effort: "HIGH",
      deliveryHorizon: "text"
    }

    component.parameterRecommendations = [{
      recommendationId: 2,
      recommendationText: "new recommendation",
      impact: "MEDIUM",
      effort: "MEDIUM",
      deliveryHorizon: "NEXT"
    }]

    component.cloneParameterRecommendations = [{
      recommendationId: 1,
      recommendationText: "sample text",
      impact: "LOW",
      effort: "HIGH",
      deliveryHorizon: "sample text"
    }];

  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should auto save parameter recommendation", async () => {
    component.ngOnInit()

    component.recommendation.recommendationId = -1
    jest.spyOn(component, 'sendRecommendation')

    component.saveParameterRecommendation();
    await new Promise((r) => setTimeout(r, 800));

    expect(component.isSaving).toBeFalsy();
    expect(component.sendRecommendation).toHaveBeenCalled()
    expect(component.cloneParameterRecommendations?.length).toBe(1)
  });


  it("should save recommendation in new parameter", async () => {
    component.ngOnInit()
    component.parameterId = 5
    component.recommendation.recommendationId = -1
    jest.spyOn(component,"sendRecommendation")
    component.saveParameterRecommendation()
    await new Promise((r) => setTimeout(r, 800));

    expect(component.isSaving).toBeFalsy();
    expect(component.sendRecommendation).toHaveBeenCalled()
    expect(component.cloneAssessmentData.parameterRatingAndRecommendation.length).toBe(2)
  });

  it("should throw error when there is a problem while saving recommendation", async () => {
    component.recommendation.recommendationId = 1
    jest.spyOn(component, "showError")
    component.saveParameterRecommendation()
    await new Promise((r) => setTimeout(r, 800));

    expect(component.showError).toHaveBeenCalled()
  });

  it('should able to delete parameter recommendation template', () => {
    let recommendation = {recommendationId: 1}
    let parameterArray : ParameterLevelRecommendation[]= [];
    component.topicId = 0;

    component.parameterRecommendations = parameterArray;
    component.parameterRecommendations?.push(recommendation);

    component.ngOnInit()
    component.deleteRecommendation(recommendation)

    expect(component.parameterRecommendations.length).toBe(0);
  })

  it('should not delete parameter recommendation and throw error', () => {
    let recommendation = {recommendationId: 0}
    component.parameterRecommendations = [recommendation]

    component.ngOnInit()
    jest.spyOn(component, 'deleteRecommendation')
    jest.spyOn(component, 'showError')

    component.deleteRecommendation(recommendation);

    expect(component.showError).toHaveBeenCalled()
  })

  it('should be able to enable the fields when parameter recommendationId is defined', () => {
    let recommendationId = 1
    let value = component.disableFields(recommendationId);

    expect(value).toBe(false);
  })

  it('should be able to disable the fields when parameter recommendationId is undefined', () => {
    let recommendationId = undefined
    let value = component.disableFields(recommendationId);

    expect(value).toBe(true);
  })

  it("should call the error whenever a problem occurs", () => {
    jest.spyOn(component, "showError")
    component.showError("Error")
    expect(component.showError).toHaveBeenCalled()
  });

  it('should update parameter level recommendation according to recommendation response', function () {
    component.recommendation = {
      recommendationId: 1,
      recommendationText: "text",
      impact: "LOW",
      effort: "HIGH",
      deliveryHorizon: "text"
    }

    component.setRecommendation(component.cloneParameterRecommendations, component.recommendation)

    if (component.cloneParameterRecommendations) {
      expect(component.cloneParameterRecommendations[0].recommendationText).toBe("text");
    }
  });

  it('should save new parameter level recommendation to the array', () => {
    component.recommendation.recommendationId = 2
    component.setRecommendation(component.cloneParameterRecommendations, component.recommendation)

    // @ts-ignore
    expect(component.cloneParameterRecommendations[1].recommendationText).toBe("sample text");

  });

  it("should set user email when other user is working on the particular parameter recommendation", () => {
    component.activityRecord = [{identifier:1,activityType:"PARAMETER_RECOMMENDATION",inputText:"some text",email:"abc@thoughtworks.com",fullName:"abc"}]
    component.recommendation = {recommendationId:1,recommendationText:"hello"}

    component.ngOnChanges()

    expect(component.latestActivityRecord.email).toBe("abc@thoughtworks.com")
    expect(component.recommendation.recommendationText).toBe("some text")
  })

  it("should empty user email when the parameter recommendation record is empty", () => {
    component.activityRecord = []

    component.ngOnChanges()

    expect(component.latestActivityRecord.email.length).toBe(0)
  })

  it("should return true when the activity is already present in the  parameter recommendation array", () => {
    component.latestActivityRecord  = {identifier:1,activityType:"recommendation",inputText:"abc",email:"abc@thoughtworks.com",fullName:"abc"}
    component.recommendation = {recommendationId :1,recommendationText:"text"}

    expect(component.isActivityFound()).toBeTruthy()
  });

});
