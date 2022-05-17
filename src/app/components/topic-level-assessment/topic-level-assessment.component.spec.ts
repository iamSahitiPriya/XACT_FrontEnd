import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicLevelAssessmentComponent } from './topic-level-assessment.component';

describe('TopicLevelAssessmentComponent', () => {
  let component: TopicLevelAssessmentComponent;
  let fixture: ComponentFixture<TopicLevelAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicLevelAssessmentComponent ]
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
