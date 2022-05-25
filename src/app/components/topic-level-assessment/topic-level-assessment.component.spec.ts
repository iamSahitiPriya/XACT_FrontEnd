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
import {AnswerRequest} from "../../types/answerRequest";
import {of} from "rxjs";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AssessmentQuestionComponent} from "../assessment-question/assessment-question.component";


describe('TopicLevelAssessmentComponent', () => {
  let component: TopicLevelAssessmentComponent;
  let fixture: ComponentFixture<TopicLevelAssessmentComponent>;
  let dialog: any;
  let matDialog: any
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
      declarations: [TopicLevelAssessmentComponent, TopicScoreComponent, AssessmentRecommendationComponent,AssessmentQuestionComponent],
      providers: [{provide: AppServiceService, useClass: MockAppService},
        {provide: MatDialog, useClass: MockDialog}
      ],
      imports: [MatFormFieldModule, MatCardModule,MatDialogModule, NoopAnimationsModule,FormsModule, ReactiveFormsModule],

    })
      .compileComponents();
  });
  afterAll(() => {
    Object.defineProperty(window, 'location', {configurable: true, value: original});
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicLevelAssessmentComponent);
    component = fixture.componentInstance;
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
    component.previous()
    expect(component.selectedIndex).toBe(0)
    component.previous()
    expect(component.selectedIndex).toBe(0)
  });

  it('should save answers and reload the page', () => {
    component.assessmentId = 123;
    component.notes = [];
    component.save();
    reloadFn()
    expect(window.location.reload).toHaveBeenCalled()
  });
  it('should cancel changes', () => {
    jest.spyOn(matDialog, 'open')
    component.cancel()
    fixture.detectChanges()
    expect(matDialog.open).toHaveBeenCalled()
  });

  it('should open popup before moving to next', () => {
    jest.spyOn(matDialog, 'open')
    component.next(false)
    fixture.detectChanges()
    expect(matDialog.open).toHaveBeenCalled()
  });
  it('should close the pop on clicking the cross', () => {
    jest.spyOn(matDialog,'closeAll')
    component.next(false)
    matDialog.closeAll()
    expect(matDialog.closeAll).toHaveBeenCalled()

  });
});

class MockAppService {

  saveAssessment(answerRequest: AnswerRequest) {
    return of(answerRequest);
  }
}
class MockDialog {
  open() {
    return {
      afterClosed: () => of({})
    }
  }

  closeAll() {
  }
}
