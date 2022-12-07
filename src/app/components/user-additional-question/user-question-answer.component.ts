import {Component, Input, OnInit} from '@angular/core';
import {UserQuestion} from "../../types/UserQuestion";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {data_local} from "../../messages";
import {Observable, Subject, takeUntil} from "rxjs";
import {AssessmentStructure} from "../../types/assessmentStructure";
import {UntypedFormBuilder} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Store} from "@ngrx/store";
import {AssessmentState} from "../../reducers/app.states";
import * as fromReducer from "../../reducers/assessment.reducer";
import {UserQuestionResponse} from "../../types/userQuestionResponse";
import * as fromActions from "../../actions/assessment-data.actions";
import {NotificationSnackbarComponent} from "../notification-component/notification-component.component";
let assessmentData = [{}]
@Component({
  selector: 'app-user-question-answer',
  templateUrl: './user-question-answer.component.html',
  styleUrls: ['./user-question-answer.component.css']
})
export class UserQuestionAnswerComponent implements OnInit{

  @Input()
  additionalQuestionCount: number;

  @Input()
  parameterId: number

  @Input()
  assessmentId: number

  @Input()
  userQuestionList: UserQuestion[]

  @Input()
  parameterIndex: number

  @Input()
  questionIndex: number

  questionText: string;
  assessmentStatus: string;


  questionEditFlag:number;
  editFlag:boolean = false;

  userQuestion: UserQuestion = {
    question: ""
  }
  userQuestionResponse : UserQuestionResponse = {
    questionId :-1,
    parameterId:-1,
    question:"",
    answer:""
  }
  createQuestionFlag: boolean = false;


  answerResponse1: Observable<AssessmentStructure>
  answerResponse: AssessmentStructure


  errorMessagePopUp = data_local.SHOW_ERROR_MESSAGE.POPUP_ERROR;
  menuMessageError = data_local.SHOW_ERROR_MESSAGE.MENU_ERROR;
  private destroy$: Subject<void> = new Subject<void>();
  constructor(private appService: AppServiceService, private _fb: UntypedFormBuilder, private _snackBar: MatSnackBar, private store: Store<AssessmentState>) {
    this.answerResponse1 = this.store.select(fromReducer.getAssessments)

  }
  ngOnInit() {
    this.answerResponse1.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data !== undefined) {
        this.answerResponse = data
        this.assessmentStatus = data.assessmentStatus
      }
    })
  }

  private cloneAnswerResponse: AssessmentStructure;
  private cloneAnswerResponse1: AssessmentStructure;

  showError(message: string) {
    this._snackBar.openFromComponent(NotificationSnackbarComponent, {
      data : { message  : message, iconType : "error_outline", notificationType: "Error:"}, panelClass: ['error-snackBar'],
      duration : 2000,
      verticalPosition : "top",
      horizontalPosition : "center"
    })
  }

  questionLabel = data_local.ASSESSMENT_QUESTION_FIELD.LABEL;
  inputWarningLabel = data_local.LEGAL_WARNING_MSG_FOR_INPUT;


  saveQuestion() {
    this.userQuestion.question = this.questionText;
    if(this.userQuestion.question.length>0) {
      this.appService.saveUserQuestion(this.userQuestion, this.assessmentId, this.parameterId).pipe(takeUntil(this.destroy$)).subscribe({
          next: (_data) => {
            assessmentData.push(this.userQuestion);
            this.createQuestionFlag = false;
            this.userQuestionResponse = _data;
            this.sendUserQuestionAnswer(this.userQuestionResponse)
            this.updateDataSavedStatus()
            this.questionText = ""

          }, error: _error => {
            this.showError(this.errorMessagePopUp);
          }
        }
      )
    }

  }

  generateQuestion() {
    this.additionalQuestionCount += 1;
    this.createQuestionFlag = true
  }

  removeQuestion() {
    this.createQuestionFlag = false
    this.additionalQuestionCount -= 1
  }

  deleteUserQuestion(questionId: any) {
    this.appService.deleteUserQuestion(this.assessmentId,questionId).pipe(takeUntil(this.destroy$)).subscribe( {next:() => {
      this.removeUserQuestion(questionId)
      this.updateDataSavedStatus();
      this.additionalQuestionCount -= 1
    },
      error: _error => {
        this.showError(this.errorMessagePopUp);
      }
    })
  }


  editQuestionFlag(questionId: any) {
    this.questionEditFlag = questionId
    this.editFlag = true
  }

  updateQuestion(userQuestion: UserQuestion) {
    this.questionEditFlag = 0;
    if(userQuestion.question.length>0) {
      this.appService.saveUserQuestion(userQuestion, this.assessmentId, this.parameterId).pipe(takeUntil(this.destroy$)).subscribe({
          next: (_data) => {
            assessmentData.push(this.userQuestion);
            this.createQuestionFlag = false;
            this.userQuestionResponse = _data;
            this.sendUserQuestionAnswer(this.userQuestionResponse)
            this.updateDataSavedStatus()
            this.questionText = ""
            this.editFlag = false
          },
        error: _error => {
            this.showError(this.errorMessagePopUp);
          }
        }
      )
    }
  }

  private sendUserQuestionAnswer(userQuestion: UserQuestionResponse) {
    let index = 0;
    let updatedUserQuestionAnswerList = [];
    updatedUserQuestionAnswerList.push(userQuestion);
    this.cloneAnswerResponse = Object.assign({}, this.answerResponse)
    if (this.cloneAnswerResponse.userQuestionResponseList != undefined) {
      index = this.cloneAnswerResponse.userQuestionResponseList.findIndex(eachQuestion => eachQuestion.questionId === userQuestion.questionId)
      if (index !== -1) {
        if (userQuestion.question != null) {
          this.cloneAnswerResponse.userQuestionResponseList[index].question = userQuestion.question
        }
      }
      else {
        this.cloneAnswerResponse.userQuestionResponseList.push(userQuestion)
        this.userQuestionList.push(userQuestion)

      }
    } else {
      this.cloneAnswerResponse.userQuestionResponseList = updatedUserQuestionAnswerList
    }
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneAnswerResponse}))
  }

  private removeUserQuestion(questionId:number){
    this.cloneAnswerResponse = Object.assign({}, this.answerResponse)
    if(this.cloneAnswerResponse.userQuestionResponseList != undefined) {
      this.userQuestionList = this.userQuestionList.filter(eachQuestion => eachQuestion.questionId !== questionId)
      this.cloneAnswerResponse.userQuestionResponseList = this.cloneAnswerResponse.userQuestionResponseList.filter(eachQuestion => eachQuestion.questionId !== questionId)
    }
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneAnswerResponse}))
  }

  private updateDataSavedStatus() {
    this.cloneAnswerResponse1 = Object.assign({}, this.answerResponse)
    this.cloneAnswerResponse1.updatedAt = Number(new Date(Date.now()))
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneAnswerResponse1}))
  }

}
