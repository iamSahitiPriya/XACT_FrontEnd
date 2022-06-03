import {Component, Input} from '@angular/core';
/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */
import {ParameterStructure} from "../../types/parameterStructure";
import {Notes} from "../../types/answerRequest";
import {ControlContainer, FormControl, NgForm} from "@angular/forms";
import {ParameterRequest} from "../../types/parameterRequest";
import {QuestionStructure} from "../../types/questionStructure";


export const assessmentData = [{}]


@Component({
  selector: 'app-assessment-question',
  templateUrl: './assessment-question.component.html',
  styleUrls: ['./assessment-question.component.css'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})

export class AssessmentQuestionComponent {
  @Input()
  questionDetails: QuestionStructure;

  @Input()
  answerInput: Notes;
  @Input()
  initial: number
  textarea: number = 0;
  assessmentAnswerText: FormControl;


  // getAnswer(questionId: number): Notes {
  //
  //   const note = this.answerInput.find(function (el) {
  //     return el.questionId === questionId
  //   })
  //   if (note != null) {
  //     console.log(note)
  //     return note
  //   } else {
  //     const newNote = {questionId: questionId}
  //     this.answerInput.push(newNote)
  //     return newNote;
  //   }
  // }

}

