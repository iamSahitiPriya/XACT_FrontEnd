import {Component, Input, OnInit} from '@angular/core';
import {UserQuestion} from "../../types/UserQuestion";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {data_local} from "../../messages";
import {Observable, Subject, takeUntil} from "rxjs";
import {AssessmentStructure} from "../../types/assessmentStructure";
import {UntypedFormBuilder} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Store} from "@ngrx/store";
import {AssessmentState} from "../../reducers/app.states";
import * as fromReducer from "../../reducers/assessment.reducer";
import {UserQuestionResponse} from "../../types/userQuestionResponse";
import * as fromActions from "../../actions/assessment-data.actions";
let assessmentData = [{}]
@Component({
  selector: 'app-user-question-answer',
  templateUrl: './user-question-answer.component.html',
  styleUrls: ['./user-question-answer.component.css']
})
export class UserQuestionAnswerComponent implements OnInit{

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
  assessmentStatus: string;


  questionEditFlag:number;

  userQuestion: UserQuestion = {
    question: ""
  }
  userQuestionResponse : UserQuestionResponse = {
    questionId :-1,
    parameterId:-1,
    question:"",
    answer:""
  }
  createQuestionFlag: boolean = false;


  answerResponse1: Observable<AssessmentStructure>
  answerResponse: AssessmentStructure


  errorMessagePopUp = data_local.SHOW_ERROR_MESSAGE.POPUP_ERROR;
  menuMessageError = data_local.SHOW_ERROR_MESSAGE.MENU_ERROR;
  private destroy$: Subject<void> = new Subject<void>();
  constructor(private appService: AppServiceService, private _fb: UntypedFormBuilder, private _snackBar: MatSnackBar, private store: Store<AssessmentState>) {
    this.answerResponse1 = this.store.select(fromReducer.getAssessments)

  }
  ngOnInit() {
    this.answerResponse1.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data !== undefined) {
        this.answerResponse = data
        this.assessmentStatus = data.assessmentStatus
      }
    })
  }

  private cloneAnswerResponse: AssessmentStructure;
  private cloneAnswerResponse1: AssessmentStructure;


  questionLabel = data_local.ASSESSMENT_QUESTION_FIELD.LABEL;
  inputWarningLabel = data_local.LEGAL_WARNING_MSG_FOR_INPUT;

  saveQuestion() {
    this.userQuestion.question = this.questionText;
    this.appService.saveUserQuestion(this.userQuestion, this.assessmentId, this.parameterId).pipe(takeUntil(this.destroy$)).subscribe({
        next: (_data) => {
          assessmentData.push(this.userQuestion);
          this.createQuestionFlag = false;
          this.userQuestionResponse = _data;
          this.sendAnswer(this.userQuestionResponse)
          this.updateDataSavedStatus()
          this.questionText = ""
          this.userQuestionList.push(this.userQuestionResponse)

        }, error: _error => {
          // this.showError("Data cannot be saved");
        }
      }
    )

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
      this.userQuestionList = this.userQuestionList.filter(eachQuestion => eachQuestion.questionId !== questionId)
      this.cloneAnswerResponse = Object.assign({}, this.answerResponse)

      this.cloneAnswerResponse.userQuestionResponseList = this.cloneAnswerResponse.userQuestionResponseList.filter(eachQuestion => eachQuestion.questionId !== questionId)

      this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneAnswerResponse}))

      this.updateDataSavedStatus();
      this.additionalQuestionCount-=1
    })
  }


  editQuestionFlag(questionId: any) {
    this.questionEditFlag = questionId
  }

  updateQuestion(userQuestion: UserQuestion) {
    this.questionEditFlag = 0;
    this.appService.saveUserQuestion(userQuestion, this.assessmentId, this.parameterId).pipe(takeUntil(this.destroy$)).subscribe({
        // this.createQuestionFlag = false;
        next: (_data) => {
          assessmentData.push(this.userQuestion);
          this.createQuestionFlag = false;
          this.userQuestionResponse = _data;
          this.sendAnswer(this.userQuestionResponse)
          this.updateDataSavedStatus()
          this.questionText = ""
        }, error: _error => {
          // this.showError("Data cannot be saved");
        }
      }
      )
  }

  private sendAnswer(userQuestion: UserQuestionResponse) {
    let index = 0;
    let updatedUserQuestionAnswerList = [];
    updatedUserQuestionAnswerList.push(userQuestion);
    this.cloneAnswerResponse = Object.assign({}, this.answerResponse)
    if (this.cloneAnswerResponse.userQuestionResponseList != undefined) {
      index = this.cloneAnswerResponse.userQuestionResponseList.findIndex(eachQuestion => eachQuestion.questionId === userQuestion.questionId)
      if (index !== -1) {
        if (userQuestion.question != null) {
          this.cloneAnswerResponse.userQuestionResponseList[index].question = userQuestion.question
        }
      }
      else {
        this.cloneAnswerResponse.userQuestionResponseList.push(userQuestion)
      }
    } else {
      this.cloneAnswerResponse.userQuestionResponseList = updatedUserQuestionAnswerList
    }
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneAnswerResponse}))
  }

  private updateDataSavedStatus() {
    this.cloneAnswerResponse1 = Object.assign({}, this.answerResponse)
    this.cloneAnswerResponse1.updatedAt = Number(new Date(Date.now()))
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneAnswerResponse1}))
  }
}
