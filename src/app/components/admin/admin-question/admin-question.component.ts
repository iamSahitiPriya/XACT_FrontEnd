import {Component, Input, OnInit} from '@angular/core';
import {AppStates} from "../../../reducers/app.states";
import {Store} from "@ngrx/store";
import {Observable, Subject, takeUntil} from "rxjs";
import {CategoryResponse} from "../../../types/categoryResponse";
import {QuestionStructure} from "../../../types/questionStructure";
import {data_local} from "../../../messages";
import {cloneDeep} from "lodash";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {NotificationSnackbarComponent} from "../../notification-component/notification-component.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import * as fromActions from "../../../actions/assessment-data.actions";
import {MatDialog} from "@angular/material/dialog";
import {Question} from "../../../types/Admin/question";
import {QuestionRequest} from "../../../types/Admin/questionRequest";
import {QuestionResponse} from "../../../types/Admin/questionResponse";
import {ParameterStructure} from "../../../types/parameterStructure";
import {ParameterData} from "../../../types/ParameterData";

const NOTIFICATION_DURATION = 2000;

@Component({
  selector: 'app-admin-question',
  templateUrl: './admin-question.component.html',
  styleUrls: ['./admin-question.component.css']
})
export class AdminQuestionComponent implements OnInit {
  @Input() topic: number;
  @Input() category: number
  @Input() module: number
  @Input() parameter: ParameterData
  @Input() type: string

  closeToolTip = data_local.ASSESSMENT.CLOSE.TOOLTIP_MESSAGE;
  header = data_local.ADMIN.REFERENCES.HEADER
  scoreCard = data_local.ADMIN.REFERENCES.SCORE_CARD
  addMaturityReference = data_local.ADMIN.REFERENCES.ADD_REFERENCE_BUTTON
  inputErrorMessage = data_local.ADMIN.INPUT_ERROR_MESSAGE
  save = data_local.ADMIN.SAVE
  update = data_local.ADMIN.UPDATE
  edit = data_local.ADMIN.EDIT
  addQuestion = data_local.ADMIN.QUESTION.ADD_QUESTION
  questionText = data_local.ADMIN.QUESTION.QUESTION
  questions = data_local.ADMIN.QUESTION.QUESTIONS
  requiredField = data_local.ADMIN.QUESTION.REQUIRED_FIELD
  topicReferenceMessage = data_local.ADMIN.REFERENCES.TOPIC_REFERENCE_MESSAGE
  dataNotSaved = data_local.ADMIN.REFERENCES.DATA_NOT_SAVED
  questionArray: Question[] | undefined
  questionStatusMap = new Map()
  masterData: Observable<CategoryResponse[]>
  categoryResponse: CategoryResponse[]
  unsavedChanges: QuestionStructure[] | undefined
  unsavedQuestion: QuestionStructure
  private destroy$: Subject<void> = new Subject<void>();
  colorScheme = new Map()

  constructor(private store: Store<AppStates>, private appService: AppServiceService, private _snackBar: MatSnackBar, public dialog: MatDialog) {
    this.masterData = this.store.select((storeMap) => storeMap.masterData.masterData)
  }

  ngOnInit(): void {
    this.colorScheme.set('Published', ['#5D9EAA', '#5D9EAA0D', 'All published questions'])
    this.colorScheme.set('Sent_For_Review', ['#BE873E', '#BE873E0D', 'Sent for Review'])
    this.colorScheme.set('Rejected', ['#BD4257', '#BD425715', 'Rejected'])
    this.colorScheme.set('Draft', ['#5D9EAA', '#5D9EAA0D', 'Draft'])

    this.questionArray = []
    this.unsavedChanges = []
    this.questionStatusMap.clear()
    this.masterData.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data !== undefined) {
        this.categoryResponse = data
        this.setParameterQuestion()
        this.formatData()
        this.unsavedChanges = cloneDeep(this.getQuestionsFromParameter())
      }
    })
  }

  addQuestionRow() {
    this.deleteUnsavedQuestion()
    let newQuestion: Question = {
      questionId: -1,
      questionText: '',
      status: 'Draft',
      parameter: this.parameter.parameterId,
      isEdit: true
    }
    this.questionStatusMap.get("Draft").unshift(newQuestion)
  }

  getQuestionsFromParameter(): QuestionStructure[] | undefined {
    return this.categoryResponse.find(category => category.categoryId === this.category)?.modules.find(module => module.moduleId === this.module)?.topics
      .find(topic => topic.topicId === this.topic)?.parameters
      .find(parameter => parameter.parameterId === this.parameter.parameterId)?.questions
  }

  setIsEdit(question: Question) {
    this.questionArray = []
    this.setParameterQuestion()
    this.resetPreviousChanges()
    question.isEdit = !question.isEdit
    this.unsavedQuestion = cloneDeep(question)
  }

  private setParameterQuestion() {
    this.questionArray = []
    let questions = this.getQuestionsFromParameter()
    if (questions !== undefined) {
      questions?.forEach(question => {
        let eachQuestion: Question = question
        eachQuestion.isEdit = false
        this.questionArray?.unshift(eachQuestion)
      })
    }
  }

  saveQuestion(question: Question) {
    if (question.questionText.trimStart().length > 0) {
      let questionRequest: QuestionRequest = this.getQuestionRequest(question)
      this.appService.saveMasterQuestion(questionRequest).pipe(takeUntil(this.destroy$)).subscribe({
        next: (data) => {
          question.isEdit = false
          question.questionId = data.questionId
          this.sendToStore(data)
          this.ngOnInit()
        }, error: _error => {
          this.showError(this.dataNotSaved);
        }
      })
    }
  }

  deleteUnsavedQuestion() {
    let index = this.questionArray?.findIndex((eachQuestion: { questionId: number; }) => eachQuestion.questionId === -1)
    if (index !== -1 && index !== undefined)
      this.questionArray?.splice(index, 1)
  }

  cancelChanges(question: Question) {
    question.questionText = this.unsavedQuestion.questionText
    question.questionId = this.unsavedQuestion.questionId
    question.parameter = this.unsavedQuestion.parameter
    question.isEdit = false

  }

  showError(message: string) {
    this._snackBar.openFromComponent(NotificationSnackbarComponent, {
      data: {message: message, iconType: "error_outline", notificationType: "Error:"}, panelClass: ['error-snackBar'],
      duration: NOTIFICATION_DURATION,
      verticalPosition: "top",
      horizontalPosition: "center"
    })
  }

  updateQuestion(question: Question) {
    let questionRequest: QuestionResponse = this.getQuestionRequestWithId(question)
    this.appService.updateMasterQuestion(question.questionId, questionRequest).pipe(takeUntil(this.destroy$)).subscribe({
      next: (_data) => {
        question.isEdit = false
        this.questionArray = []
        this.ngOnInit()
      }, error: _error => {
        this.showError(this.dataNotSaved);
      }
    })
  }

  private getQuestionRequestWithId(question: Question | QuestionStructure): QuestionResponse {
    return {
      questionText: question.questionText,
      parameter: this.parameter.parameterId,
      questionId: question.questionId
    }
  }

  getQuestionRequest(question: Question): QuestionRequest {
    return {
      questionText: question.questionText,
      parameter: this.parameter.parameterId
    }
  }

  private sendToStore(data: QuestionStructure) {
    let question: QuestionResponse = this.getQuestionRequestWithId(data)
    let questions = this.getQuestionsFromParameter()
    if (questions === undefined) {
      let parameter: ParameterStructure | undefined = this.getParameter()
      if (parameter) {
        parameter.questions = []
        parameter.questions.push(question)
      }
    } else
      questions?.push(question)
    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categoryResponse}))
  }

  resetPreviousChanges() {
    this.questionArray?.forEach((eachQuestion) => {
      if (!eachQuestion.isEdit) {
        let question = this.unsavedChanges?.find((eachUnsavedQuestion: { questionId: number; }) => eachQuestion.questionId === eachUnsavedQuestion.questionId)
        if (question) eachQuestion.questionText = question?.questionText
      }
    })
  }

  close() {
    this.resetUnsavedChanges()
    this.closePopUp()
  }

  private closePopUp() {
    this.dialog.closeAll();
  }

  private resetUnsavedChanges() {
    let questions = this.getQuestionsFromParameter()
    questions?.splice(0, questions.length)
    this.unsavedChanges?.forEach((eachQuestion: QuestionStructure) => questions?.push(eachQuestion))
    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categoryResponse}))

  }

  isInputValid(question: string): boolean {
    let newQuestion: string = question;
    if (newQuestion.length !== 0) newQuestion = newQuestion.trim()
    return (newQuestion.length === 0)
  }

  private getParameter(): ParameterStructure | undefined {
    return this.categoryResponse.find(category => category.categoryId === this.category)?.modules.find(module => module.moduleId === this.module)?.topics
      .find(topic => topic.topicId === this.topic)?.parameters
      .find(parameter => parameter.parameterId === this.parameter.parameterId)
  }

  private formatData() {
    this.questionArray?.forEach(eachQuestion => {
      if (this.questionStatusMap.has(eachQuestion.status)) {
        this.questionStatusMap.get(eachQuestion.status).push(eachQuestion)
      } else {
        let questionArr = []
        questionArr.push(eachQuestion)
        this.questionStatusMap.set(eachQuestion.status, questionArr)
      }
    })
  }
}


