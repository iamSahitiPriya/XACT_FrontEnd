/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, fakeAsync, flush, TestBed, tick} from '@angular/core/testing';

import {AssessmentQuestionComponent} from './assessment-question.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatFormFieldModule} from "@angular/material/form-field";
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatInputModule} from "@angular/material/input";
import {BrowserModule, By} from "@angular/platform-browser";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../reducers/reducers";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {of} from "rxjs";
import _, {debounce} from "lodash";


describe('AssessmentQuestionComponent', () => {
  let component: AssessmentQuestionComponent;
  let fixture: ComponentFixture<AssessmentQuestionComponent>;
  let debouncer:DebounceProvider
  class DebounceProvider{
    public debounce(){
      return "hello"
    }
  }
  class MockAppService {
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssessmentQuestionComponent],

      imports: [HttpClientTestingModule,MatFormFieldModule,MatInputModule,BrowserAnimationsModule,NoopAnimationsModule,CommonModule,
        StoreModule.forRoot(reducers),
      BrowserModule, CommonModule,MatSnackBarModule,HttpClientTestingModule,FormsModule,ReactiveFormsModule],



    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentQuestionComponent);
    component = fixture.componentInstance;
    debouncer = new DebounceProvider()
    fixture.detectChanges();

  });

  it('should create', () => {
    component.initial = 1;
    component.questionDetails = {questionId: 123, questionText: 'Hello', parameter: 1234}
    component.answerInput = {questionId: 123, answer: "My answer"}
    fixture.detectChanges();
    //expect(fixture.nativeElement.querySelector("#assessmentAnswer123").innerText).toBe("My answer");
  });
  it('should auto save the data whenever the value is changes', async () => {
    component.questionDetails = {questionId: 1, questionText: 'Hello', parameter: 1}
    component.assessmentId = 1
    component.answerResponse1 = of({
      assessmentId: 5,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentStatus: "Active",
      updatedAt: 1654664982698,
      domain: "",
      industry: "",
      teamSize: 0,
      users: [],
      answerResponseList: [
        {
          questionId: 1,
          answer: "answer1"
        }],
      topicRatingAndRecommendation: [{topicId: 0, rating: "1", recommendation: ""}],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: "2", recommendation: ""}]
    })
    component.answerInput = {questionId: 1, answer: ""}

    const keyEventData = { isTrusted: true, code: 'KeyA' };
    const keyEvent = new KeyboardEvent('keyup', keyEventData);
    jest.spyOn(component, 'saveParticularAnswer')
    component.ngOnInit()
    component.saveParticularAnswer(keyEvent);

    await new Promise((r) => setTimeout(r, 2000));

    expect(component.assessmentNotes.notes).toBe("")
  });
});
