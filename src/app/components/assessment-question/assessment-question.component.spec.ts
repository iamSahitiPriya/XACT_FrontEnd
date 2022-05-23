/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentQuestionComponent } from './assessment-question.component';

describe('AssessmentQuestionComponent', () => {
  let component: AssessmentQuestionComponent;
  let fixture: ComponentFixture<AssessmentQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentQuestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.parameterDetails = {parameterId:1,parameterName:"abc", topic:1,questions:[],references:[]}
    expect(component).toBeTruthy();
  });
});
