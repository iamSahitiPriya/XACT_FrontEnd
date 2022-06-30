import {Component, Input, OnInit} from '@angular/core';
/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */
import {Notes} from "../../types/answerRequest";
import {QuestionStructure} from "../../types/questionStructure";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {FormBuilder} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Observable} from "rxjs";
import {AssessmentNotes} from "../../types/assessmentNotes";
import {AssessmentStructure} from "../../types/assessmentStructure";
import {Store} from "@ngrx/store";
import {AssessmentState} from "../../reducers/app.states";
import * as fromReducer from "../../reducers/assessment.reducer";
import {AssessmentAnswerResponse} from "../../types/AssessmentAnswerResponse";
import * as fromActions from "../../actions/assessment-data.actions";
import {debounce} from 'lodash';
import {UpdatedStatus} from 'src/app/types/UpdatedStatus';
import {AssessmentMenuComponent} from "../assessment-menu/assessment-menu.component";

export const assessmentData = [{}]
export let loading = false

let DEBOUNCE_TIME = 1500;

enum FormStatus {
  Saving = 'Saving',
  Saved = 'Saved',
  Idle = ''
}


@Component({
  selector: 'app-assessment-question',
  templateUrl: './assessment-question.component.html',
  styleUrls: ['./assessment-question.component.css']
})


export class AssessmentQuestionComponent implements OnInit {
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

  private cloneAnswerResponse: AssessmentStructure;
  private savedAnswer: UpdatedStatus = {assessmentId:0, status:""};
  private cloneAnswerResponse1: AssessmentStructure;

  constructor(private appService: AppServiceService, private _fb: FormBuilder, private _snackBar: MatSnackBar, private store: Store<AssessmentState>) {
    this.answerResponse1 = this.store.select(fromReducer.getAssessments)
    this.saveParticularAnswer = debounce(this.saveParticularAnswer, DEBOUNCE_TIME)

  }


  assessmentNotes: AssessmentNotes = {
    assessmentId: 0, questionId: undefined, notes: undefined,updatedAt:undefined
  };
  answerNote: AssessmentAnswerResponse = {questionId: undefined, answer: undefined};

  answerResponse1: Observable<AssessmentStructure>
  answerResponse: AssessmentStructure


  ngOnInit() {
    this.answerResponse1.subscribe(data => {
      if (data !== undefined) {
        this.answerResponse = data
        this.assessmentStatus = data.assessmentStatus
      }
    })
  }
  showError(message: string, action: string) {
    this._snackBar.open(message, action, {
      verticalPosition: 'top',
      panelClass: ['errorSnackbar'],
      duration: 2000
    })
  }
  saveParticularAnswer(_$event: KeyboardEvent) {
    AssessmentMenuComponent.answerSaved = "Saving..."
    this.assessmentNotes.assessmentId = this.assessmentId
    this.assessmentNotes.questionId = this.questionDetails.questionId
    this.assessmentNotes.notes = this.answerInput.answer
    this.assessmentNotes.notes = this.answerInput.answer
    this.assessmentNotes.updatedAt = Number(new Date(Date.now()))
    this.answerNote.questionId = this.questionDetails.questionId
    this.answerNote.answer = this.answerInput.answer
    this.appService.saveNotes(this.assessmentNotes).subscribe({
      next:(_data) => {
        assessmentData.push(this.assessmentNotes);
        this.sendAnswer(this.answerNote)
        this.updateDataSavedStatus()
    },
    error:_err => {
        this.showError("Data cannot be saved","Close");
    }});

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
    this.cloneAnswerResponse1 = Object.assign({},this.answerResponse)
    this.cloneAnswerResponse1.updatedAt = Number(new Date(Date.now()))
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData:this.cloneAnswerResponse1}))
  }
}
