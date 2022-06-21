/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AssessmentQuestionComponent} from './assessment-question.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatFormFieldModule} from "@angular/material/form-field";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatInputModule} from "@angular/material/input";
import {BrowserModule} from "@angular/platform-browser";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../reducers/reducers";


describe('AssessmentQuestionComponent', () => {
  let component: AssessmentQuestionComponent;
  let fixture: ComponentFixture<AssessmentQuestionComponent>;

  class MockAppService {
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssessmentQuestionComponent],

      imports: [HttpClientTestingModule,MatFormFieldModule,MatInputModule,BrowserAnimationsModule,NoopAnimationsModule,CommonModule,
        StoreModule.forRoot(reducers),
      BrowserModule, CommonModule],


    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.initial = 1;
    component.questionDetails = {questionId: 123, questionText: 'Hello', parameter: 1234}
    component.answerInput = {questionId: 123, answer: "My answer"}
    fixture.detectChanges();
    //expect(fixture.nativeElement.querySelector("#assessmentAnswer123").innerText).toBe("My answer");
  });

});
