import {Component, Input, OnInit} from '@angular/core';
/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */
import {Notes} from "../../types/answerRequest";
import {QuestionStructure} from "../../types/questionStructure";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {FormBuilder, FormControl} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {debounceTime, Observable} from "rxjs";
import {AssessmentNotes} from "../../types/assessmentNotes";
import {AssessmentStructure} from "../../types/assessmentStructure";
import {Store} from "@ngrx/store";
import {AssessmentState} from "../../reducers/app.states";
import * as fromReducer from "../../reducers/assessment.reducer";
import {AssessmentAnswerResponse} from "../../types/AssessmentAnswerResponse";
import * as fromActions from "../../actions/assessment_data.actions";

export const assessmentData = [{}]

let DEBOUNCE_TIME = 2000;

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


  formStatus: FormStatus.Saving | FormStatus.Saved | FormStatus.Idle = FormStatus.Idle;
  private cloneAnswerResponse: AssessmentStructure;

  constructor(private appService: AppServiceService, private _fb: FormBuilder, private _snackBar: MatSnackBar, private store: Store<AssessmentState>) {
    this.answerResponse1 = this.store.select(fromReducer.getAssessments)
  }


  note = new FormControl("");
  saveIndicator$: Observable<string>;
  saveCount = 0;
  assessmentNotes: AssessmentNotes = {
    assessmentId: 0, questionId: 1, notes: " "
  };
  answerNote: AssessmentAnswerResponse = {questionId: 1, answer: ' '};

  answerResponse1: Observable<AssessmentStructure>
  answerResponse: AssessmentStructure

  ngOnInit() {
    this.answerResponse1.subscribe(data => {
      if (data !== undefined) {
        this.answerResponse = data
        this.assessmentStatus = data.assessmentStatus
      }
    })

    this.note.valueChanges.pipe(
      debounceTime(DEBOUNCE_TIME)
    ).subscribe({
      next: value => {
        this.assessmentNotes.assessmentId = this.assessmentId
        this.assessmentNotes.questionId = this.questionDetails.questionId
        this.answerNote.questionId = this.questionDetails.questionId
        if (value !== "") {
          this.assessmentNotes.notes = value
          this.answerNote.answer = value
        }
        this.appService.saveNotes(this.assessmentNotes).subscribe((_data) => {
          assessmentData.push(this.assessmentNotes);
        })
        this.sendAnswer(this.answerNote);
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
}
