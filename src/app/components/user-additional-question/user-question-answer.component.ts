import {Component, Input} from '@angular/core';
import {UserQuestion} from "../../types/UserQuestion";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {data_local} from "../../messages";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-user-question-answer',
  templateUrl: './user-question-answer.component.html',
  styleUrls: ['./user-question-answer.component.css']
})
export class UserQuestionAnswerComponent {

  @Input()
  additionalQuestionCount: number;

  @Input()
  parameterId: number

  @Input()
  assessmentId: number

  @Input()
  userQuestionList: UserQuestion[]

  @Input()
  parameterIndex: number

  @Input()
  questionIndex: number

  questionText: string;

  userQuestion: UserQuestion = {
    question: ""
  }
  createQuestionFlag: boolean = false;


  private destroy$: Subject<void> = new Subject<void>();

  constructor(private appService: AppServiceService) {
  }

  questionLabel = data_local.ASSESSMENT_QUESTION_FIELD.LABEL;
  inputWarningLabel = data_local.LEGAL_WARNING_MSG_FOR_INPUT;

  saveQuestion() {
    this.userQuestion.question = this.questionText;
    this.appService.saveUserQuestion(this.userQuestion, this.assessmentId, this.parameterId).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.createQuestionFlag = false;
    })

  }

  generateQuestion() {
    this.additionalQuestionCount += 1;
    this.createQuestionFlag = true
  }

  removeQuestion() {
    this.createQuestionFlag = false
    this.additionalQuestionCount -= 1
  }

  deleteUserQuestion(questionId: any) {
    this.appService.deleteUserQuestion(this.assessmentId,questionId).pipe(takeUntil(this.destroy$)).subscribe(() => {
    })

  }


}
