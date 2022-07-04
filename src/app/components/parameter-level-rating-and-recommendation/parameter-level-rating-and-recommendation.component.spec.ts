import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ParameterLevelRatingAndRecommendationComponent} from './parameter-level-rating-and-recommendation.component';
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
import {ParameterRecommendation} from "../../types/parameterRecommendation";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {ParameterRating} from "../../types/parameterRating";

class MockAppService {
  saveParameterRecommendation(parameterRecommendation: ParameterRecommendation) {
    return of(parameterRecommendation)

  }

  saveParameterRating(parameterRating: ParameterRating) {
    return of(parameterRating)
  }
}

describe('ParameterLevelRatingAndRecommendationComponent', () => {
  let component: ParameterLevelRatingAndRecommendationComponent;
  let fixture: ComponentFixture<ParameterLevelRatingAndRecommendationComponent>;
  let mockAppService: MockAppService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParameterLevelRatingAndRecommendationComponent],
      imports: [MatFormFieldModule, NoopAnimationsModule, FormsModule, ReactiveFormsModule, MatInputModule, CommonModule, BrowserModule, MatSnackBarModule, MatCardModule, HttpClientTestingModule,
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
    fixture = TestBed.createComponent(ParameterLevelRatingAndRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should able to set rating', () => {
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
    const parameterRatingAndRecommendation = {
      rating: "2",
      recommendation: "some text",
      parameterId: 1
    }
    jest.spyOn(component, "setRating");
    component.parameterRatingAndRecommendation = parameterRatingAndRecommendation;
    component.assessmentStatus = "Active"
    component.setRating("3")
    expect(parameterRatingAndRecommendation.rating).toEqual("3");
  });
  it("should deselect rating", () => {
    const parameterRatingAndRecommendation = {
      rating: "2",
      recommendation: "some text",
      parameterId: 1
    }
    let parameterRating = {
      assessmentId: 0, parameterId: 0, rating: ""
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
      topicRatingAndRecommendation: [{topicId: 0, rating: "1", recommendation: ""}],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: "2", recommendation: ""}]
    }
    jest.spyOn(component, "setRating");
    component.parameterRatingAndRecommendation = parameterRatingAndRecommendation;
    component.assessmentStatus = "Active"
    component.parameterRecommendation = 1
    component.setRating("2")
    mockAppService.saveParameterRating(parameterRating).subscribe(data => {
      expect(data).toBe(parameterRating)
    })
    expect(parameterRatingAndRecommendation.rating).toEqual(undefined);
  })
  it("should auto save parameter recommendation", async () => {
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
    let parameterRecommendation = {
      assessmentId: 0, parameterId: 0, recommendation: "dummy recommendation"
    };
    component.assessmentId = 1
    component.parameterRecommendation = 1
    const keyEventData = {isTrusted: true, code: 'Key'};
    const keyEvent = new KeyboardEvent('keyup', keyEventData);

    jest.spyOn(component, 'saveParticularParameterRecommendation')
    component.parameterRatingAndRecommendation = {parameterId: 1, rating: "2", recommendation: "hello"}
    component.ngOnInit()
    component.saveParticularParameterRecommendation(keyEvent);

    await new Promise((r) => setTimeout(r, 2000));

    mockAppService.saveParameterRecommendation(parameterRecommendation).subscribe(data => {
      expect(data).toBe(parameterRecommendation)
    })
    expect(component.parameterRecommendationResponse.recommendation).toBe("hello")
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
      topicRatingAndRecommendation: [{topicId: 0, rating: "1", recommendation: ""}],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: "2", recommendation: ""}]
    }
    const parameterRatingAndRecommendation = {
      rating: "2",
      recommendation: "some text",
      parameterId: 1
    }
    jest.spyOn(component, "setRating");
    component.parameterRatingAndRecommendation = parameterRatingAndRecommendation;
    component.assessmentStatus = "Active"
    component.parameterRecommendation = 1
    component.setRating("3")
    expect(parameterRatingAndRecommendation.rating).toEqual("3");
  });
  it("should set the parameter rating and recommendation", () => {
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
      parameterRatingAndRecommendation: []
    }
    // @ts-ignore
    component.answerResponse.parameterRatingAndRecommendation = undefined
    const parameterRating = {
      rating: "2",
      recommendation: "some text",
      parameterId: 1
    }
    jest.spyOn(component, "setRating");
    component.parameterRatingAndRecommendation = parameterRating;
    component.assessmentStatus = "Active"
    component.parameterRecommendation = 1
    component.setRating("3")
    expect(parameterRating.rating).toEqual("3");
    expect(component.answerResponse.parameterRatingAndRecommendation.length).toBe(1)
  });
  it("should call the error whenever a problem occurs", () => {
    jest.spyOn(component, "showError")
    component.showError("Error", "Close")
    expect(component.showError).toHaveBeenCalled()
  });
  it("should push parameter recommendation", async () => {
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
      parameterRatingAndRecommendation: []
    }
    component.parameterRecommendation = 1

    component.assessmentId = 1
    component.parameterRatingAndRecommendation = {parameterId: 1, rating: "2", recommendation: ""}
    const keyEventData = {isTrusted: true, code: 'Key'};
    const keyEvent = new KeyboardEvent('keyup', keyEventData);
    component.ngOnInit()
    component.saveParticularParameterRecommendation(keyEvent);

    await new Promise((r) => setTimeout(r, 2000));
    let parameterRecommendation = {
      assessmentId: 0, parameterId: 0, recommendation: "dummy recommendation"
    };
    mockAppService.saveParameterRecommendation(parameterRecommendation).subscribe(data => {
      expect(data).toBe(parameterRecommendation)
    })
  });
});
