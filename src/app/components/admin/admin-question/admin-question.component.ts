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
import {Question as ContributorQuestion} from "../../../types/Contributor/Question";
import {QuestionRequest} from "../../../types/Admin/questionRequest";
import {QuestionResponse} from "../../../types/Admin/questionResponse";
import {ParameterStructure} from "../../../types/parameterStructure";
import {ParameterData} from "../../../types/ParameterData";
import {ContributorData} from "../../../types/Contributor/ContributorData";
import {ReviewDialogComponent} from "../../contributor/review-dialog/review-dialog.component";
import {PopupConfirmationComponent} from "../../popup-confirmation/popup-confirmation.component";

const NOTIFICATION_DURATION = 2000;

export interface ColorScheme {
  borderColor: string
  backgroundColor: string
  displayText: string
}

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
  questionStatusMap = new Map<string, Question[]>()
  masterData: Observable<CategoryResponse[]>
  categoryResponse: CategoryResponse[]
  unsavedChanges: QuestionStructure[] | undefined
  unsavedQuestion: QuestionStructure
  private destroy$: Subject<void> = new Subject<void>();
  colorScheme = new Map<string, ColorScheme>()
  publishedColorScheme: ColorScheme = {
    borderColor: '#6B9F78',
    backgroundColor: '#e8f8ec',
    displayText: 'All published questions'
  }
  sentForReviewColorScheme: ColorScheme = {
    borderColor: '#BE873E',
    backgroundColor: '#BE873E0D',
    displayText: 'Sent for Review'
  }
  rejectedColorScheme: ColorScheme = {borderColor: '#BD4257', backgroundColor: '#BD425715', displayText: 'Rejected'}
  draftColorScheme: ColorScheme = {borderColor: '#5D9EAA', backgroundColor: '#5D9EAA0D', displayText: 'Draft'}
  contributor: string = data_local.CONTRIBUTOR.CONTRIBUTOR;
  sentForReview: string = data_local.CONTRIBUTOR.STATUS.SENT_FOR_REVIEW;
  published: string = data_local.CONTRIBUTOR.STATUS.PUBLISHED;
  private author: string = data_local.CONTRIBUTOR.ROLE.AUTHOR;
  private confirmationTitle: string = data_local.CONTRIBUTOR.CONFIRMATION_POPUP_TEXT;
  serverError: string = data_local.SHOW_ERROR_MESSAGE.POPUP_ERROR


  constructor(private store: Store<AppStates>, private appService: AppServiceService, private _snackBar: MatSnackBar, public dialog: MatDialog) {
    this.masterData = this.store.select((storeMap) => storeMap.masterData.masterData)
  }

  ngOnInit(): void {
    this.colorScheme.set('Published', this.publishedColorScheme)
    this.colorScheme.set('Sent_For_Review', this.sentForReviewColorScheme)
    this.colorScheme.set('Rejected', this.rejectedColorScheme)
    this.colorScheme.set('Draft', this.draftColorScheme)

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
    this.addQuestionToMap(newQuestion)
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
    this.questionStatusMap.forEach((value, key) => {
      let index = value.findIndex((eachQuestion: Question) => eachQuestion.questionId === -1)
      if (index !== -1 && index !== undefined)
        this.questionStatusMap.get(key)?.splice(index, 1)
      this.deleteFromMap(key);
    })
  }

  private deleteFromMap(status: string | undefined) {
    if (status !== undefined) {
      if (this.questionStatusMap.get(status)?.length === 0)
        this.questionStatusMap.delete(status)
    }
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
      questionId: question.questionId,
      status: question.status
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
    } else {
      this.updateQuestionArray(questions, data, question);
    }
    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categoryResponse}))
  }

  private updateQuestionArray(questions: QuestionStructure[], data: QuestionStructure, question: QuestionResponse) {
    let index: number = questions.findIndex(eachQuestion => eachQuestion.questionId === data.questionId)
    if (index !== -1)
      questions.splice(index, 1, data)
    else
      questions?.push(question)
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
      this.addQuestionToMap(eachQuestion);
    })
  }

  private addQuestionToMap(question: Question) {
    if (question.status !== undefined) {
      if (this.questionStatusMap.has(question?.status)) {
        this.questionStatusMap.get(question?.status)?.unshift(question)
      } else {
        let questionArr = []
        questionArr.unshift(question)
        this.questionStatusMap.set(question?.status, questionArr)
      }
    }
  }

  sendForReview(question: Question) {
    let questionRequest = this.getContributorQuestion(question);
    let contributorData: ContributorData = this.getContributorData(questionRequest)
    this.openReviewDialog(questionRequest, contributorData);
  }

  private getContributorQuestion(question: Question) {
    let questionRequest: ContributorQuestion[] = []
    let contributorQuestion: ContributorQuestion = {
      comments: "", question: question.questionText, questionId: question.questionId, status: question.status
    }
    questionRequest.push(contributorQuestion)
    return questionRequest;
  }

  private getContributorData(questions: ContributorQuestion[]): ContributorData {
    return {
      categoryId: this.category,
      categoryName: this.parameter.categoryName,
      moduleId: this.module,
      moduleName: this.parameter.moduleName,
      parameterId: this.parameter.parameterId,
      parameterName: this.parameter.parameterName,
      questions: questions,
      topicId: this.parameter.topicId,
      topicName: this.parameter.topicName

    };
  }

  private openReviewDialog(questionRequest: ContributorQuestion[], data: ContributorData) {
    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      panelClass: 'review-dialog',
      data: {
        role: this.author.toLowerCase(),
        question: questionRequest,
        moduleId: data.moduleId,
      }
    });
    dialogRef.componentInstance.onSave.subscribe(response => {
      this.updateQuestionStatusMap(data.questions[0])
      this.deleteFromMap(data.questions[0].status)
      let question: QuestionStructure = {
        parameter: data.parameterId,
        questionId: response.questionId[0],
        questionText: data.questions[0].question,
        status: response.status
      }
      this.sendToStore(question)
      let updatedQuestion: Question = question
      this.addQuestionToMap(updatedQuestion)
      updatedQuestion.isEdit = false

    })
    dialogRef.afterClosed();
  }

  private updateQuestionStatusMap(question: ContributorQuestion) {
    if (question.status !== undefined) {
      let index: number | undefined = this.questionStatusMap.get(question.status)?.findIndex(eachQuestion => eachQuestion.questionId === question.questionId)
      if (index !== undefined && index !== -1)
        this.questionStatusMap.get(question.status)?.splice(index, 1)
    }
  }

  deleteQuestion(question: Question) {
    let contributorQuestion = this.getContributorQuestion(question)
    let response: QuestionStructure = question
    const openConfirm = this.dialog.open(PopupConfirmationComponent, {
      width: '448px',
      height: '203px'
    });
    openConfirm.componentInstance.text = this.confirmationTitle;
    openConfirm.afterClosed().subscribe(result => {
      if (result === 1) {
        this.appService.deleteQuestion(question.questionId).subscribe({
          next: () => {
            this.deleteFromStore(response)
            this.updateQuestionStatusMap(contributorQuestion[0])
            this.deleteFromMap(question.status)

          },
          error: () => {
            this.showError(this.serverError)
          }
        })
      }
    })

  }

  private deleteFromStore(question: QuestionStructure) {
    let questions = this.getQuestionsFromParameter()
    if(questions !== undefined){
      let index: number = questions.findIndex(eachQuestion => eachQuestion.questionId === question.questionId)
      if (index !== -1)
        questions.splice(index, 1)
    }
    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categoryResponse}))

  }
}


