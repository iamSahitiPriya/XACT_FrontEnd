import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicLevelRecommendationComponent } from './topic-level-recommendation.component';

describe('TopicLevelRecommendationComponent', () => {
  let component: TopicLevelRecommendationComponent;
  let fixture: ComponentFixture<TopicLevelRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopicLevelRecommendationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicLevelRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
