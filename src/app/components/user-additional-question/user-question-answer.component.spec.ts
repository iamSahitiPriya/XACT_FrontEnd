import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UserQuestionAnswerComponent} from './user-question-answer.component';
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


describe('UserQuestionAnswerComponent', () => {
  let component: UserQuestionAnswerComponent;
  let fixture: ComponentFixture<UserQuestionAnswerComponent>;

  class MockAppService {
    public saveUserQuestion(userQuestion:UserQuestionRequest,assessmentId:number,parameterId:number) {
      if(userQuestion.question!=="new"){
        return of(userQuestion)
      }
      else {
        return throwError("Error!")
      }
    }
    public updateUserQuestion(userQuestion:UserQuestion,assessmentId:number) {
      if(userQuestion.question === "update"){
        return of(userQuestion)
      }
      else {
        return throwError("Error!")
      }
    }

    public deleteUserQuestion(assessmentId:number,questionId:number) {
      if(questionId!==1){
        return of(true)
      }
      else {
        return throwError("Error!")
      }
    }
  }

  let mockAppService: MockAppService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserQuestionAnswerComponent ],
      imports: [HttpClientTestingModule, MatFormFieldModule, MatInputModule, BrowserAnimationsModule, NoopAnimationsModule, CommonModule,
        StoreModule.forRoot(reducers),
        BrowserModule, CommonModule, MatSnackBarModule, HttpClientTestingModule, FormsModule, ReactiveFormsModule],
      providers: [{provide: AppServiceService, useClass: MockAppService}],
    })
    .compileComponents();


  });
  beforeEach(() => {
    fixture = TestBed.createComponent(UserQuestionAnswerComponent);
    component = fixture.componentInstance;
    mockAppService = new MockAppService()
    fixture.detectChanges();

  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should be able to generate Question Template', () => {
    jest.spyOn(component,'generateQuestion');
    const button = fixture.nativeElement.querySelector("#addQuestionBox");
    button.click();
    expect(component.generateQuestion).toBeCalled();
  })
  it('should be able to change flag for removing question', () => {
    jest.spyOn(component,'removeQuestion');
    component.removeQuestion();
    expect(component.createQuestionFlag).toBe(false)
  })
  it('should save User Added Question',() => {
    component.userQuestionRequest={
      question:"question?"
    }
    component.questionText="question?"
    let userQuestion: UserQuestionRequest = {
      question:"question?"
    }
    jest.spyOn(component,'saveQuestion')
    component.saveQuestion();

    mockAppService.saveUserQuestion(userQuestion,2,1).subscribe(data => {
      expect(data.question).toBe(userQuestion.question)
    })
  })
  it('should throw error when not able  to save User Added Question',() => {
    component.userQuestionRequest={
      question:"new"
    }
    component.questionText="new"
    let userQuestion: UserQuestion = {
      questionId:1,
      question:"new"
    }
    jest.spyOn(component,'saveQuestion')
    component.saveQuestion();

    jest.spyOn(component,"showError")

    mockAppService.saveUserQuestion(userQuestion,2,2).subscribe(data => {
        expect(data).toBeUndefined()},
      error => {
        expect(component.showError).toHaveBeenCalled()
        expect(error).toBe(new Error("Error!"))
      })
  })
  it('should allow user to edit the question ', () => {
    jest.spyOn(component,'editQuestionFlag');
    component.createQuestionFlag = false;
    component.questionEditFlag = false;
    component.editQuestionFlag(1);

    expect(component.questionEditFlag).toBe(true);
    expect(component.questionEditFlagNumber).toBe(1);
  })

  it('should not be able to delete user Question and throw error', () => {
    jest.spyOn(component,'deleteUserQuestion');
    component.createQuestionFlag=false;
    component.deleteUserQuestion(1);
    mockAppService.deleteUserQuestion(2,1).subscribe(data => {
        expect(data).toBeUndefined()},
      error => {
        expect(component.showError).toHaveBeenCalled()
        expect(error).toBe(new Error("Error!"))
      })

  })

  it('should be able to delete user Question', () => {
    jest.spyOn(component,'deleteUserQuestion');
    component.createQuestionFlag=false;
    component.answerResponse = {
      answerResponseList: [],
      assessmentId: 2,
      assessmentName: "",
      assessmentPurpose: "",
      assessmentState: "",
      assessmentStatus: "",
      domain: "",
      industry: "",
      organisationName: "",
      owner: false,
      parameterRatingAndRecommendation: [],
      topicRatingAndRecommendation: [],
      updatedAt: 0,
      userQuestionResponseList: [{questionId:2,parameterId:1,question:"new",answer:"answer"}],
      users: []

    }
    component.deleteUserQuestion(2);
    mockAppService.deleteUserQuestion(2,2).subscribe(data => {
        expect(data).toBe(true)
    });
  })
  it('should be able to update the question', () => {
    jest.spyOn(component,"updateQuestion")
    let userQuestion : UserQuestion = {
      questionId:1,question:"update"
    }

    component.answerResponse = {
      answerResponseList: [],
      assessmentId: 0,
      assessmentName: "",
      assessmentPurpose: "",
      assessmentState: "",
      assessmentStatus: "",
      domain: "",
      industry: "",
      organisationName: "",
      owner: false,
      parameterRatingAndRecommendation: [],
      topicRatingAndRecommendation: [],
      updatedAt: 0,
      userQuestionResponseList: [{questionId:1,parameterId:1,question:"new",answer:"answer"}],
      users: []

    }
    component.updateQuestion(userQuestion);
    mockAppService.updateUserQuestion(userQuestion,2).subscribe(data => {
      expect(data).toBe(true)
    });

  })

  it('should not be able to update user Question and throw error', () => {
    jest.spyOn(component,'updateQuestion');
    let userQuestion : UserQuestion = {
      questionId:2,question:"new",answer:"answer"
    }
    component.updateQuestion(userQuestion);
    mockAppService.updateUserQuestion(userQuestion,1).subscribe(data => {
        expect(data).toBeUndefined()},
      error => {
        expect(component.showError).toHaveBeenCalled()
        expect(error).toBe(new Error("Error!"))
      })

  })


});
