import {Component, Input, OnInit} from '@angular/core';
import {UserQuestion} from "../../types/UserQuestion";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {data_local} from "../../messages";
import {Observable, Subject, takeUntil} from "rxjs";
import {AssessmentStructure} from "../../types/assessmentStructure";
import {UntypedFormBuilder} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Store} from "@ngrx/store";
import {AppStates} from "../../reducers/app.states";
import {UserQuestionResponse} from "../../types/userQuestionResponse";
import * as fromActions from "../../actions/assessment-data.actions";
import {NotificationSnackbarComponent} from "../notification-component/notification-component.component";
import {UserQuestionRequest} from "../../types/userQuestionRequest";

let assessmentData = [{}]

@Component({
  selector: 'app-user-question-answer',
  templateUrl: './user-question-answer.component.html',
  styleUrls: ['./user-question-answer.component.css']
})
export class UserQuestionAnswerComponent implements OnInit {

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

  @Input()
  parameterName: string

  questionText: string;
  assessmentStatus: string;


  questionEditFlagNumber: number;
  questionEditFlag: boolean = false;

  userQuestionRequest: UserQuestionRequest = {
    question: ""
  }
  userQuestionResponse: UserQuestionResponse = {
    questionId: -1,
    parameterId: -1,
    question: "",
    answer: ""
  }
  createQuestionFlag: boolean = false;


  answerResponse1: Observable<AssessmentStructure>
  answerResponse: AssessmentStructure


  errorMessagePopUp = data_local.SHOW_ERROR_MESSAGE.POPUP_ERROR;
  menuMessageError = data_local.SHOW_ERROR_MESSAGE.MENU_ERROR;
  additionalQuestionHeading = data_local.ADDITIONAL_QUESTIONS.HEADING;
  addQuestionButtonText = data_local.ADDITIONAL_QUESTIONS.ADD_QUESTION_TEXT;
  editHoverText = data_local.ADDITIONAL_QUESTIONS.QUESTION_FUNCTIONALITY_MESSAGE.EDIT;
  saveHoverText = data_local.ADDITIONAL_QUESTIONS.QUESTION_FUNCTIONALITY_MESSAGE.SAVE;
  updateHoverText = data_local.ADDITIONAL_QUESTIONS.QUESTION_FUNCTIONALITY_MESSAGE.UPDATE;
  deleteHoverText = data_local.ADDITIONAL_QUESTIONS.QUESTION_FUNCTIONALITY_MESSAGE.DELETE;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private appService: AppServiceService, private _fb: UntypedFormBuilder, private _snackBar: MatSnackBar, private store: Store<AppStates>) {
    this.answerResponse1 = this.store.select((store) => store.assessmentState.assessments)

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
      data: {message: message, iconType: "error_outline", notificationType: "Error:"}, panelClass: ['error-snackBar'],
      duration: 2000,
      verticalPosition: "top",
      horizontalPosition: "center"
    })
  }

  questionLabel = data_local.ASSESSMENT_QUESTION_FIELD.LABEL;
  inputWarningLabel = data_local.LEGAL_WARNING_MSG_FOR_INPUT;
  showAccordion: any = true;


  saveQuestion() {
    this.userQuestionRequest.question = this.questionText;
    if (this.userQuestionRequest.question.length > 0) {
      this.appService.saveUserQuestion(this.userQuestionRequest, this.assessmentId, this.parameterId).pipe(takeUntil(this.destroy$)).subscribe({
          next: (_data) => {
            assessmentData.push(this.userQuestionRequest);
            this.createQuestionFlag = false;
            this.userQuestionResponse = _data;
            this.sendUserQuestionAnswer(this.userQuestionResponse)
            this.questionText = ""
            this.updateDataSavedStatus()

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

  editQuestionFlag(questionId: any) {
    if(!this.createQuestionFlag) {
      this.questionEditFlagNumber = questionId
      this.questionEditFlag = true
    }
  }

  removeQuestion() {
    this.createQuestionFlag = false
    this.additionalQuestionCount -= 1
    this.questionText = ""
  }

  deleteUserQuestion(questionId: number) {
    if(!this.createQuestionFlag) {
      this.appService.deleteUserQuestion(this.assessmentId, questionId).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.removeUserQuestion(questionId)
          this.additionalQuestionCount -= 1;
          this.questionEditFlag = false;
          this.updateDataSavedStatus();
        },
        error: _error => {
          this.showError(this.errorMessagePopUp);
        }
      })
    }
  }

  updateQuestion(userQuestion: UserQuestion) {
    this.questionEditFlagNumber = 0;
    if (userQuestion.question.length > 0) {
      this.appService.updateUserQuestion(userQuestion, this.assessmentId).pipe(takeUntil(this.destroy$)).subscribe({
          next: (_data) => {
            assessmentData.push(userQuestion);
            this.createQuestionFlag = false;
            this.userQuestionResponse.questionId = userQuestion.questionId
            this.userQuestionResponse.question = userQuestion.question
            this.userQuestionResponse.parameterId = this.parameterId
            if (userQuestion.answer != null) {
              this.userQuestionResponse.answer = userQuestion.answer
            }
            this.sendUserQuestionAnswer(this.userQuestionResponse)
            this.questionText = ""
            this.questionEditFlag = false
            this.updateDataSavedStatus()
          },
          error: _error => {
            this.showError(this.errorMessagePopUp);
          }
        }
      )
    }
  }

  private sendUserQuestionAnswer(userQuestionResponse: UserQuestionResponse) {
    let index = 0;
    let updatedUserQuestionAnswerList = [];
    updatedUserQuestionAnswerList.push(userQuestionResponse);
    this.cloneAnswerResponse = Object.assign({}, this.answerResponse)
    if (this.cloneAnswerResponse.userQuestionResponseList != undefined) {
      index = this.cloneAnswerResponse.userQuestionResponseList.findIndex(eachQuestion => eachQuestion.questionId === userQuestionResponse.questionId)
      if (index !== -1) {
        if (userQuestionResponse.question != null) {
          this.cloneAnswerResponse.userQuestionResponseList[index].question = userQuestionResponse.question
        }
      } else {
        this.cloneAnswerResponse.userQuestionResponseList.push(this.userQuestionResponse)
        this.userQuestionList.push(userQuestionResponse)}
    } else {
      this.cloneAnswerResponse.userQuestionResponseList = updatedUserQuestionAnswerList
    }
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneAnswerResponse}))
  }

  private removeUserQuestion(questionId: number) {
    this.cloneAnswerResponse = Object.assign({}, this.answerResponse)
    if (this.cloneAnswerResponse.userQuestionResponseList != undefined) {
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

  closeAccordion($event: MouseEvent) {
    this.showAccordion = !this.showAccordion;

  }
}
