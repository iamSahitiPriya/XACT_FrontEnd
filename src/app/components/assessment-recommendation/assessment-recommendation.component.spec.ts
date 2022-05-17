import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentRecommendationComponent } from './assessment-recommendation.component';

describe('AssessmentRecommendationComponent', () => {
  let component: AssessmentRecommendationComponent;
  let fixture: ComponentFixture<AssessmentRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentRecommendationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
