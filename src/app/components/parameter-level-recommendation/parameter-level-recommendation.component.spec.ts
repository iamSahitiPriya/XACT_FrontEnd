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
import {ParameterLevelRecommendationTextRequest} from "../../types/parameterLevelRecommendationTextRequest";
import {ParameterLevelRecommendation} from "../../types/parameterLevelRecommendation";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatRadioModule} from "@angular/material/radio";
import {MatOptionModule} from "@angular/material/core";
import {MatIconModule} from "@angular/material/icon";


class MockAppService {
  saveParameterRecommendation(parameterLevelRecommendationText: ParameterLevelRecommendationTextRequest) {
    if (parameterLevelRecommendationText.parameterId === 0) {
      return of(parameterLevelRecommendationText)
    } else {
      return throwError("Error!")
    }
  }

  deleteParameterRecommendation(assessmentId : number, parameterId : number, recommendationId : number) {
    if(recommendationId !== 0) {
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
    //fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should auto save parameter recommendation", async () => {
    component.parameterRecommendationResponse1 = of({
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
      parameterRatingAndRecommendation: [{
        parameterId: 0, rating: 2, parameterLevelRecommendation: [
          {
            recommendationId: 1,
            recommendation: "some text",
            impact: "HIGH",
            effect: "LOW",
            deliveryHorizon: "some more text"
          }
        ]
      }]
    })
    let parameterLevelRecommendationText = {
      assessmentId: 0, parameterId: 0, parameterLevelRecommendation: {recommendation: ""}
    };
    component.assessmentId = 1
    component.parameterId = 0
    const keyEventData = {isTrusted: true, code: 'Key'};
    const keyEvent = new KeyboardEvent('keyup', keyEventData);

    jest.spyOn(component, 'updateDataSavedStatus')
    jest.spyOn(component, 'saveParticularParameterText')
    component.parameterLevelRecommendation = {
      recommendationId: 1,
      recommendation: "some more",
      impact: undefined,
      effort: undefined,
      deliveryHorizon: undefined
    }
    component.assessmentStatus = "Active"
    component.ngOnInit()
    component.saveParticularParameterText(keyEvent);

    await new Promise((r) => setTimeout(r, 2000));

    mockAppService.saveParameterRecommendation(parameterLevelRecommendationText).subscribe(data => {
      expect(component.updateDataSavedStatus).toHaveBeenCalled()
      expect(data).toBe(parameterLevelRecommendationText)
    })
    expect(component.parameterLevelRecommendationResponse.recommendation).toBe("some more");
  });


  it("should auto save delivery horizon", async () => {
    component.parameterRecommendationResponse1 = of({
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
      parameterRatingAndRecommendation: [{
        parameterId: 1, rating: 2, parameterLevelRecommendation: [
          {
            recommendationId: 1,
            recommendation: "some text",
            impact: "HIGH",
            effect: "LOW",
            deliveryHorizon: "some more text"
          }
        ]
      }]
    })
    let parameterLevelRecommendationText = {
      assessmentId: 0, parameterId: 0, parameterLevelRecommendation: {recommendation: ""}
    };
    component.assessmentId = 1
    component.parameterId = 0

    jest.spyOn(component, 'updateDataSavedStatus')
    jest.spyOn(component, 'inputChange')
    component.parameterLevelRecommendation = {
      recommendationId: undefined,
      recommendation: "some more",
      impact: undefined,
      effort: undefined,
      deliveryHorizon: "NOW"
    }
    component.assessmentStatus = "Active"
    component.ngOnInit()
    component.inputChange();

    await new Promise((r) => setTimeout(r, 2000));

    mockAppService.saveParameterRecommendation(parameterLevelRecommendationText).subscribe(data => {
      expect(data).toBe(parameterLevelRecommendationText)
      expect(component.updateDataSavedStatus).toHaveBeenCalled()
    })
    expect(component.parameterLevelRecommendationResponse.deliveryHorizon).toBe("NOW");
  });


  it("should auto save impact change", () => {
    component.parameterRecommendationResponse1 = of({
      assessmentId: 5,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentStatus: "Active",
      assessmentState:"inProgress",
      assessmentPurpose:"Client Request",
      updatedAt: 1654664982698,
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
      parameterRatingAndRecommendation: [{
        parameterId: 1, rating: 2, parameterLevelRecommendation: [
          {
            recommendationId: 1,
            recommendation: "some text",
            impact: "HIGH",
            effect: "LOW",
            deliveryHorizon: "some more text"
          }
        ]
      }]
    })

    let parameterLevelRecommendationText: ParameterLevelRecommendationTextRequest = {
      assessmentId: 0,
      parameterId: 0,
      parameterLevelRecommendation: {
        recommendationId: 1,
        recommendation: "text",
        impact: "HIGH",
        effort: "LOW",
        deliveryHorizon: "some text"
      }
    };
    component.assessmentId = 5
    component.parameterId = 0

    jest.spyOn(component, 'updateDataSavedStatus')
    jest.spyOn(component, 'inputChange')
    component.parameterLevelRecommendation = {
      recommendationId: 1,
      recommendation: "",
      impact: "LOW",
      effort: "",
      deliveryHorizon: ""
    }
    component.ngOnInit()
    component.inputChange();

    mockAppService.saveParameterRecommendation(parameterLevelRecommendationText).subscribe(data => {
      expect(data).toBe(parameterLevelRecommendationText)
    })
    expect(component.parameterLevelRecommendationResponse.impact).toBe("LOW");
  });

  it("should auto save effort change", () => {
    component.parameterRecommendationResponse1 = of({
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
      parameterRatingAndRecommendation: [{
        parameterId: 1, rating: 2, parameterLevelRecommendation: [
          {
            recommendationId: 1,
            recommendation: "some text",
            impact: "HIGH",
            effect: "LOW",
            deliveryHorizon: "some more text"
          }
        ]
      }]
    })
    component.assessmentId = 1
    component.parameterId = 0

    let parameterLevelRecommendationText: ParameterLevelRecommendationTextRequest = {
      assessmentId: 0,
      parameterId: 0,
      parameterLevelRecommendation: {
        recommendationId: 1,
        recommendation: "text",
        impact: "HIGH",
        effort: "HIGH",
        deliveryHorizon: "some text"
      }
    };

    jest.spyOn(component, 'updateDataSavedStatus')
    jest.spyOn(component, 'inputChange')
    component.parameterLevelRecommendation = {
      recommendationId: 1,
      recommendation: "",
      impact: "LOW",
      effort: "HIGH",
      deliveryHorizon: ""
    }
    component.ngOnInit()
    component.inputChange();

    mockAppService.saveParameterRecommendation(parameterLevelRecommendationText).subscribe(data => {
      expect(data).toBe(parameterLevelRecommendationText)
    })
    expect(component.parameterLevelRecommendationResponse.effort).toBe("HIGH");
  });

  it('should able to delete recommendation template', () => {
    let recommendation = {
      recommendationId: 1,
      recommendation: "some text",
      impact: "HIGH",
      effort: "LOW",
      deliveryHorizon: "some dummy text"
    }
    let parameterArray: ParameterLevelRecommendation[];
    parameterArray = [];
    component.parameterRecommendationArray =  parameterArray;
    component.parameterRecommendationArray?.push(recommendation);

    component.ngOnInit()
    component.deleteTemplate(recommendation);
    jest.spyOn(component,"deleteRecommendationTemplate")
    component.deleteRecommendationTemplate(recommendation,0)

    expect(component.parameterRecommendationArray.length).toBe(0);
  })

  it('should throw error when not able to delete recommendation', () => {
    let recommendation = {
      recommendationId: 0,
      recommendation: "some text",
      impact: "HIGH",
      effort: "LOW",
      deliveryHorizon: "some dummy text"
    }

    component.ngOnInit()
    component.deleteTemplate(recommendation);
    jest.spyOn(component,"deleteRecommendationTemplate")
    jest.spyOn(component,"showError")
    component.deleteRecommendationTemplate(recommendation,0)

    mockAppService.deleteParameterRecommendation(1,1,0).subscribe(() => {
    }, error => {
      expect(component.showError).toHaveBeenCalled()
    })
  })

  it('should be able to enable the fields when parameter level recommendationId is defined', () => {
    let recommendationId: number | undefined;
    let value: boolean;

    recommendationId = 1
    value = component.disableFields(recommendationId);

    expect(value).toBe(false);
  })

  it('should be able to disable the fields when parameter level recommendationId is undefined', () => {
    let recommendationId: number | undefined;
    let value: boolean;

    recommendationId = undefined
    value = component.disableFields(recommendationId);

    expect(value).toBe(true);
  })

  it("should call the error whenever a problem occurs", () => {
    jest.spyOn(component, "showError")
    component.showError("Error")
    expect(component.showError).toHaveBeenCalled()

  });

  it("should throw error when problem occurs in delivery horizon", async () => {
    component.parameterRecommendationResponse1 = of({
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
      parameterRatingAndRecommendation: [{
        parameterId: 1, rating: 2, parameterLevelRecommendation: [
          {
            recommendationId: 1,
            recommendation: "some text",
            impact: "HIGH",
            effect: "LOW",
            deliveryHorizon: "some more text"
          }
        ]
      }]
    })

    let parameterLevelRecommendationText = {
      assessmentId: 5, parameterId: 1, parameterLevelRecommendation: {recommendationId: 1, deliveryHorizon: ""}
    };
    component.assessmentId = 5
    component.parameterId = 1
    const keyEventData = {isTrusted: true, code: 'Key'};
    const keyEvent = new KeyboardEvent('keyup', keyEventData);

    jest.spyOn(component, 'saveParticularParameterText')
    component.parameterLevelRecommendation = {
      recommendationId: 1,
      recommendation: "",
      impact: "",
      effort: "",
      deliveryHorizon: ""
    }
    component.ngOnInit()
    component.saveParticularParameterText(keyEvent);
    component.saveParticularParameterText(keyEvent)
    component.inputChange()

    await new Promise((r) => setTimeout(r, 2000));


    mockAppService.saveParameterRecommendation(parameterLevelRecommendationText).subscribe((data) => {
      expect(data).toBeUndefined()
    }, error => {
      expect(component.showError).toHaveBeenCalled()
      expect(error).toBe(new Error("Error!"))
    })
  });

  it('should update parameter level recommendation according to recommendation response', function () {
    component.parameterLevelRecommendationResponse = {
      assessmentId: 0,
      parameterId: 0,
      recommendationId: 1,
      recommendation: "text",
      impact: "LOW",
      effort: "HIGH",
      deliveryHorizon: "text"
    }

    component.parameterRecommendationSample = [{
      recommendationId: 1,
      recommendation: "sample text",
      impact: "LOW",
      effort: "HIGH",
      deliveryHorizon: "sample text"
    }];

    component.parameterRecommendationIndex = -1

    component.getRecommendation(component.parameterRecommendationSample, component.parameterLevelRecommendationResponse)

    if (component.parameterRecommendationSample) {
      expect(component.parameterRecommendationSample[component.parameterRecommendationIndex].recommendation).toBe("text");
    }

  });

  it("should set the parameter recommendation", () => {
    component.parameterRecommendationResponse = {
      assessmentId: 1,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentPurpose:"Client Request",
      assessmentStatus: "Active",
      updatedAt: 1654664982698,
      assessmentState:"inProgress",
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
            effort: "LOW",
            deliveryHorizon: "some more text"
          }
        ]
      }],
      parameterRatingAndRecommendation: [{
        parameterId: 0, rating: 1, parameterLevelRecommendation: [
          {
            recommendationId: 1,
            recommendation: "some text",
            impact: "HIGH",
            effort: "LOW",
            deliveryHorizon: "some more text"
          }
        ]
      }]
    }
    component.parameterRecommendation = {
      recommendationId: undefined,
      recommendation: "",
      impact: "",
      effort: "",
      deliveryHorizon: ""
    }

    component.parameterLevelRecommendationText = {
      assessmentId: 0,
      parameterId: 0,
      parameterLevelRecommendation: component.parameterRecommendation
    }

    component.parameterLevelRecommendationResponse = {
      assessmentId: 0,
      parameterId: 0,
      recommendationId: undefined,
      recommendation: "",
      impact: "",
      effort: "",
      deliveryHorizon: ""
    };

    const parameterRecommendation = {
      recommendationId: 1,
      recommendation: "some text",
      impact: "LOW",
      effort: "HIGH",
      deliveryHorizon: "text"
    }

    const keyEventData = {isTrusted: true, code: 'Key'};
    const keyEvent = new KeyboardEvent('keyup', keyEventData);

    jest.spyOn(component, "saveParticularParameterText");
    component.parameterLevelRecommendation = parameterRecommendation;
    component.assessmentStatus = "Active"
    component.assessmentId = 1
    component.parameterId = 0
    component.saveParticularParameterText(keyEvent);
    expect(component.parameterLevelRecommendation.recommendation).toEqual("some text");
    expect(component.parameterRecommendationResponse.parameterRatingAndRecommendation).toBeDefined();
  });
  it('should update topic level recommendation according to recommendation response', function () {
    component.parameterLevelRecommendationResponse = {
      assessmentId: 0,
      parameterId: 0,
      recommendationId: 1,
      recommendation: "text",
      impact: "LOW",
      effort: "HIGH",
      deliveryHorizon: "text"
    }

    component.parameterRecommendationSample = [{
      recommendationId: 2,
      recommendation: "sample text",
      impact: "LOW",
      effort: "HIGH",
      deliveryHorizon: "sample text"
    }];

    component.parameterRecommendationIndex = -1

    component.getRecommendation(component.parameterRecommendationSample, component.parameterLevelRecommendationResponse)

    expect(component.parameterRecommendationSample[1].recommendation).toBe("text");
  });

});
