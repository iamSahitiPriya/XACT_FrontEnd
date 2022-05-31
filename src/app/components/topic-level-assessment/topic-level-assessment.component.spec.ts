/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TopicLevelAssessmentComponent} from './topic-level-assessment.component';
import {TopicScoreComponent} from "../topic-score/topic-score.component";
import {AssessmentRecommendationComponent} from "../assessment-recommendation/assessment-recommendation.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCardModule} from "@angular/material/card";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {of} from "rxjs";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AssessmentQuestionComponent} from "../assessment-question/assessment-question.component";
import {SaveRequest} from "../../types/saveRequest";
import {AssessmentModulesDetailsComponent} from "../assessment-modules-details/assessment-modules-details.component";


describe('TopicLevelAssessmentComponent', () => {
  let component: TopicLevelAssessmentComponent, fixture: ComponentFixture<TopicLevelAssessmentComponent>,
    component1: AssessmentQuestionComponent, fixture1: ComponentFixture<AssessmentQuestionComponent>,
    component2: AssessmentRecommendationComponent, fixture2: ComponentFixture<AssessmentRecommendationComponent>,
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
      declarations: [TopicLevelAssessmentComponent, TopicScoreComponent, AssessmentRecommendationComponent, AssessmentQuestionComponent, AssessmentModulesDetailsComponent],
      providers: [{provide: AppServiceService, useClass: MockAppService},
        {provide: MatDialog, useClass: MockDialog}
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
    fixture2 = TestBed.createComponent(AssessmentRecommendationComponent);
    component2 = fixture2.componentInstance;
    dialog = TestBed.inject(MatDialog);
    matDialog = fixture.debugElement.injector.get(MatDialog)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should move to next', () => {
    component.selectedIndex = 0;
    component.next(true);
    expect(component.selectedIndex).toEqual(1);
  });

  it('should move back selected index', () => {
    component.selectedIndex = 1
    component.previous(true)
    expect(component.selectedIndex).toBe(0)
  });

  // it('should save answers and reload the page', () => {
  //   component.assessmentId = 123;
  //   component.notes = [];
  //   // component.save();
  //   reloadFn()
  //   expect(window.location.reload).toHaveBeenCalled()
  // });
  it('should cancel changes', () => {
    jest.spyOn(matDialog, 'open')
    component.cancel()
    fixture.detectChanges()
    expect(matDialog.open).toHaveBeenCalled()
  });

  it('should open popup before moving to next without saving', () => {
    jest.spyOn(matDialog, 'open')
    component.next(false)
    fixture.detectChanges()
    expect(matDialog.open).toHaveBeenCalled()
  });
  it('should close the pop on clicking the cross', () => {
    jest.spyOn(matDialog, 'open')
    jest.spyOn(component1, 'handleCancel')
    jest.spyOn(component2, 'handleCancel')
    component.selectedIndex = 0

    component.next(false)

    expect(matDialog.open).toHaveBeenCalled()
    expect(component1.handleCancel).toBeTruthy()
    expect(component2.handleCancel).toBeTruthy()
    expect(component.selectedIndex).toBe(0)
  });
  it('should open popup before moving to back without saving', () => {
    jest.spyOn(matDialog, 'open')
    component.previous(false)
    fixture.detectChanges()
    expect(matDialog.open).toHaveBeenCalled()
  });
  it('should do cancel when the dialog box is closed', () => {
  });
});

class MockAppService {

  // saveAssessment(saveRequest: SaveRequest) {
  //   return of(saveRequest);
  // }
}

class MockDialog {
  open() {
    return {
      afterClosed: () =>
        of(1)

    }
  }

  closeAll() {
  }
}
