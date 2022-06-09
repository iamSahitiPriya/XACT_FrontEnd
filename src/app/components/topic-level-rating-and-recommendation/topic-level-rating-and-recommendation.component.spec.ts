import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TopicLevelRatingAndRecommendationComponent} from './topic-level-rating-and-recommendation.component';

describe('TopicLevelRatingAndRecommendationComponent', () => {
  let component: TopicLevelRatingAndRecommendationComponent;
  let fixture: ComponentFixture<TopicLevelRatingAndRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopicLevelRatingAndRecommendationComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicLevelRatingAndRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create ', () => {
    expect(component).toBeTruthy();
  });

  it('should able to set topic rating', () => {
    const topicRatingAndRecommendation = {
      rating: "2",
      recommendation: "some text",
      topicId: 1
    }
    jest.spyOn(component, "setRating");
    component.topicRatingAndRecommendation = topicRatingAndRecommendation;
    component.assessmentStatus = "Active"
    component.setRating("3")
    expect(topicRatingAndRecommendation.rating).toEqual("3");
  });
});
