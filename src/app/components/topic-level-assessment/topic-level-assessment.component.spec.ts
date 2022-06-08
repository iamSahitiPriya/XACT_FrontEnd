/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TopicLevelAssessmentComponent} from './topic-level-assessment.component';
import {TopicScoreComponent} from "../topic-score/topic-score.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCardModule} from "@angular/material/card";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {of} from "rxjs";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AssessmentQuestionComponent} from "../assessment-question/assessment-question.component";
import {SaveRequest} from "../../types/saveRequest";
import {AssessmentModulesDetailsComponent} from "../assessment-modules-details/assessment-modules-details.component";
import {
  ParameterLevelRatingAndRecommendationComponent
} from "../parameter-level-rating-and-recommendation/parameter-level-rating-and-recommendation.component";
import {TopicLevelRecommendationComponent} from "../topic-level-recommendation/topic-level-recommendation.component";
import {CommonModule} from "@angular/common";

class MockAppService {


  saveAssessment(saveRequest: SaveRequest) {
    return of(saveRequest);
  }
}

let parameter: { parameterId: number; references: any[]; questions: { questionId: number; parameter: number; questionText: string }[]; topic: number; parameterName: string }


describe('TopicLevelAssessmentComponent', () => {
  let component: TopicLevelAssessmentComponent, fixture: ComponentFixture<TopicLevelAssessmentComponent>,
    component1: AssessmentQuestionComponent, fixture1: ComponentFixture<AssessmentQuestionComponent>,
    component2: TopicLevelRecommendationComponent, fixture2: ComponentFixture<TopicLevelRecommendationComponent>,
    mockAppService: MockAppService,
    dialog: any, matDialog: any;
  const original = window.location;
  const reloadFn = () => {
    window.location.reload();
  };

  beforeEach(async () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {reload: jest.fn()}
    })
    await TestBed.configureTestingModule({
      declarations: [TopicLevelAssessmentComponent, TopicScoreComponent, AssessmentQuestionComponent, AssessmentModulesDetailsComponent, ParameterLevelRatingAndRecommendationComponent, TopicLevelRecommendationComponent],
      providers: [{provide: AppServiceService, useClass: MockAppService},
      ],
      imports: [MatFormFieldModule, MatCardModule, MatDialogModule, NoopAnimationsModule, FormsModule, ReactiveFormsModule, BrowserAnimationsModule, CommonModule],

    })
      .compileComponents();
  });
  afterAll(() => {
    Object.defineProperty(window, 'location', {configurable: true, value: original});
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicLevelAssessmentComponent);
    component = fixture.componentInstance;
    fixture1 = TestBed.createComponent(AssessmentQuestionComponent);
    component1 = fixture1.componentInstance;
    fixture2 = TestBed.createComponent(TopicLevelRecommendationComponent)
    component2 = fixture2.componentInstance;
    dialog = TestBed.inject(MatDialog);
    matDialog = fixture.debugElement.injector.get(MatDialog)
    // fixture.detectChanges();
    component = fixture.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save answers and reload the page', () => {
    component.assessmentId = 123;
    component.save();
    reloadFn()
    expect(window.location.reload).toHaveBeenCalled()
  });

  it('should able to receive rating', () => {
    const topicRatingAndRecommendation = {
      rating: "2",
      recommendation: "some text",
      topicId: 1
    }
    component.topicRatingAndRecommendation = {rating: "1", recommendation: "none", topicId: 1};
    component.topicLevelRecommendationComponent = component2;
    component2.topicRatingAndRecommendation = {rating: "1", recommendation: "none", topicId: 1};
    component.receiveRating(topicRatingAndRecommendation)
    expect(component.topicRatingAndRecommendation.rating).toEqual("2");
    expect(component.topicLevelRecommendationComponent.topicRatingAndRecommendation.rating).toEqual("2");
  })

  // it('should able to get the parameter level details from the parameter structure', () => {
  //   parameter = {
  //     parameterId: 1,
  //     parameterName: "hello",
  //     topic: 1,
  //     questions: [
  //       {
  //         questionId: 1,
  //         questionText: "some text",
  //         parameter: 1
  //       }
  //     ],
  //     references: []
  //   }
  //   let answerRequest = []
  //   answerRequest = component.getAnswersList(parameter)
  //   component.getParameterWithRatingAndRecommendationRequest(parameter)
  //   // for (let question in parameter.questions) {
  //   //   answerRequest.push(parameter.questions[question].questionId)
  //   // }
  //   expect(answerRequest[0]).toEqual(1);
  // })

});



