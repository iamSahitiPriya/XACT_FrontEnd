/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentRecommendationComponent } from './assessment-recommendation.component';
import {MatFormFieldControl, MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

describe('AssessmentRecommendationComponent', () => {
  let component: AssessmentRecommendationComponent;
  let fixture: ComponentFixture<AssessmentRecommendationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentRecommendationComponent ],
      imports:[MatFormFieldModule,MatInputModule,NoopAnimationsModule
      ]
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
