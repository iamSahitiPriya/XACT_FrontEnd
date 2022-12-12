import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAdditionalAnswerComponent } from './user-additional-answer.component';
import {AssessmentQuestionComponent} from "../assessment-parameter-questions/assessment-question.component";
import {AssessmentNotes} from "../../types/assessmentNotes";
import {of, throwError} from "rxjs";
import {UserQuestion} from "../../types/UserQuestion";
import {UserQuestionResponse} from "../../types/userQuestionResponse";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {CommonModule} from "@angular/common";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../reducers/reducers";
import {BrowserModule} from "@angular/platform-browser";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {UserAnswer} from "../../types/userAnswer";

describe('UserAdditionalAnswerComponent', () => {
  let component: UserAdditionalAnswerComponent;
  let fixture: ComponentFixture<UserAdditionalAnswerComponent>;

  let mockAppService: MockAppService

  let debouncer: DebounceProvider

  class DebounceProvider {
    public debounce() {
      return "hello"
    }
  }

  class MockAppService {
    public updateUserAnswer(userAnswer:UserAnswer,assessmentId:number) {
      if(userAnswer.questionId===1){
        return of(userAnswer)
      }
      else {
        return throwError("Error!")
      }
    }
  }


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAdditionalAnswerComponent ],
      imports: [HttpClientTestingModule, MatFormFieldModule, MatInputModule, BrowserAnimationsModule, NoopAnimationsModule, CommonModule,
        StoreModule.forRoot(reducers),
        BrowserModule, CommonModule, MatSnackBarModule, HttpClientTestingModule, FormsModule, ReactiveFormsModule],
      providers: [{provide: AppServiceService, useClass: MockAppService}]
    })
    .compileComponents();

  });
  beforeEach(() => {
    fixture = TestBed.createComponent(UserAdditionalAnswerComponent);
    component = fixture.componentInstance;
    mockAppService = new MockAppService()
    debouncer = new DebounceProvider()
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should auto save the data whenever the value is changes', async () => {
    component.assessmentId = 5
    component.questionId=1
    component.answerResponse1 = of({
      assessmentId: 0,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentState:"inProgress",
      assessmentStatus: "Active",
      assessmentPurpose:"Client Request",
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
      userQuestionResponseList:[{parameterId:1,question:"new",answer:"new",questionId:1}],
      owner:true
    })
    component.userAnswerInput = {question: "new", questionId: 1, answer: "hello"}

    const keyEventData = {isTrusted: true, code: 'KeyA'};
    const keyEvent = new KeyboardEvent('keyup', keyEventData);
    jest.spyOn(component, 'saveParticularUserAnswer')
    component.ngOnInit()
    component.saveParticularUserAnswer(keyEvent);
    let userAnswer: UserAnswer = {
      questionId: 1, answer:"hello"
    };
    let userQuestionResponse: UserQuestionResponse = {
      questionId: 1, question:"new",answer:"hello",parameterId:1

    }
    await new Promise((r) => setTimeout(r, 2000));

    mockAppService.updateUserAnswer(userAnswer,1).subscribe(data => {
      expect(data).toBe(userQuestionResponse);
    })
    expect(component.userAnswer.answer).toBe("hello")
  });

  it("should not save User Question Answer and throw error", () => {
    let userAnswer: UserAnswer = {
      questionId: 2,answer:"hello"
    };
    let userQuestionResponse: UserQuestionResponse = {
      questionId: 2, question:"new",answer:"hello",parameterId:1

    }
    jest.spyOn(component,'saveUserQuestionAnswer')
    component.saveUserQuestionAnswer(userAnswer,2,userQuestionResponse)
    jest.spyOn(component,"showError")


    mockAppService.updateUserAnswer(userAnswer,2).subscribe(data => {
        expect(data).toBeUndefined()},
      error => {
        expect(component.showError).toHaveBeenCalled()
        expect(error).toBe(new Error("Error!"))
      })
  })

  it('should update already saved question', () => {
    component.userAnswerInput={
      questionId:1,
      question:"new?",
      answer:"answer"
    }
    component.userAnswer = {
      questionId: 1,answer:"updated Answer"
    };
    let userQuestionResponse: UserQuestionResponse = {
      questionId: 2, question:"new",answer:"hello",parameterId:1
    }
    jest.spyOn(component,'saveUserQuestionAnswer')
    component.saveUserQuestionAnswer(component.userAnswer,2,userQuestionResponse)

    expect(component.userAnswer.answer).toBe("updated Answer")
  })


});
