import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {ParameterStructure} from "../../types/parameterStructure";
import {Notes} from "../../types/notes";
import {AppServiceService} from "../../services/app-service/app-service.service";

export const assessmentData = [{}]


@Component({
  selector: 'app-assessment-question',
  templateUrl: './assessment-question.component.html',
  styleUrls: ['./assessment-question.component.css']
})
export class AssessmentQuestionComponent {
  @Input()
  parameterDetails: ParameterStructure;

  @Input()
  notes: Notes[];

  @Input()
  initial: number
  textarea: string;

  constructor(private appService: AppServiceService) {
  }

  handleCancel() {
    this.notes.forEach((note) => {
        note.answer = "";
      }
    );
  }

  @ViewChild('textAreaElement') textAreaElement: ElementRef;


  saveAnswer() {
    console.log(this.notes)
    // const answerRequest: AnswerRequest = {
    //   notes: this.notes};
    //
    // this.appService.saveAssessment(answerRequest).subscribe((_data) => {
    //   assessmentData.push(answerRequest);
    //   window.location.reload() }
    // )
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

