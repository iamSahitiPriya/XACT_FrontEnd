import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TopicLevelRatingAndRecommendationComponent} from './topic-level-rating-and-recommendation.component';
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
import {TopicRecommendation} from "../../types/topicRecommendation";
import {TopicRating} from "../../types/topicRating";
import {MatRadioModule} from "@angular/material/radio";

class MockAppService {
  saveTopicRecommendation(topicRecommendation: TopicRecommendation) {
    if (topicRecommendation.topicId === 0) {
      return of(topicRecommendation)
    } else {
      return throwError("Error!")
    }
  }

  saveTopicRating(topicRating: TopicRating) {
    return of(topicRating)
  }

}

describe('TopicLevelRatingAndRecommendationComponent', () => {
  let component: TopicLevelRatingAndRecommendationComponent;
  let fixture: ComponentFixture<TopicLevelRatingAndRecommendationComponent>;
  let mockAppService: MockAppService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopicLevelRatingAndRecommendationComponent],
      imports: [MatFormFieldModule, NoopAnimationsModule, FormsModule, ReactiveFormsModule, MatInputModule, CommonModule, BrowserModule, MatSnackBarModule, MatCardModule, HttpClientTestingModule,MatRadioModule,
        StoreModule.forRoot(reducers)],
      providers: [{provide: AppServiceService, useClass: MockAppService}]
    })
      .compileComponents();
  });

  beforeEach(() => {
    mockAppService = new MockAppService()
    fixture = TestBed.createComponent(TopicLevelRatingAndRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create ', () => {
    expect(component).toBeTruthy();
  });

  it('should able to set topic rating', () => {
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
      topicRatingAndRecommendation: [{topicId: 1, rating: "1", recommendation: ""}],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: "2", recommendation: ""}]
    }
    const topicRatingAndRecommendation = {
      rating: "2",
      recommendation: "some text",
      topicId: 2
    }
    jest.spyOn(component, "setRating");
    let topicRating = {
      assessmentId: 0, topicId: 0, rating: "0"
    };
    component.topicRatingAndRecommendation = topicRatingAndRecommendation;
    component.topicId = 2
    component.assessmentStatus = "Active"
    component.setRating("3")
    mockAppService.saveTopicRating(topicRating).subscribe(data => {
      expect(data).toBe(topicRating)
    })
    expect(topicRatingAndRecommendation.rating).toEqual("3");
  });
  it("should deselect rating", () => {
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
      topicRatingAndRecommendation: [{topicId: 1, rating: "1", recommendation: ""}],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: "2", recommendation: ""}]
    }
    const topicRatingAndRecommendation = {
      rating: "3",
      recommendation: "some text",
      topicId: 1
    }
    component.topicId = 1
    jest.spyOn(component, "setRating");
    component.topicRatingAndRecommendation = topicRatingAndRecommendation;
    component.assessmentStatus = "Active"
    component.setRating("3")
    expect(topicRatingAndRecommendation.rating).toEqual(undefined);
  });
  it("should autoSave topic recommendation", async () => {
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

    let topicRecommendation = {
      assessmentId: 0, topicId: 0, recommendation: "dummyRecommendation"
    };
    component.assessmentId = 1
    component.topicId = 1
    const keyEventData = {isTrusted: true, code: 'KeyA'};
    const keyEvent = new KeyboardEvent('keyup', keyEventData);
    component.topicRatingAndRecommendation = {topicId: 0, rating: "1", recommendation: "hello"}
    component.ngOnInit()
    component.saveParticularRecommendation(keyEvent)
    await new Promise((r) => setTimeout(r, 2000));

    mockAppService.saveTopicRecommendation(topicRecommendation).subscribe((data) => {
      expect(data).toBe(topicRecommendation)
    })

    expect(component.topicLevelRecommendation.recommendation).toStrictEqual("hello")
  });
  it('should able to set topic rating', () => {
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
      parameterRatingAndRecommendation: [{parameterId: 1, rating: "2", recommendation: ""}]
    }
    const topicRatingAndRecommendation = {
      rating: "2",
      recommendation: "some text",
      topicId: 1
    }
    component.topicId = 1
    jest.spyOn(component, "setRating");
    component.topicRatingAndRecommendation = topicRatingAndRecommendation;
    component.assessmentStatus = "Active"
    component.setRating("3")
    expect(topicRatingAndRecommendation.rating).toEqual("3");
  });
  it("should able to set topic rating if it is not defined", () => {
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
    const topicRatingAndRecommendation = {
      rating: "2",
      recommendation: "some text",
      topicId: 1
    }
    // @ts-ignore
    component.answerResponse.topicRatingAndRecommendation = undefined
    component.topicId = 1
    jest.spyOn(component, "setRating");
    component.topicRatingAndRecommendation = topicRatingAndRecommendation;
    component.assessmentStatus = "Active"
    component.setRating("3")
    expect(topicRatingAndRecommendation.rating).toEqual("3");
  });
  it("should throw error when problem occurs", async () => {
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

    let topicRecommendation = {
      assessmentId: 0, topicId: 1, recommendation: "dummyRecommendation"
    };
    component.assessmentId = 2
    component.topicId = 0
    const keyEventData = {isTrusted: true, code: 'KeyA'};
    jest.spyOn(component, "showError")
    const keyEvent = new KeyboardEvent('keyup', keyEventData);
    component.topicRatingAndRecommendation = {topicId: 0, rating: "1", recommendation: "hello"}
    component.ngOnInit()
    component.saveParticularRecommendation(keyEvent)
    await new Promise((r) => setTimeout(r, 2000));

    mockAppService.saveTopicRecommendation(topicRecommendation).subscribe((data) => {
      expect(data).toBeUndefined()
    }, error => {
      expect(component.showError).toHaveBeenCalled()
      expect(error).toBe(new Error("Error!"))
    })
  });

});
