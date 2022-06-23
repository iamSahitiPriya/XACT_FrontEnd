import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TopicLevelRatingAndRecommendationComponent} from './topic-level-rating-and-recommendation.component';
import {MatCardModule} from "@angular/material/card";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../reducers/reducers";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatFormFieldModule} from "@angular/material/form-field";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";

describe('TopicLevelRatingAndRecommendationComponent', () => {
  let component: TopicLevelRatingAndRecommendationComponent;
  let fixture: ComponentFixture<TopicLevelRatingAndRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopicLevelRatingAndRecommendationComponent],
      imports: [MatFormFieldModule, NoopAnimationsModule, FormsModule, ReactiveFormsModule, MatInputModule, CommonModule, BrowserAnimationsModule, BrowserModule, MatSnackBarModule, MatCardModule, HttpClientTestingModule,
        StoreModule.forRoot(reducers)]
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

  // it('should able to set topic rating', () => {
  //   const topicRatingAndRecommendation = {
  //     rating: "2",
  //     recommendation: "some text",
  //     topicId: 1
  //   }
  //   jest.spyOn(component, "setRating");
  //   component.topicRatingAndRecommendation = topicRatingAndRecommendation;
  //   component.assessmentStatus = "Active"
  //   component.setRating("3")
  //   expect(topicRatingAndRecommendation.rating).toEqual("3");
  // });
  // it("should deselect rating", () => {
  //   const topicRatingAndRecommendation = {
  //     rating: "3",
  //     recommendation: "some text",
  //     topicId: 1
  //   }
  //   jest.spyOn(component, "setRating");
  //   component.topicRatingAndRecommendation = topicRatingAndRecommendation;
  //   component.assessmentStatus = "Active"
  //   component.setRating("3")
  //   expect(topicRatingAndRecommendation.rating).toEqual(undefined);
  // });
});
