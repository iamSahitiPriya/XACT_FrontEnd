import {Component, Input} from '@angular/core';
/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */
import {ParameterStructure} from "../../types/parameterStructure";
import {Notes} from "../../types/answerRequest";
import {ControlContainer, NgForm} from "@angular/forms";
import {ParameterRequest} from "../../types/parameterRequest";


export const assessmentData = [{}]


@Component({
  selector: 'app-assessment-question',
  templateUrl: './assessment-question.component.html',
  styleUrls: ['./assessment-question.component.css'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})

export class AssessmentQuestionComponent {
  @Input()
  parameterDetails: ParameterStructure;

  @Input()
  parameterRequest: ParameterRequest;
  @Input()
  initial: number
  textarea: number = 0;



  getAnswer(questionId: number): Notes {

    const note = this.parameterRequest.answerRequest.find(function (el) {
      return el.questionId === questionId
    })
    if (note != null) {
      return note
    } else {
      const newNote = {questionId: questionId}
      this.parameterRequest.answerRequest.push(newNote)
      return newNote;
    }

  }

}

