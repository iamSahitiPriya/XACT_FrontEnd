import {Component, Input} from '@angular/core';
/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */
import {ParameterStructure} from "../../types/parameterStructure";
import {Notes} from "../../types/answerRequest";
import {ControlContainer, NgForm} from "@angular/forms";
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

}

