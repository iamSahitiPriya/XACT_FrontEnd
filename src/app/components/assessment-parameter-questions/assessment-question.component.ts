/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */
import {Notes} from "../../types/answerRequest";
import {QuestionStructure} from "../../types/questionStructure";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {UntypedFormBuilder} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Observable, Subject, takeUntil} from "rxjs";
import {AssessmentNotes} from "../../types/assessmentNotes";
import {AssessmentStructure} from "../../types/assessmentStructure";
import {Store} from "@ngrx/store";
import {AssessmentState} from "../../reducers/app.states";
import * as fromReducer from "../../reducers/assessment.reducer";
import {AssessmentAnswerResponse} from "../../types/AssessmentAnswerResponse";
import * as fromActions from "../../actions/assessment-data.actions";
import {debounce} from 'lodash';
import {UpdatedStatus} from 'src/app/types/UpdatedStatus';
import {AssessmentMenuComponent} from "../assessment-quick-action-menu/assessment-menu.component";
import {data_local} from 'src/app/messages';
import {NotificationSnackbarComponent} from "../notification-component/notification-component.component";

export const assessmentData = [{}]
export let loading = false

let DEBOUNCE_TIME = 1200;


@Component({
  selector: 'app-assessment-question',
  templateUrl: './assessment-question.component.html',
  styleUrls: ['./assessment-question.component.css']
})


export class AssessmentQuestionComponent implements OnInit, OnDestroy {
  @Input()
  questionDetails: QuestionStructure;

  assessmentStatus: string;
  @Input()
  answerInput: Notes;
  @Input()
  initial: number
  @Input()
  assessmentId: number
  textarea: number = 0;

  questionId : number;
  autoSave : string;

  questionLabel = data_local.ASSESSMENT_QUESTION_FIELD.LABEL;
  inputWarningLabel = data_local.LEGAL_WARNING_MSG_FOR_INPUT;


  private cloneAnswerResponse: AssessmentStructure;
  private savedAnswer: UpdatedStatus = {assessmentId: 0, status: ""};
  private cloneAnswerResponse1: AssessmentStructure;

  constructor(private appService: AppServiceService, private _fb: UntypedFormBuilder, private _snackBar: MatSnackBar, private store: Store<AssessmentState>) {
    this.answerResponse1 = this.store.select(fromReducer.getAssessments)
    this.saveParticularAnswer = debounce(this.saveParticularAnswer, DEBOUNCE_TIME)

  }


  assessmentNotes: AssessmentNotes = {
    assessmentId: 0, questionId: undefined, notes: undefined, updatedAt: undefined
  };
  answerNote: AssessmentAnswerResponse = {questionId: undefined, answer: undefined};

  answerResponse1: Observable<AssessmentStructure>
  answerResponse: AssessmentStructure
  private destroy$: Subject<void> = new Subject<void>();


  ngOnInit() {
    this.answerResponse1.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data !== undefined) {
        this.answerResponse = data
        this.assessmentStatus = data.assessmentStatus
      }
    })
  }

  showError(message: string) {
    this._snackBar.openFromComponent(NotificationSnackbarComponent, {
      data : { message  : message, iconType : "error_outline", notificationType: "Error:"}, panelClass: ['error-snackBar'],
      duration : 2000,
      verticalPosition : "top",
      horizontalPosition : "center"
    })
  }

  saveParticularAnswer(_$event: KeyboardEvent) {
    AssessmentMenuComponent.answerSaved = "Saving..."
    this.assessmentNotes.assessmentId = this.assessmentId
    this.assessmentNotes.questionId = this.questionDetails.questionId
    this.assessmentNotes.notes = this.answerInput.answer
    this.assessmentNotes.updatedAt = Number(new Date(Date.now()))
    this.answerNote.questionId = this.questionDetails.questionId
    this.answerNote.answer = this.answerInput.answer
    this.questionId = this.assessmentNotes.questionId
    this.autoSave = "Auto Saved"
    this.saveNotes(this.assessmentNotes);
  }

  saveNotes(assessmentNotes:AssessmentNotes){
    this.appService.saveNotes(assessmentNotes).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        assessmentData.push(this.assessmentNotes);
        this.questionId = -1
        this.autoSave = ""
        this.sendAnswer(this.answerNote)
        this.updateDataSavedStatus()
      },
      error: _err => {
        AssessmentMenuComponent.answerSaved = "Error occurred while saving the data"
        this.showError("Data cannot be saved");
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

  private updateDataSavedStatus() {
    this.cloneAnswerResponse1 = Object.assign({}, this.answerResponse)
    this.cloneAnswerResponse1.updatedAt = Number(new Date(Date.now()))
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneAnswerResponse1}))
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
