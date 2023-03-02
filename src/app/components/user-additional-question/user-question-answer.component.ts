import {Component, Input, OnInit} from '@angular/core';
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
import {ActivityLogResponse} from "../../types/activityLogResponse";
import {cloneDeep} from "lodash";

export const assessmentData = [{}]

export interface UserQuestionData {
  userQuestion: UserQuestionResponse
  isEdit: boolean
}

@Component({
  selector: 'app-user-question-answer',
  templateUrl: './user-question-answer.component.html',
  styleUrls: ['./user-question-answer.component.css']
})
export class UserQuestionAnswerComponent implements OnInit {

  @Input()
  parameterId: number

  @Input()
  assessmentId: number

  @Input()
  userQuestionList: UserQuestionResponse[]

  @Input()
  parameterIndex: number

  @Input()
  questionIndex: number

  @Input()
  parameterName: string

  @Input()
  activityRecords: ActivityLogResponse[]

  assessmentStatus: string;

  userQuestionRequest: UserQuestionRequest = {
    question: ""
  }

  userQuestionData: UserQuestionData[] = [];

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
  private previousUserQuestionData: UserQuestionData[];


  constructor(private appService: AppServiceService, private _fb: UntypedFormBuilder, private _snackBar: MatSnackBar, private store: Store<AppStates>) {
    this.answerResponse1 = this.store.select((storeMap) => storeMap.assessmentState.assessments)

  }

  ngOnInit() {
    this.answerResponse1.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data !== undefined) {
        this.answerResponse = data
        this.assessmentStatus = data.assessmentStatus
      }
    })
    this.formatUserQuestionData();
    this.previousUserQuestionData = cloneDeep(this.userQuestionData);
  }

  formatUserQuestionData() {
    this.userQuestionList.forEach(userQuestion => {
      let userQuestion1: UserQuestionData = {userQuestion: userQuestion, isEdit: false}
      this.userQuestionData.push(userQuestion1)
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
  showAccordion: boolean = true;
  questionType: string = data_local.QUESTION_TYPE_TEXT.ADDITIONAL_TYPE;


  saveQuestion(userQuestion: UserQuestionData) {
    this.userQuestionRequest.question = userQuestion.userQuestion.question;
    if (this.userQuestionRequest.question.trimStart().length > 0) {
      this.appService.saveUserQuestion(this.userQuestionRequest, this.assessmentId, this.parameterId).pipe(takeUntil(this.destroy$)).subscribe({
          next: (_data) => {
            assessmentData.push(this.userQuestionRequest);
            let userQuestionData: UserQuestionData = {userQuestion: _data, isEdit: false}
            this.pruneUserQuestion();
            userQuestion.isEdit = false
            this.sendUserQuestionAnswer(userQuestionData)
            this.updateDataSavedStatus()
          }, error: _error => {
            this.showError(this.errorMessagePopUp);
          }
        }
      )
    }
  }

  private pruneUserQuestion() {
    let index = this.userQuestionData.findIndex(userQuestion => userQuestion.userQuestion.questionId === -1);
    if (index !== -1) {
      this.userQuestionData.splice(index, 1)
    }
  }

  generateQuestion() {
    this.pruneUserQuestion();
    let userQuestion: UserQuestionResponse = {answer: "", parameterId: 0, question: "", questionId: -1}
    let userQuestion2: UserQuestionData = {userQuestion: userQuestion, isEdit: true}
    this.resetUserQuestionData();
    this.userQuestionData.push(userQuestion2);
  }

  editUserQuestion(userQuestionData: UserQuestionData) {
    this.resetUserQuestionData();
    userQuestionData.isEdit = true;
  }

  private resetUserQuestionData() {
    this.userQuestionData.forEach(userQuestion => {
      userQuestion.isEdit = false
      let questionIndex = this.previousUserQuestionData.findIndex(unsavedUserQuestion => unsavedUserQuestion.userQuestion.questionId === userQuestion.userQuestion.questionId);
      if (questionIndex !== -1) {
        userQuestion.userQuestion.question = this.previousUserQuestionData[questionIndex].userQuestion.question;
      }
    })
  }

  removeQuestion() {
    this.pruneUserQuestion()
  }

  deleteUserQuestion(questionId: number) {
    this.appService.deleteUserQuestion(this.assessmentId, questionId).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.pruneUserQuestion();
        this.removeUserQuestion(questionId)
        this.updateDataSavedStatus();
      },
      error: _error => {
        this.showError(this.errorMessagePopUp);
      }
    })
  }

  updateQuestion(userQuestion: UserQuestionData) {
    if (userQuestion.userQuestion.question.trimStart().length > 0) {
      this.appService.updateUserQuestion(userQuestion.userQuestion, this.assessmentId).pipe(takeUntil(this.destroy$)).subscribe({
          next: (_data) => {
            userQuestion.isEdit = false
            this.sendUserQuestionAnswer(userQuestion);
            this.updateDataSavedStatus()
          },
          error: _error => {
            this.showError(this.errorMessagePopUp);
          }
        }
      )
    }
  }

  private sendUserQuestionAnswer(userQuestionData: UserQuestionData) {
    let index = 0;
    let updatedUserQuestionAnswerList = [];
    updatedUserQuestionAnswerList.push(userQuestionData.userQuestion);
    this.cloneAnswerResponse = Object.assign({}, this.answerResponse)
    if (this.cloneAnswerResponse.userQuestionResponseList != undefined) {
      index = this.cloneAnswerResponse.userQuestionResponseList.findIndex(eachQuestion => eachQuestion.questionId === userQuestionData.userQuestion.questionId)
      if (index !== -1) {
        if (userQuestionData.userQuestion.question != null) {
          this.cloneAnswerResponse.userQuestionResponseList[index].question = userQuestionData.userQuestion.question
        }
      } else {
        this.userQuestionData.push(userQuestionData)
        this.cloneAnswerResponse.userQuestionResponseList.push(userQuestionData.userQuestion)
      }
    } else {
      this.cloneAnswerResponse.userQuestionResponseList = updatedUserQuestionAnswerList
      this.userQuestionData.push(userQuestionData)
    }
    this.previousUserQuestionData = cloneDeep(this.userQuestionData);
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneAnswerResponse}))
  }


  private removeUserQuestion(questionId: number) {
    this.cloneAnswerResponse = Object.assign({}, this.answerResponse)
    if (this.cloneAnswerResponse.userQuestionResponseList != undefined) {
      this.userQuestionData = this.userQuestionData.filter(eachQuestion => eachQuestion.userQuestion.questionId !== questionId)
      this.cloneAnswerResponse.userQuestionResponseList = this.cloneAnswerResponse.userQuestionResponseList.filter(eachQuestion => eachQuestion.questionId !== questionId)
    }
    this.previousUserQuestionData = cloneDeep(this.userQuestionData);
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneAnswerResponse}))
  }


  private updateDataSavedStatus() {
    this.cloneAnswerResponse1 = Object.assign({}, this.answerResponse)
    this.cloneAnswerResponse1.updatedAt = Number(new Date(Date.now()))
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneAnswerResponse1}))
  }

  changeAccordionState(_$event: MouseEvent) {
    this.showAccordion = !this.showAccordion;
  }
}
