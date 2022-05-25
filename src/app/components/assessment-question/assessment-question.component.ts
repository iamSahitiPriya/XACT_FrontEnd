import {Component, Input} from '@angular/core';
/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */
import {ParameterStructure} from "../../types/parameterStructure";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {Notes} from "../../types/notes";
import {ControlContainer, FormControl, NgForm} from "@angular/forms";


export const assessmentData = [{}]


@Component({
  selector: 'app-assessment-question',
  templateUrl: './assessment-question.component.html',
  styleUrls: ['./assessment-question.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})

export class AssessmentQuestionComponent{
  @Input()
  parameterDetails: ParameterStructure;
  @Input()
  notes: Notes[];
  @Input()
  initial: number
  textarea: number = 0;
  assessmentAnswerText: FormControl;
  constructor(private appService: AppServiceService) {
  }

  handleCancel() {
    this.notes.forEach((note) => {
        note.answer = "";
      }
    );
  }

  getAnswer(questionId: number): Notes {
    const note = this.notes.find(function (el) {
      return el.questionId === questionId;
    })
    if (note != null) {
      return note
    } else {
      const newNote = {questionId: questionId}
      this.notes.push(newNote)
      return newNote
    }
  }
}

