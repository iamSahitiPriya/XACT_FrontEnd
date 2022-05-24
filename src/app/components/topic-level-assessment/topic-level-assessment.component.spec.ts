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

describe('TopicLevelAssessmentComponent', () => {
  let component: TopicLevelAssessmentComponent;
  let fixture: ComponentFixture<TopicLevelAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopicLevelAssessmentComponent, TopicScoreComponent, AssessmentRecommendationComponent],
      providers: [{provide: AppServiceService, useClass: MockAppService}],
      imports: [MatFormFieldModule, MatCardModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicLevelAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should move to next', () => {
    component.selectedIndex = 0;
    component.next();
    expect(component.selectedIndex).toEqual(1);
  });

  it('should move back selected index', () => {
    component.selectedIndex = 1
    component.previous()
    expect(component.selectedIndex).toBe(0)
    component.previous()
    expect(component.selectedIndex).toBe(0)
  });

  it('should save answers', () => {
    component.assessmentId = 123;
    component.notes = [];
    expect(component.save()).toBeTruthy();
  });


});

class MockAppService {

  saveAssessment(answerRequest: AnswerRequest) {
    return of(answerRequest);
  }
}
