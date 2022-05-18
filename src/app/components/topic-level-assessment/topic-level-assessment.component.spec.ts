import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicLevelAssessmentComponent } from './topic-level-assessment.component';
import {TopicScoreComponent} from "../topic-score/topic-score.component";
import {AssessmentRecommendationComponent} from "../assessment-recommendation/assessment-recommendation.component";
import {MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatCardModule} from "@angular/material/card";

describe('TopicLevelAssessmentComponent', () => {
  let component: TopicLevelAssessmentComponent;
  let fixture: ComponentFixture<TopicLevelAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicLevelAssessmentComponent,TopicScoreComponent, AssessmentRecommendationComponent],
      imports:[MatFormFieldModule, MatCardModule]
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
});
