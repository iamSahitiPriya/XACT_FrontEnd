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
import {of} from "rxjs";
import {ParameterRecommendation} from "../../types/parameterRecommendation";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {ParameterRating} from "../../types/parameterRating";
import {MatTooltipModule} from "@angular/material/tooltip";

class MockAppService {
  saveParameterRecommendation(parameterRecommendation: ParameterRecommendation) {
    return of(parameterRecommendation)

  }

  saveParameterRating(parameterRating: ParameterRating) {
    return of(parameterRating)
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
      topicRatingAndRecommendation: [{topicId: 0, rating: 1, topicLevelRecommendation: [{}]}],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, parameterLevelRecommendation: [{}]}]
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
      topicRatingAndRecommendation: [{topicId: 0, rating: 1, topicLevelRecommendation: [{}]}],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, parameterLevelRecommendation: [{}]}]
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
      topicRatingAndRecommendation: [],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, recommendation: ""}]
    })
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
      topicRatingAndRecommendation: [],
      parameterRatingAndRecommendation: []
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


  it('should able to add parameter recommendation when add template is clicked', () => {
    component.parameterRatingAndRecommendation = {
      parameterId: 0, rating: 1, parameterLevelRecommendation: [
        {
          recommendationId: undefined,
          recommendation: "some text",
          impact: "HIGH",
          effort: "LOW",
          deliveryHorizon: "some more text"
        }
      ]
    };


    jest.spyOn(component, "addTemplate");
    component.addTemplate(component.parameterRatingAndRecommendation.parameterLevelRecommendation);

    expect(component.parameterRatingAndRecommendation.parameterLevelRecommendation).toHaveLength(2);

  })

  it('should able to erase the parameter recommendation sample data when add template is clicked', () => {
    component.recommendationSample = {
      recommendationId: undefined,
      recommendation: "some text",
      impact: "HIGH",
      effort: "LOW",
      deliveryHorizon: "some more text"
    };

    component.parameterRatingAndRecommendation = {
      parameterId: 0, rating: 1, parameterLevelRecommendation: [
        {
          recommendationId: undefined,
          recommendation: "some text",
          impact: "HIGH",
          effort: "LOW",
          deliveryHorizon: "some more text"
        }
      ]
    };

    jest.spyOn(component, "addTemplate");
    component.addTemplate(component.parameterRatingAndRecommendation.parameterLevelRecommendation);

    expect(component.recommendationSample.recommendation).toBe("");
    expect(component.recommendationSample.deliveryHorizon).toBe("");
  });

  it("should call the error whenever a problem occurs", () => {
    jest.spyOn(component, "showError")
    component.showError("Error", "Close")
    expect(component.showError).toHaveBeenCalled()
  });
});
