import {Component, Input, OnInit} from '@angular/core';
/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */
import {Notes} from "../../types/answerRequest";
import {QuestionStructure} from "../../types/questionStructure";
import {Store} from "@ngrx/store";
import {AssessmentState} from "../../reducers/app.states";
import {Observable} from "rxjs";
import {AssessmentStructure} from "../../types/assessmentStructure";
import * as fromReducer from "../../reducers/assessment.reducer";
import {AssessmentAnswerResponse} from "../../types/AssessmentAnswerResponse";


export const assessmentData = [{}]


@Component({
  selector: 'app-assessment-question',
  templateUrl: './assessment-question.component.html',
  styleUrls: ['./assessment-question.component.css']
})

export class AssessmentQuestionComponent implements OnInit{
  @Input()
  questionDetails: QuestionStructure;

  assessmentStatus: string;
  @Input()
  answerInput: Notes;
  @Input()
  initial: number
  textarea: number = 0;
  answerResponse1: Observable<AssessmentStructure>
  answerResponse:AssessmentStructure

  constructor(private store:Store<AssessmentState>) {
    this.answerResponse1 = this.store.select(fromReducer.getAssessments)

  }
  ngOnInit(): void {
    this.answerResponse1.subscribe(data =>{
      if(data !== undefined) {
        this.answerResponse = data
        this.assessmentStatus = data.assessmentStatus
      }
    })
  }


}

