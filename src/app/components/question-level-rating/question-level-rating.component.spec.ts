/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionLevelRatingComponent } from './question-level-rating.component';

describe('QuestionLevelRatingComponent', () => {
  let component: QuestionLevelRatingComponent;
  let fixture: ComponentFixture<QuestionLevelRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionLevelRatingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionLevelRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
