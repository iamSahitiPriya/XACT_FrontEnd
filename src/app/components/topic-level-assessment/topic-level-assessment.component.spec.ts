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
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {AssessmentQuestionComponent} from "../assessment-question/assessment-question.component";
import {SaveRequest} from "../../types/saveRequest";
import {AssessmentModulesDetailsComponent} from "../assessment-modules-details/assessment-modules-details.component";
import {
  ParameterLevelRatingAndRecommendationComponent
} from "../parameter-level-rating-and-recommendation/parameter-level-rating-and-recommendation.component";

class MockAppService {
  saveAssessment(saveRequest: SaveRequest) {
    return of(saveRequest);
  }
}


describe('TopicLevelAssessmentComponent', () => {
  let component: TopicLevelAssessmentComponent, fixture: ComponentFixture<TopicLevelAssessmentComponent>,
    component1: AssessmentQuestionComponent, fixture1: ComponentFixture<AssessmentQuestionComponent>,
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
      declarations: [TopicLevelAssessmentComponent, TopicScoreComponent, AssessmentQuestionComponent, AssessmentModulesDetailsComponent, ParameterLevelRatingAndRecommendationComponent],
      providers: [{provide: AppServiceService, useClass: MockAppService},NgForm
      ],
      imports: [MatFormFieldModule, MatCardModule, MatDialogModule, NoopAnimationsModule, FormsModule, ReactiveFormsModule],

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
    dialog = TestBed.inject(MatDialog);
    matDialog = fixture.debugElement.injector.get(MatDialog)
    // fixture.detectChanges();
    component = fixture.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy()
  });

  it('should save answers and reload the page', () => {
    component.assessmentId = 123;
    component.save();
    reloadFn()
    expect(window.location.reload).toHaveBeenCalled()
  });


});
