/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AssessmentAverageRatingComponent} from './assessment-average-rating.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCardModule} from "@angular/material/card";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../reducers/reducers";
import {of} from "rxjs";


describe('AssessmentAverageRatingComponent', () => {
  let component: AssessmentAverageRatingComponent;
  let fixture: ComponentFixture<AssessmentAverageRatingComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssessmentAverageRatingComponent],

      imports: [MatFormFieldModule, MatCardModule, NoopAnimationsModule, FormsModule, ReactiveFormsModule, CommonModule, MatSnackBarModule,
        StoreModule.forRoot(reducers)]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentAverageRatingComponent);
    component = fixture.componentInstance;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should give average rating of particular topic', () => {
    component.finalAverageRating = of({
      scoreDetails: {
        topicId: 1,
        rating: 1
      }
    })
    let newAverageRating = {topicId: 1, rating: 1};
    component.averageRating =  1;

    fixture.detectChanges();
    component.finalAverageRating.subscribe(data => {
      expect(data).toBe(newAverageRating.rating)
    })
  })
});
