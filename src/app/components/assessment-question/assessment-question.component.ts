import {Component, Input} from '@angular/core';
/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */
import {Notes} from "../../types/answerRequest";
import {ControlContainer, NgForm} from "@angular/forms";
import {QuestionStructure} from "../../types/questionStructure";


export const assessmentData = [{}]


@Component({
  selector: 'app-assessment-question',
  templateUrl: './assessment-question.component.html',
  styleUrls: ['./assessment-question.component.css']
})

export class AssessmentQuestionComponent {
  @Input()
  questionDetails: QuestionStructure;
  @Input()
  assessmentStatus: string;
  @Input()
  answerInput: Notes;
  @Input()
  initial: number
  textarea: number = 0;

}

