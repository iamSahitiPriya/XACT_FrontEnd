import {Component, Input, OnInit, Optional} from '@angular/core';
import {ParameterRatingAndRecommendation} from "../../types/parameterRatingAndRecommendation";
import {UserQuestion} from "../../types/UserQuestion";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {UntypedFormBuilder} from "@angular/forms";
import {Store} from "@ngrx/store";
import {AssessmentState} from "../../reducers/app.states";
import * as fromReducer from "../../reducers/assessment.reducer";

@Component({
  selector: 'app-user-question-answer',
  templateUrl: './user-question-answer.component.html',
  styleUrls: ['./user-question-answer.component.css']
})
export class UserQuestionAnswerComponent {

  @Input()
  valuen: number;

  @Input()
  parameterId : number

  @Input()
  assessmentId : number

  @Input()
  parameterRatingAndRecommendation:ParameterRatingAndRecommendation

  @Input()
  parameterIndex:number

  @Input()
  questionIndex: number

  questionText:string;

  userQuestion:UserQuestion = {
    question: ""
  }
  flag: boolean = false;
  constructor(private appService: AppServiceService) {
  }

  saveQuestion() {
    this.userQuestion.question =this.questionText;
    this.appService.saveUserQuestion(this.userQuestion,this.assessmentId,this.parameterId).subscribe(() => {
      this.flag= false;
    })

  }

  generateQuestion() {
    this.valuen+=1;
    this.flag =true
  }
}
