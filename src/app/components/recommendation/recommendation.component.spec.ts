import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendationComponent } from './recommendation.component';
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

class MockAppService {
  saveTopicRecommendationText(topicLevelRecommendationRequest: TopicLevelRecommendationTextRequest) {
    if (topicLevelRecommendationRequest.topicId === 0) {
      return of(topicLevelRecommendationRequest)
    } else {
      return throwError("Error!")
    }
  }

}

describe('RecommendationComponent', () => {
  let component: RecommendationComponent;
  let fixture: ComponentFixture<RecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendationComponent ],
      imports: [MatFormFieldModule, NoopAnimationsModule, FormsModule, ReactiveFormsModule, MatInputModule, CommonModule, BrowserModule, MatSnackBarModule, MatCardModule, HttpClientTestingModule,MatRadioModule,
        StoreModule.forRoot(reducers)],
      providers: [{provide: AppServiceService}]
    })
      .compileComponents();
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendationComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // it("should autoSave topic recommendation", async () => {
  //   component.answerResponse1 = of({
  //     assessmentId: 5,
  //     assessmentName: "abc1",
  //     organisationName: "Thoughtworks",
  //     assessmentStatus: "Active",
  //     updatedAt: 1654664982698,
  //     domain: "",
  //     industry: "",
  //     teamSize: 0,
  //     users: [],
  //     answerResponseList: [
  //       {
  //         questionId: 1,
  //         answer: "answer1"
  //       }],
  //     topicRatingAndRecommendation: [{topicId: 0, rating: 1, topicLevelRecommendation :[
  //         {
  //           recommendationId:1,
  //           recommendation:"some text",
  //           impact:"HIGH",
  //           effort:"LOW",
  //           deliveryHorizon:"some more text"
  //         }
  //       ]}],
  //     parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, recommendation: ""}]
  //   })
  //
  //   let topicRecommendation = {
  //     assessmentId: 0, topicId: 0, recommendation: "dummyRecommendation"
  //   };
  //   component.assessmentId = 1
  //   component.topicId = 1
  //   const keyEventData = {isTrusted: true, code: 'KeyA'};
  //   const keyEvent = new KeyboardEvent('keyup', keyEventData);
  //   component.recommendation :{}
  //   component.ngOnInit()
  //   component.saveParticularRecommendation(keyEvent)
  //   await new Promise((r) => setTimeout(r, 2000));
  //
  //   mockAppService.saveTopicRecommendation(topicRecommendation).subscribe((data) => {
  //     expect(data).toBe(topicRecommendation)
  //   })
  //
  //   expect(component.recommendationSample.recommendation).toStrictEqual("");
  // });
});
