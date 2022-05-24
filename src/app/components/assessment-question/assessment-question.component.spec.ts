/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AssessmentQuestionComponent} from './assessment-question.component';
import {AppServiceService} from "../../services/app-service/app-service.service";


describe('AssessmentQuestionComponent', () => {
  let component: AssessmentQuestionComponent;
  let fixture: ComponentFixture<AssessmentQuestionComponent>;

  class MockAppService {
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssessmentQuestionComponent]


    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.initial=1;
    component.parameterDetails = {parameterId: 1, parameterName: "abc", topic: 1, questions: [], references: []}
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(".parameter").textContent).toContain("abc");
  });
});
