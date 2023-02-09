/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */
import {AppServiceService} from "../../services/app-service/app-service.service";
import {UntypedFormBuilder} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Observable, Subject, takeUntil} from "rxjs";
import {AssessmentStructure} from "../../types/assessmentStructure";
import {Store} from "@ngrx/store";
import {AppStates} from "../../reducers/app.states";
import {AssessmentAnswerResponse} from "../../types/AssessmentAnswerResponse";
import * as fromActions from "../../actions/assessment-data.actions";
import {debounce} from 'lodash';
import {AssessmentMenuComponent} from "../assessment-quick-action-menu/assessment-menu.component";
import {data_local} from 'src/app/messages';
import {NotificationSnackbarComponent} from "../notification-component/notification-component.component";
import {AnswerRequest} from "../../types/answerRequest";
import {UserQuestionResponse} from "../../types/userQuestionResponse";
import {ActivityLogResponse} from "../../types/activityLogResponse";

export const assessmentData = [{}]
export let loading = false

let DEBOUNCE_TIME = 600;


@Component({
  selector: 'app-assessment-question',
  templateUrl: './assessment-question.component.html',
  styleUrls: ['./assessment-question.component.css'],
  animations: []
})


export class AssessmentQuestionComponent implements OnInit, OnDestroy, OnChanges {

  assessmentStatus: string;
  @Input()
  answerInput: string | undefined;

  @Input()
  type: string

  @Input()
  questionNumber: number

  @Input()
  parameterId: number;

  @Input()
  assessmentId: number;

  @Input()
  question: string

  @Input()
  activityRecords: ActivityLogResponse[]

  textarea: number = 0;

  questionId: number;
  autoSave: string;

  questionLabel = data_local.ASSESSMENT_QUESTION_FIELD.LABEL;
  inputWarningLabel = data_local.LEGAL_WARNING_MSG_FOR_INPUT;
  errorMessagePopUp = data_local.SHOW_ERROR_MESSAGE.POPUP_ERROR;
  menuMessageError = data_local.SHOW_ERROR_MESSAGE.MENU_ERROR;
  autoSaveMessage = data_local.AUTO_SAVE.AUTO_SAVE_MESSAGE;
  additionalTypeQuestion = data_local.QUESTION_TYPE_TEXT.ADDITIONAL_TYPE;
  maxLimit: number = data_local.ASSESSMENT_QUESTION_FIELD.ANSWER_FIELD_LIMIT;
  latestActivityRecord: ActivityLogResponse = {activityType: "", email: "", fullName: "", identifier: 0, inputText: ""}


  private cloneAnswerResponse: AssessmentStructure;
  private cloneAnswerResponse1: AssessmentStructure;

  answerResponse1: Observable<AssessmentStructure>
  answerResponse: AssessmentStructure
  activateSpinner: boolean = false;
  isSaving: boolean

  constructor(private appService: AppServiceService, private _fb: UntypedFormBuilder, private _snackBar: MatSnackBar, private store: Store<AppStates>) {
    this.answerResponse1 = this.store.select((storeMap) => storeMap.assessmentState.assessments)
    this.saveParticularAnswer = debounce(this.saveParticularAnswer, DEBOUNCE_TIME)

  }


  answerRequest: AnswerRequest = {
    questionId: 0, answer: "", type: ""
  }
  answerNote: AssessmentAnswerResponse = {questionId: undefined, answer: undefined};

  userQuestionResponse: UserQuestionResponse = {
    answer: "", parameterId: 0, question: "", questionId: 0
  };

  private destroy$: Subject<void> = new Subject<void>();


  ngOnInit() {
    this.answerResponse1.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data !== undefined) {
        this.answerResponse = data
        this.assessmentStatus = data.assessmentStatus
      }
    })
  }

  ngOnChanges(): void {
    let questionType = this.type + "_QUESTION";
    this.latestActivityRecord.identifier = -1
    if (this.activityRecords.length > 0) {
      for (let record of this.activityRecords) {
        if (record.identifier === this.questionNumber && questionType === record.activityType) {
          this.latestActivityRecord = {
            activityType: record.activityType,
            email: record.email,
            fullName: record.fullName,
            identifier: record.identifier,
            inputText: "",
          }
          this.answerInput = record.inputText
          this.activateSpinner = !this.activateSpinner
        }
      }
    } else {
      this.latestActivityRecord = {activityType: "", email: "", fullName: "", identifier: -1, inputText: ""}
    }
  }

  showError(message: string) {
    this._snackBar.openFromComponent(NotificationSnackbarComponent, {
      data: {message: message, iconType: "error_outline", notificationType: "Error:"}, panelClass: ['error-snackBar'],
      duration: 2000,
      verticalPosition: "top",
      horizontalPosition: "center"
    })
  }

  saveParticularAnswer(_$event: KeyboardEvent) {
    this.answerRequest.questionId = this.questionNumber
    this.answerRequest.type = this.type;
    if (this.answerInput != null) {
      this.answerRequest.answer = this.answerInput
    }

    this.questionId = this.questionNumber
    this.autoSave = this.autoSaveMessage
    this.saveNotes(this.answerRequest, this.assessmentId);

  }

  saveNotes(answerRequest: AnswerRequest, assessmentId: number) {
    this.isSaving = true
    this.appService.saveNotes(assessmentId, answerRequest).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        assessmentData.push(answerRequest);
        this.isSaving = false
        this.autoSave = ""
        if (this.type === this.additionalTypeQuestion) {
          this.userQuestionResponse.parameterId = this.parameterId
          this.userQuestionResponse.questionId = this.questionNumber
          this.userQuestionResponse.question = this.question
          if (this.answerInput != null) {
            this.userQuestionResponse.answer = this.answerInput
          }
          this.sendUserAnswer(this.userQuestionResponse)
        } else {
          this.answerNote.answer = this.answerInput
          this.answerNote.questionId = this.questionNumber
          this.sendAnswer(this.answerNote);
        }
        this.updateDataSavedStatus()
      },
      error: _err => {
        AssessmentMenuComponent.answerSaved = this.menuMessageError
        this.showError(this.errorMessagePopUp);
      }
    });
  }

  private sendAnswer(answerNote: AssessmentAnswerResponse) {
    let index = 0;
    let updatedAnswerList = [];
    updatedAnswerList.push(answerNote);
    this.cloneAnswerResponse = Object.assign({}, this.answerResponse)
    if (this.cloneAnswerResponse.answerResponseList != undefined) {
      index = this.cloneAnswerResponse.answerResponseList.findIndex(eachQuestion => eachQuestion.questionId === answerNote.questionId)
      if (index !== -1) {
        this.cloneAnswerResponse.answerResponseList[index].answer = answerNote.answer
      } else {
        this.cloneAnswerResponse.answerResponseList.push(answerNote)
      }
    } else {
      this.cloneAnswerResponse.answerResponseList = updatedAnswerList
    }
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneAnswerResponse}))
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isActivityFound() {
    return this.latestActivityRecord.email.length > 0 && this.latestActivityRecord.identifier === this.questionNumber;
  }
}
