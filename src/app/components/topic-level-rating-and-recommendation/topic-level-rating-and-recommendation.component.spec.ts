import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TopicLevelRatingAndRecommendationComponent} from './topic-level-rating-and-recommendation.component';
import {MatCardModule} from "@angular/material/card";
import {StoreModule} from "@ngrx/store";
import {of} from "rxjs";
import {reducers} from "../../reducers/reducers";

describe('TopicLevelRatingAndRecommendationComponent', () => {
  let component: TopicLevelRatingAndRecommendationComponent;
  let fixture: ComponentFixture<TopicLevelRatingAndRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopicLevelRatingAndRecommendationComponent],
      imports:[MatCardModule, StoreModule.forRoot(reducers)]
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
  it("should deselect rating", () => {
    const topicRatingAndRecommendation = {
      rating: "3",
      recommendation: "some text",
      topicId: 1
    }
    jest.spyOn(component, "setRating");
    component.topicRatingAndRecommendation = topicRatingAndRecommendation;
    component.assessmentStatus = "Active"
    component.setRating("3")
    expect(topicRatingAndRecommendation.rating).toEqual(undefined);
  });
});
