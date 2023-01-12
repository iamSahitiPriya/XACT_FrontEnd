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
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {of, throwError} from "rxjs";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {AnswerRequest} from "../../types/answerRequest";


describe('AssessmentQuestionComponent', () => {
  let component: AssessmentQuestionComponent;
  let fixture: ComponentFixture<AssessmentQuestionComponent>;
  let mockAppService: MockAppService

  let debouncer: DebounceProvider

  class DebounceProvider {
    public debounce() {
      return "hello"
    }
  }

  class MockAppService {
    public saveNotes(assessmentId:number , assessmentNotes: AnswerRequest) {
      if(assessmentId != 1){
        return of(assessmentNotes)
      }
      else {
        return throwError("Error!")
      }
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssessmentQuestionComponent],

      imports: [HttpClientTestingModule, MatFormFieldModule, MatInputModule, BrowserAnimationsModule, NoopAnimationsModule, CommonModule,
        StoreModule.forRoot(reducers),
        BrowserModule, CommonModule, MatSnackBarModule, HttpClientTestingModule, FormsModule, ReactiveFormsModule],
      providers: [{provide: AppServiceService, useClass: MockAppService}]
    })
      .compileComponents();
  });

  beforeEach(() => {
    mockAppService = new MockAppService()
    fixture = TestBed.createComponent(AssessmentQuestionComponent);
    component = fixture.componentInstance;
    debouncer = new DebounceProvider()
    fixture.detectChanges();

  });

  it('should create', () => {
    component.answerInput = "My answer"
    fixture.detectChanges();
    //expect(fixture.nativeElement.querySelector("#assessmentAnswer123").innerText).toBe("My answer");
  });
  it('should auto save the data whenever the value is changes for Default questions', async () => {
    component.assessmentId = 5
    component.answerResponse1 = of({
      assessmentId: 0,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentState: "inProgress",
      assessmentStatus: "Active",
      assessmentPurpose: "Client Request",
      updatedAt: 1654664982698,
      domain: "",
      industry: "",
      teamSize: 0,
      users: [],
      owner:true,
      answerResponseList: [
        {
          questionId: 1,
          answer: "answer1"
        }],
      topicRatingAndRecommendation: [{
        topicId: 0, rating: 1, topicLevelRecommendation: [
          {
            recommendationId: 1,
            recommendation: "some text",
            impact: "HIGH",
            effect: "LOW",
            deliveryHorizon: "some more text"
          }
        ]
      }],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, recommendation: ""}],
      userQuestionResponseList:[]
    })
    component.answerInput ="hello"

    const keyEventData = {isTrusted: true, code: 'KeyA'};
    const keyEvent = new KeyboardEvent('keyup', keyEventData);
    jest.spyOn(component, 'saveParticularAnswer')
    component.ngOnInit()
    component.saveParticularAnswer(keyEvent);
    let assessmentNotes: AnswerRequest = {
      questionId: 1, answer:"" , type: "DEFAULT"
    };
    await new Promise((r) => setTimeout(r, 2000));

    mockAppService.saveNotes(2,assessmentNotes).subscribe(data => {
      expect(data).toBe(assessmentNotes)
    })
    expect(component.answerRequest.answer).toBe("hello")
  });

  it('should auto save the data whenever the value is changes for Additional questions', async () => {
    component.assessmentId = 5
    component.answerResponse1 = of({
      assessmentId: 0,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentState: "inProgress",
      assessmentStatus: "Active",
      assessmentPurpose: "Client Request",
      updatedAt: 1654664982698,
      domain: "",
      industry: "",
      teamSize: 0,
      users: [],
      owner:true,
      answerResponseList: [
        {
          questionId: 1,
          answer: "answer1"
        }],
      topicRatingAndRecommendation: [{
        topicId: 0, rating: 1, topicLevelRecommendation: [
          {
            recommendationId: 1,
            recommendation: "some text",
            impact: "HIGH",
            effect: "LOW",
            deliveryHorizon: "some more text"
          }
        ]
      }],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, recommendation: ""}],
      userQuestionResponseList:[{questionId:1,question:"new question?",parameterId:1,answer:""}]
    })
    component.answerInput ="hello"

    const keyEventData = {isTrusted: true, code: 'KeyA'};
    const keyEvent = new KeyboardEvent('keyup', keyEventData);
    jest.spyOn(component, 'saveParticularAnswer')
    component.ngOnInit()
    component.type = "ADDITIONAL"
    component.saveParticularAnswer(keyEvent);
    let assessmentNotes: AnswerRequest = {
      questionId: 1, answer:"" , type: "ADDITIONAL"
    };
    await new Promise((r) => setTimeout(r, 2000));

    mockAppService.saveNotes(2,assessmentNotes).subscribe(data => {
      expect(data).toBe(assessmentNotes)
    })
    expect(component.answerRequest.answer).toBe("hello")
  });

  it("should push answers if it is not present", async () => {
    component.assessmentId = 5
    component.answerResponse1 = of({
      assessmentId: 0,
      assessmentState: "inProgress",
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentStatus: "Active",
      assessmentPurpose: "Client Request",
      updatedAt: 1654664982698,
      domain: "",
      industry: "",
      teamSize: 0,
      users: [],
      owner:true,
      answerResponseList: [
        {
          questionId: 1,
          answer: "answer1"
        }],
      topicRatingAndRecommendation: [{
        topicId: 0, rating: 1, topicLevelRecommendation: [
          {
            recommendationId: 1,
            recommendation: "some text",
            impact: "HIGH",
            effect: "LOW",
            deliveryHorizon: "some more text"
          }
        ]
      }],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, recommendation: ""}],
      userQuestionResponseList:[]
    })
    component.answerInput = "hello"

    const keyEventData = {isTrusted: true, code: 'KeyA'};
    const keyEvent = new KeyboardEvent('keyup', keyEventData);
    jest.spyOn(component, 'saveParticularAnswer')
    component.ngOnInit()
    component.saveParticularAnswer(keyEvent);
    let assessmentNotes: AnswerRequest = {
       questionId: 1, answer:"",type: "DEFAULT"
    };
    await new Promise((r) => setTimeout(r, 2000));

    mockAppService.saveNotes(2,assessmentNotes).subscribe(data => {
      expect(data).toBe(assessmentNotes)
    })
  });
  it("should set the answer response if it is not present", async () => {
    component.assessmentId = 5
    component.answerResponse1 = of({
      assessmentId: 0,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentPurpose: "Client Request",
      assessmentStatus: "Active",
      updatedAt: 1654664982698,
      assessmentState: "inProgress",
      domain: "",
      industry: "",
      teamSize: 0,
      users: [],
      owner:true,
      answerResponseList: [],

      topicRatingAndRecommendation: [{
        topicId: 0, rating: 1, topicLevelRecommendation: [
          {
            recommendationId: 1,
            recommendation: "some text",
            impact: "HIGH",
            effect: "LOW",
            deliveryHorizon: "some more text"
          }
        ]
      }],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, recommendation: ""}],
      userQuestionResponseList:[]
    })
    component.answerInput = "hello"
    component.questionNumber = 1;

    const keyEventData = {isTrusted: true, code: 'KeyA'};
    const keyEvent = new KeyboardEvent('keyup', keyEventData);
    jest.spyOn(component, 'saveParticularAnswer')
    component.ngOnInit()
    // @ts-ignore
    component.answerResponse.answerResponseList = undefined
    component.saveParticularAnswer(keyEvent);
    let answerRequest: AnswerRequest = {
      questionId: 0, answer: "" , type : "DEFAULT"
    };
    await new Promise((r) => setTimeout(r, 2000));

    mockAppService.saveNotes(2,answerRequest).subscribe(data => {
      expect(data).toBe(answerRequest)
      expect(component.answerResponse.answerResponseList.length).toBe(1)
    })
  });
  it("should throw error when notes cannot be saved", async () => {
    jest.spyOn(component,'showError')
    component.showError("message")
    expect(component.showError).toHaveBeenCalled()
  });

  it("should not save answer and throw error", () => {
    let answerRequest : AnswerRequest = {
     answer: "error text", questionId: 0, type: "DEFAULT"

    }
    jest.spyOn(component,'saveNotes')
    component.saveNotes(answerRequest,1)
    jest.spyOn(component,"showError")


    mockAppService.saveNotes(1,answerRequest).subscribe(data => {
        expect(data).toBeUndefined()},
      error => {
        expect(component.showError).toHaveBeenCalled()
        expect(error).toBe(new Error("Error!"))
      })
  })

  it("should show error", () => {
    const message = "Data cannot be saved"
    jest.spyOn(component, "showError")
    component.showError(message)
    expect(component.showError).toHaveBeenCalled()
  });
});
