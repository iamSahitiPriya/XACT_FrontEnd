import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UserQuestionAnswerComponent, UserQuestionData} from './user-question-answer.component';
import {AppServiceService} from "../../services/app-service/app-service.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../reducers/reducers";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatInputModule} from "@angular/material/input";
import {BrowserModule} from "@angular/platform-browser";
import {UserQuestion} from "../../types/UserQuestion";
import {of, throwError} from "rxjs";
import {UserQuestionRequest} from "../../types/userQuestionRequest";
import {UserQuestionResponse} from "../../types/userQuestionResponse";
import {AssessmentQuestionComponent} from "../assessment-parameter-questions/assessment-question.component";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";


describe('UserQuestionAnswerComponent', () => {
  let userQuestionData:UserQuestionData
  let component: UserQuestionAnswerComponent;
  let fixture: ComponentFixture<UserQuestionAnswerComponent>;
  let userQuestionResponse: UserQuestionResponse = {
    question: "hello",
    questionId: 1,
    parameterId: 1,
    answer: ""
  }

  class MockAppService {
    public saveUserQuestion(userQuestion: UserQuestionRequest, assessmentId: number, parameterId: number) {
      if (userQuestion.question !== "new") {
        return of(userQuestionResponse)
      } else {
        return throwError("Error!")
      }
    }

    public updateUserQuestion(userQuestion: UserQuestion, assessmentId: number) {
      if (userQuestion.question === "update") {
        return of(userQuestion)
      } else {
        return throwError("Error!")
      }
    }

    public deleteUserQuestion(assessmentId: number, questionId: number) {
      if (questionId !== 1) {
        return of(true)
      } else {
        return throwError("Error!")
      }
    }
  }

  let mockAppService: MockAppService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserQuestionAnswerComponent],
      imports: [HttpClientTestingModule, MatFormFieldModule, MatInputModule, BrowserAnimationsModule, NoopAnimationsModule, CommonModule,
        StoreModule.forRoot(reducers), MatIconModule,MatTooltipModule,
        BrowserModule, CommonModule, MatSnackBarModule, HttpClientTestingModule, FormsModule, ReactiveFormsModule],
      providers: [{provide: AppServiceService, useClass: MockAppService}],
    })
      .compileComponents();


  });
  beforeEach(() => {
    fixture = TestBed.createComponent(UserQuestionAnswerComponent);
    component = fixture.componentInstance;
    mockAppService = new MockAppService()
    component.userQuestionList = [{
      questionId: 2,
      question: "hello",
      answer: "",
      parameterId: 1
    }]
    fixture.detectChanges();
    userQuestionData = {isEdit: false, userQuestion: {
        questionId: 2,
        question: "hello",
        answer: "",
        parameterId: 1
      }}

  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should be able to generate Question Template', () => {
    jest.spyOn(component, 'generateQuestion');
    const button = fixture.nativeElement.querySelector("#addQuestionBox");
    button.click();
    expect(component.generateQuestion).toBeCalled();
  })
  it('should be able to change flag for removing question', () => {
    jest.spyOn(component, 'removeQuestion');
    component.removeQuestion();
    // expect(component.).toBe(false)
  })
  it('should save User Added Question', () => {
    component.answerResponse1= of({
      assessmentId: 5,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentStatus: "Active",
      assessmentPurpose: "Client Request",
      assessmentDescription: "description",
      updatedAt: 1654664982698,
      domain: "",
      industry: "",
      assessmentState: "inProgress",
      teamSize: 0,
      users: [],
      owner: true,
      answerResponseList: [],
      topicRatingAndRecommendation: [],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, recommendation: ""}],
      userQuestionResponseList: [{questionId: 2, parameterId: 1, question: "new", answer: "answer"}]
    })
    component.userQuestionRequest = {
      question: "question?"
    }
    component.userQuestionList = [{
      questionId: 2,
      question: "hello",
      answer: "",
      parameterId: 1
    }]
    component.ngOnInit()
    component.userQuestionData.push(userQuestionData)
    let userQuestion: UserQuestionRequest = {
      question: "question?"
    }
    userQuestionData.userQuestion.questionId = -1
    component.userQuestionData.push(userQuestionData)
    component.saveQuestion(userQuestionData);

    mockAppService.saveUserQuestion(userQuestion, 2, 1).subscribe(data => {
      expect(data.question).toBe(userQuestion.question)
    })
  })
  it('should throw error when not able  to save User Added Question', () => {
    component.userQuestionRequest = {
      question: "new"
    }
    let userQuestion: UserQuestion = {
      questionId: 1,
      question: "new"
    }
    userQuestionData.userQuestion.question = 'new'
    jest.spyOn(component, 'saveQuestion')
    component.ngOnInit()
    component.saveQuestion(userQuestionData);

    jest.spyOn(component, "showError")

    mockAppService.saveUserQuestion(userQuestion, 2, 2).subscribe(data => {
        expect(data).toBeUndefined()
      },
      error => {
        expect(component.showError).toHaveBeenCalled()
        expect(error).toBe(new Error("Error!"))
      })
  })
  it('should allow user to edit the question ', () => {
    let userQuestionData :UserQuestionData  = {isEdit: false, userQuestion: {
        questionId: 2,
        question: "hello",
        answer: "",
        parameterId: 1
      }}
    jest.spyOn(component, 'editUserQuestion');
    component.editUserQuestion(userQuestionData);
  })

  it('should not be able to delete user Question and throw error', () => {
    component.deleteUserQuestion(1);
    mockAppService.deleteUserQuestion(2, 1).subscribe(data => {
        expect(data).toBeUndefined()
      },
      error => {
        expect(component.showError).toHaveBeenCalled()
        expect(error).toBe(new Error("Error!"))
      })

  })

  it('should be able to delete user Question', () => {
    jest.spyOn(component, 'deleteUserQuestion');
    component.userQuestionList = [{
      questionId: 2,
      question: "hello",
      answer: "",
      parameterId: 1
    }]
    component.answerResponse = {
      answerResponseList: [],
      assessmentId: 2,
      assessmentName: "",
      assessmentPurpose: "",
      assessmentState: "",
      assessmentStatus: "",
      assessmentDescription: "",
      domain: "",
      industry: "",
      organisationName: "",
      owner: false,
      parameterRatingAndRecommendation: [],
      topicRatingAndRecommendation: [],
      updatedAt: 0,
      userQuestionResponseList: [{questionId: 2, parameterId: 1, question: "new", answer: "answer"}],
      users: []

    }
    component.deleteUserQuestion(2);
    mockAppService.deleteUserQuestion(2, 2).subscribe(data => {
      expect(data).toBe(true)
    });
  })
  it('should be able to update the question', () => {
    jest.spyOn(component, "updateQuestion")
    let userQuestion: UserQuestionResponse = {
      questionId: 1, question: "update", parameterId: 5, answer: ""
    }

    component.answerResponse1 = of({
      answerResponseList: [],
      assessmentId: 0,
      assessmentName: "",
      assessmentPurpose: "",
      assessmentState: "",
      assessmentStatus: "",
      assessmentDescription: "",
      domain: "",
      industry: "",
      organisationName: "",
      owner: false,
      parameterRatingAndRecommendation: [],
      topicRatingAndRecommendation: [],
      updatedAt: 0,
      userQuestionResponseList: [{questionId: 1, parameterId: 1, question: "new", answer: "answer"}],
      users: []
    })
    component.ngOnInit()
    userQuestionData.userQuestion.question="update"
    userQuestionData.userQuestion.questionId = 1
    component.updateQuestion(userQuestionData);
    mockAppService.updateUserQuestion(userQuestion, 2).subscribe(data => {
      expect(data).toBe(true)
    });

  })

  it('should not be able to update user Question and throw error', () => {
    jest.spyOn(component, 'updateQuestion');
    let userQuestion: UserQuestionResponse = {
      questionId: 2, question: "new", answer: "answer", parameterId: 5
    }
    component.ngOnInit()
    component.updateQuestion(userQuestionData);
    mockAppService.updateUserQuestion(userQuestion, 1).subscribe(data => {
        expect(data).toBeUndefined()
      },
      error => {
        expect(component.showError).toHaveBeenCalled()
        expect(error).toBe(new Error("Error!"))
      })

  })
  it("should create user question array if not exist", () => {
    component.answerResponse1 = of({
      answerResponseList: [],
      assessmentId: 2,
      assessmentName: "",
      assessmentPurpose: "",
      assessmentState: "",
      assessmentStatus: "",
      assessmentDescription: "",
      domain: "",
      industry: "",
      organisationName: "",
      owner: false,
      parameterRatingAndRecommendation: [],
      topicRatingAndRecommendation: [],
      updatedAt: 0,
      userQuestionResponseList: [{questionId: 2, parameterId: 1, question: "new", answer: "answer"}],
      users: []
    })
    component.userQuestionRequest = {
      question: "question?"
    }
    component.userQuestionList = [{
      questionId: 2,
      question: "hello",
      answer: "",
      parameterId: 1
    }]
    let userQuestion: UserQuestionRequest = {
      question: "question?"
    }
    component.ngOnInit()
    // @ts-ignore
    component.answerResponse.userQuestionResponseList = undefined
    component.saveQuestion(userQuestionData);

    mockAppService.saveUserQuestion(userQuestion, 2, 1).subscribe(data => {
      expect(data.question).toBe(userQuestion.question)
    })
  });
  it("should toggle accordian", () => {

    const newEvent = new MouseEvent('dxcontextmenu', {bubbles: true})

    component.changeAccordionState(newEvent);

    expect(component.showAccordion).toBeFalsy()

  });


});
