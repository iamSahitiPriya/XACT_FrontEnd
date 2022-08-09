import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RecommendationComponent} from './recommendation.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatCardModule} from "@angular/material/card";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatRadioModule} from "@angular/material/radio";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../reducers/reducers";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {of, throwError} from "rxjs";
import {TopicLevelRecommendationTextRequest} from "../../types/topicLevelRecommendationTextRequest";
import {TopicLevelRecommendation} from "../../types/topicLevelRecommendation";


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
  deleteTopicRecommendation(topicId : number) {
    if (topicId === 0) {
      return of(true)
    } else {
      return throwError("Error!")
    }
  }

}

describe('RecommendationComponent', () => {
  let component: RecommendationComponent;
  let fixture: ComponentFixture<RecommendationComponent>;


  let mockAppService: MockAppService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendationComponent ],
      imports: [MatFormFieldModule, NoopAnimationsModule, FormsModule, ReactiveFormsModule, MatInputModule, CommonModule, BrowserModule, MatSnackBarModule, MatCardModule, HttpClientTestingModule,MatRadioModule,
        StoreModule.forRoot(reducers)],
      providers: [{provide: AppServiceService,useClass: MockAppService}]
    })
      .compileComponents();
  });


  beforeEach(() => {
    mockAppService = new MockAppService()
    fixture = TestBed.createComponent(RecommendationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should auto save  recommendation", async () => {
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
      topicRatingAndRecommendation: [{topicId: 0, rating: 1, topicLevelRecommendation :[
          {
            recommendationId:1,
            recommendation:"some text",
            impact:"HIGH",
            effect:"LOW",
            deliveryHorizon:"some more text"
          }
        ]}],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, recommendation: ""}]
    })
    let topicLevelRecommendationText = {
      assessmentId: 0,topicId: 0, topicLevelRecommendation : {recommendation : ""}
    };
    component.assessmentId = 1
    component.topicId = 1
    const keyEventData = {isTrusted: true, code: 'Key'};
    const keyEvent = new KeyboardEvent('keyup', keyEventData);

    jest.spyOn(component, 'saveParticularRecommendationText')
    component.recommendation = {recommendationId : undefined, recommendation : "some more",impact:undefined ,effort : undefined ,deliveryHorizon : undefined}
    component.assessmentStatus="Active"
    component.ngOnInit()
    component.saveParticularRecommendationText(keyEvent);

    await new Promise((r) => setTimeout(r, 2000));

    mockAppService.saveTopicRecommendationText(topicLevelRecommendationText).subscribe(data => {
      expect(data).toBe(topicLevelRecommendationText)
    })
    expect(component.topicRecommendationResponse.recommendation).toBe("some more");
  });


  it("should auto save Delivery Horizon", async () => {
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
      topicRatingAndRecommendation: [{topicId: 0, rating: 1, topicLevelRecommendation :[
          {
            recommendationId:1,
            recommendation:"some text",
            impact:"HIGH",
            effect:"LOW",
            deliveryHorizon:"some more text"
          }
        ]}],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, recommendation: ""}]
    })
    let topicLevelRecommendationText = {
      assessmentId: 0,topicId: 0, topicLevelRecommendation : {recommendationId : 1,deliveryHorizon:""}
    };
    component.assessmentId = 1
    component.topicId = 1
    const keyEventData = {isTrusted: true, code: 'Key'};
    const keyEvent = new KeyboardEvent('keyup', keyEventData);

    jest.spyOn(component, 'saveParticularRecommendationText')
    component.recommendation = {recommendationId : 1, recommendation : "some more",impact:undefined ,effort : undefined ,deliveryHorizon :"new text"}
    component.assessmentStatus="Active"
    component.ngOnInit()
    component.saveParticularRecommendationDeliveryHorizon(keyEvent);

    await new Promise((r) => setTimeout(r, 2000));

    mockAppService.saveTopicRecommendationFields(topicLevelRecommendationText).subscribe(data => {
      expect(data).toBe(topicLevelRecommendationText)
    })
    expect(component.topicRecommendationResponse.deliveryHorizon).toBe("new text");
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
      topicRatingAndRecommendation: [{topicId: 0, rating: 1, topicLevelRecommendation :[
          {
            recommendationId:1,
            recommendation:"some text",
            impact:"HIGH",
            effect:"LOW",
            deliveryHorizon:"some more text"
          }
        ]}],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, recommendation: ""}]
    })

    let topicLevelRecommendationText = {
      assessmentId: 0,topicId: 0, topicLevelRecommendation : {recommendationId : 1,deliveryHorizon:""}
    };
    component.assessmentId = 1
    component.topicId = 1
    const keyEventData = {isTrusted: true, code: 'Key'};
    const keyEvent = new KeyboardEvent('keyup', keyEventData);

    jest.spyOn(component, 'saveParticularRecommendationText')
    component.recommendation = {recommendationId : 1, recommendation : "some more",impact:undefined ,effort : undefined ,deliveryHorizon :"new text"}
    component.ngOnInit()
    component.saveParticularRecommendationDeliveryHorizon(keyEvent);

    await new Promise((r) => setTimeout(r, 2000));


    mockAppService.saveTopicRecommendationText(topicLevelRecommendationText).subscribe((data) => {
      expect(data).toBeUndefined()
    }, error => {
      expect(component.showError).toHaveBeenCalled()
      expect(error).toBe(new Error("Error!"))
    })
  });

  it('should able to delete recommendation template',()=>{
    let recommendation={
      recommendationId:1,
      recommendation:"some text",
      impact:"HIGH",
      effort:"LOW",
      deliveryHorizon:"some dummy text"
    }
    let topicArray : TopicLevelRecommendation[];
    topicArray =[];
    component.topicRecommendationArray=topicArray;
    component.topicRecommendationArray?.push(recommendation);

    component.deleteTemplate(recommendation);

    expect(component.topicRecommendationArray?.length).toBe(0);
  })

  it('should be able to enable the fields when recommendationId is defined',()=>{
    let recommendationId : number | undefined;
     let value : boolean;

     recommendationId =1,
     value = component.disableFields(recommendationId);

     expect(value).toBe(false);
  })

  it('should be able to disable the fields when recommendationId is undefined',()=>{
    let recommendationId : number | undefined;
    let value : boolean;

    recommendationId =undefined,
      value = component.disableFields(recommendationId);

    expect(value).toBe(true);
  })

  it("should call the error whenever a problem occurs", () => {
    jest.spyOn(component, "showError")
    component.showError("Error", "Close")
    expect(component.showError).toHaveBeenCalled()
  });

});
