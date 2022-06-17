import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ParameterLevelRatingAndRecommendationComponent} from './parameter-level-rating-and-recommendation.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {MatCardModule} from "@angular/material/card";
import {StoreModule} from "@ngrx/store";

describe('ParameterLevelRatingAndRecommendationComponent', () => {
  let component: ParameterLevelRatingAndRecommendationComponent;
  let fixture: ComponentFixture<ParameterLevelRatingAndRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParameterLevelRatingAndRecommendationComponent],
      imports: [MatFormFieldModule, NoopAnimationsModule, FormsModule, ReactiveFormsModule, MatInputModule, CommonModule, BrowserAnimationsModule, BrowserModule, MatCardModule,
      StoreModule.forRoot({})],
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
    jest.spyOn(component, "setRating");
    component.parameterRatingAndRecommendation = parameterRatingAndRecommendation;
    component.assessmentStatus = "Active"
    component.setRating("3")
    expect(parameterRatingAndRecommendation.rating).toEqual("3");
  });
});
