import {Component, Input, OnInit} from '@angular/core';
import {UserQuestion} from "../../types/UserQuestion";
import {AssessmentMenuComponent} from "../assessment-quick-action-menu/assessment-menu.component";
import {Observable, Subject, takeUntil} from "rxjs";
import * as fromActions from "../../actions/assessment-data.actions";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {UntypedFormBuilder} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Store} from "@ngrx/store";
import {AppStates} from "../../reducers/app.states";
import {debounce} from "lodash";
import {AssessmentStructure} from "../../types/assessmentStructure";
import {UserQuestionResponse} from "../../types/userQuestionResponse";
import {data_local} from "../../messages";
import {NotificationSnackbarComponent} from "../notification-component/notification-component.component";
import {UserAnswer} from "../../types/userAnswer";

export const assessmentData = [{}]
export let loading = false

let DEBOUNCE_TIME = 1200;


@Component({
  selector: 'app-user-additional-answer',
  templateUrl: './user-additional-answer.component.html',
  styleUrls: ['./user-additional-answer.component.css']
})

export class UserAdditionalAnswerComponent implements OnInit {

  @Input()
  userAnswerInput: UserQuestion;

  @Input()
  assessmentId: number

  @Input()
  parameterId: number

  @Input()
  userQuestionId: number

  autoSave: string;
  questionId: number
  assessmentStatus: string;


  answerResponse1: Observable<AssessmentStructure>
  answerResponse: AssessmentStructure
  private destroy$: Subject<void> = new Subject<void>();

  questionLabel = data_local.ASSESSMENT_QUESTION_FIELD.LABEL;
  inputWarningLabel = data_local.LEGAL_WARNING_MSG_FOR_INPUT;
  errorMessagePopUp = data_local.SHOW_ERROR_MESSAGE.POPUP_ERROR;
  menuMessageError = data_local.SHOW_ERROR_MESSAGE.MENU_ERROR;

  constructor(private appService: AppServiceService, private _fb: UntypedFormBuilder, private _snackBar: MatSnackBar, private store: Store<AppStates>) {
    this.answerResponse1 = this.store.select((store) => store.assessmentState.assessments)
    this.saveParticularUserAnswer = debounce(this.saveParticularUserAnswer, DEBOUNCE_TIME)

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


  userAnswer: UserAnswer = {
    answer: "", questionId: 0
  }

  userQuestionResponse: UserQuestionResponse = {
    answer: "", parameterId: 0, question: "", questionId: 0

  };

  showError(message: string) {
    this._snackBar.openFromComponent(NotificationSnackbarComponent, {
      data: {message: message, iconType: "error_outline", notificationType: "Error:"}, panelClass: ['error-snackBar'],
      duration: 2000,
      verticalPosition: "top",
      horizontalPosition: "center"
    })
  }

  saveParticularUserAnswer(_$event: KeyboardEvent) {
    AssessmentMenuComponent.answerSaved = "Saving..."
    this.userQuestionResponse.parameterId = this.parameterId
    this.userQuestionResponse.questionId = this.userQuestionId
    this.userQuestionResponse.question = this.userAnswerInput.question
    this.userAnswer.questionId = this.userAnswerInput.questionId
    if (this.userAnswerInput.answer != null) {
      this.userQuestionResponse.answer = this.userAnswerInput.answer
      this.userAnswer.answer = this.userAnswerInput.answer

    }
    this.autoSave = "Auto Saved"
    this.saveUserQuestionAnswer(this.userAnswer, this.assessmentId, this.userQuestionResponse);
  }

  saveUserQuestionAnswer(userAnswer: UserAnswer, assessmentId: number, userQuestionResponse: UserQuestionResponse) {
    this.appService.updateUserAnswer(userAnswer, assessmentId).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        assessmentData.push(this.userAnswer);
        this.questionId = -1
        this.autoSave = ""
        this.sendUserAnswer(userQuestionResponse)
        this.updateDataSavedStatus()
      },
      error: _err => {
        AssessmentMenuComponent.answerSaved = this.menuMessageError
        this.showError(this.errorMessagePopUp);
      }
    });
  }

  private sendUserAnswer(userQuestionResponse: UserQuestionResponse) {
    let index = 0;
    let updatedUserAnswerList = [];
    updatedUserAnswerList.push(userQuestionResponse);
    this.cloneAnswerResponse = Object.assign({}, this.answerResponse)
    if (this.cloneAnswerResponse.userQuestionResponseList != undefined) {
      index = this.cloneAnswerResponse.userQuestionResponseList.findIndex(eachQuestion => eachQuestion.questionId === userQuestionResponse.questionId)
      if (index !== -1) {
        if (userQuestionResponse.answer != null) {
          this.cloneAnswerResponse.userQuestionResponseList[index].answer = userQuestionResponse.answer
        }
      } else {
        this.cloneAnswerResponse.userQuestionResponseList.push(this.userQuestionResponse)
      }
    } else {
      this.cloneAnswerResponse.userQuestionResponseList = updatedUserAnswerList
    }
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneAnswerResponse}))
  }

  private updateDataSavedStatus() {
    this.cloneAnswerResponse1 = Object.assign({}, this.answerResponse)
    this.cloneAnswerResponse1.updatedAt = Number(new Date(Date.now()))
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneAnswerResponse1}))
  }

}
