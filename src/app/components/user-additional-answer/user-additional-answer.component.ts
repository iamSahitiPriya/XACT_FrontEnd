import {Component, Input, OnInit} from '@angular/core';
import {UserQuestion} from "../../types/UserQuestion";
import {AssessmentMenuComponent} from "../assessment-quick-action-menu/assessment-menu.component";
import {Observable, Subject, takeUntil} from "rxjs";
import * as fromActions from "../../actions/assessment-data.actions";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {UntypedFormBuilder} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Store} from "@ngrx/store";
import {AssessmentState} from "../../reducers/app.states";
import * as fromReducer from "../../reducers/assessment.reducer";
import {debounce} from "lodash";
import {AssessmentStructure} from "../../types/assessmentStructure";
import {UserQuestionResponse} from "../../types/userQuestionResponse";
import {data_local} from "../../messages";
import {NotificationSnackbarComponent} from "../notification-component/notification-component.component";

export const assessmentData = [{}]
export let loading = false

let DEBOUNCE_TIME = 1200;


@Component({
  selector: 'app-user-additional-answer',
  templateUrl: './user-additional-answer.component.html',
  styleUrls: ['./user-additional-answer.component.css']
})

export class UserAdditionalAnswerComponent implements OnInit{

  @Input()
  userAnswerInput: UserQuestion;

  @Input()
  assessmentId:number

  @Input()
  parameterId:number

  @Input()
  userQuestionId:number

  autoSave : string;
  questionId:number
  assessmentStatus: string;


  answerResponse1: Observable<AssessmentStructure>
  answerResponse: AssessmentStructure
  private destroy$: Subject<void> = new Subject<void>();

  questionLabel = data_local.ASSESSMENT_QUESTION_FIELD.LABEL;
  inputWarningLabel = data_local.LEGAL_WARNING_MSG_FOR_INPUT;
  errorMessagePopUp = data_local.SHOW_ERROR_MESSAGE.POPUP_ERROR;
  menuMessageError = data_local.SHOW_ERROR_MESSAGE.MENU_ERROR;

  constructor(private appService: AppServiceService, private _fb: UntypedFormBuilder, private _snackBar: MatSnackBar, private store: Store<AssessmentState>) {
    this.answerResponse1 = this.store.select(fromReducer.getAssessments)
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


  userQuestion:UserQuestion = {
    answer: "", question: "", questionId: 0
  }

  userQuestionResponse :UserQuestionResponse ={
    answer: "", parameterId: 0, question: "", questionId: 0

  };

  showError(message: string) {
    this._snackBar.openFromComponent(NotificationSnackbarComponent, {
      data : { message  : message, iconType : "error_outline", notificationType: "Error:"}, panelClass: ['error-snackBar'],
      duration : 2000,
      verticalPosition : "top",
      horizontalPosition : "center"
    })
  }

  saveParticularUserAnswer(_$event: KeyboardEvent) {
    AssessmentMenuComponent.answerSaved = "Saving..."
    this.userQuestionResponse.parameterId = this.parameterId
    this.userQuestionResponse.questionId = this.userQuestionId

    this.userQuestionResponse.question = this.userAnswerInput.question
    if (this.userAnswerInput.answer != null) {
      this.userQuestionResponse.answer = this.userAnswerInput.answer
    }
    this.userQuestionResponse.parameterId=this.parameterId
    this.userQuestion.questionId = this.userAnswerInput.questionId
    this.userQuestion.answer = this.userAnswerInput.answer
    this.userQuestion.question=this.userAnswerInput.question
    this.autoSave = "Auto Saved"
    this.saveUserQuestionAnswer(this.userQuestion,this.assessmentId,this.parameterId,this.userQuestionResponse);
  }

  saveUserQuestionAnswer(userQuestion:UserQuestion,assessmentId:number,parameterId:number,userQuestionResponse:UserQuestionResponse){
    this.appService.saveUserQuestion(userQuestion,assessmentId,parameterId).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        assessmentData.push(this.userQuestion);
        this.questionId = -1
        this.autoSave = ""
        this.sendAnswer(userQuestionResponse)
        this.updateDataSavedStatus()
      },
      error: _err => {
        AssessmentMenuComponent.answerSaved = this.menuMessageError
        this.showError(this.errorMessagePopUp);
      }
    });
  }

  private sendAnswer(userQuestionResponse: UserQuestionResponse) {
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
