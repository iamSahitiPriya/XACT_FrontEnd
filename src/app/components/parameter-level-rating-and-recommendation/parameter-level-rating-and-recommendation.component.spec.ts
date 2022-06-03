import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ParameterLevelRatingAndRecommendationComponent} from './parameter-level-rating-and-recommendation.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {MatCardModule} from "@angular/material/card";

describe('ParameterLevelRatingAndRecommendationComponent', () => {
  let component: ParameterLevelRatingAndRecommendationComponent;
  let fixture: ComponentFixture<ParameterLevelRatingAndRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParameterLevelRatingAndRecommendationComponent],
      imports: [MatFormFieldModule, NoopAnimationsModule, FormsModule, ReactiveFormsModule, MatInputModule, CommonModule, BrowserAnimationsModule, BrowserModule, MatCardModule],
      providers: [
        NgForm
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterLevelRatingAndRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should able to set rating', () => {
    const parameterRatingAndRecommendation = {
      rating: "2",
      recommendation: "some text",
      parameterId: 1
    }
    component.parameterRatingAndRecommendation = parameterRatingAndRecommendation;
    component.parameterRatingAndRecommendation.rating = parameterRatingAndRecommendation.rating
    component.parameterRatingAndRecommendation.recommendation = parameterRatingAndRecommendation.recommendation
    component.setRating(parameterRatingAndRecommendation.rating)
    fixture.detectChanges()
    expect(component.parameterRatingAndRecommendation.rating).toEqual("2")

  });
});
