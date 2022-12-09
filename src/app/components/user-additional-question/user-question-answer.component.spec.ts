import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserQuestionAnswerComponent } from './user-question-answer.component';
import {AppServiceService} from "../../services/app-service/app-service.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCardModule} from "@angular/material/card";
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
import {UserQuestionResponse} from "../../types/userQuestionResponse";
import {of, throwError} from "rxjs";
import {UserAdditionalAnswerComponent} from "../user-additional-answer/user-additional-answer.component";




describe('UserQuestionAnswerComponent', () => {
  let component: UserQuestionAnswerComponent;
  let fixture: ComponentFixture<UserQuestionAnswerComponent>;

  class MockAppService {
    public saveUserQuestion(userQuestion:UserQuestion,assessmentId:number,parameterId:number) {
      if(userQuestion.questionId!==1){
        return of(userQuestion)
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
  it('should call save User Added Question',() => {
    component.userQuestionRequest={
      question:"new"
    }
    component.questionText="new"
    let userQuestion: UserQuestionRequest = {
      question:"new"
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
});
