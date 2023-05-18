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
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
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
  @Input() role: string

  closeToolTip = data_local.ASSESSMENT.CLOSE.TOOLTIP_MESSAGE;
  header = data_local.ADMIN.REFERENCES.HEADER
  scoreCard = data_local.ADMIN.REFERENCES.SCORE_CARD
  addMaturityReference = data_local.ADMIN.REFERENCES.ADD_REFERENCE_BUTTON
  inputErrorMessage = data_local.ADMIN.INPUT_ERROR_MESSAGE
  save = data_local.ADMIN.SAVE
  update = data_local.ADMIN.UPDATE
  edit = data_local.ADMIN.EDIT
  addQuestionText = data_local.ADMIN.QUESTION.ADD_QUESTION
  questionText = data_local.ADMIN.QUESTION.QUESTION
  questions = data_local.ADMIN.QUESTION.QUESTIONS
  requiredField = data_local.ADMIN.QUESTION.REQUIRED_FIELD
  topicReferenceMessage = data_local.ADMIN.REFERENCES.TOPIC_REFERENCE_MESSAGE
  sendForReassessment: string = data_local.CONTRIBUTOR.STATUS.DISPLAY_TEXT.SEND_FOR_REASSESSMENT
  requestedForChange: string = data_local.CONTRIBUTOR.STATUS.REQUESTED_FOR_CHANGE
  dataNotSaved = data_local.ADMIN.REFERENCES.DATA_NOT_SAVED
  questionArray: Question[] | undefined
  questionStatusMapper = new Map<string, Question[]>()
  masterData: Observable<CategoryResponse[]>
  categoryResponse: CategoryResponse[]
  unsavedChanges: QuestionStructure[] | undefined
  unsavedQuestion: QuestionStructure
  private destroy$: Subject<void> = new Subject<void>();
  contributor: string = data_local.CONTRIBUTOR.CONTRIBUTOR;
  sentForReview: string = data_local.CONTRIBUTOR.STATUS.SENT_FOR_REVIEW;
  published: string = data_local.CONTRIBUTOR.STATUS.PUBLISHED;
  rejected: string = data_local.CONTRIBUTOR.STATUS.REJECTED;
  draft: string = data_local.CONTRIBUTOR.STATUS.DRAFT;
  author: string = data_local.CONTRIBUTOR.ROLE.AUTHOR;
  private confirmationTitle: string = data_local.CONTRIBUTOR.CONFIRMATION_POPUP_TEXT;
  serverError: string = data_local.SHOW_ERROR_MESSAGE.POPUP_ERROR
  sentForReviewText: string = data_local.CONTRIBUTOR.STATUS.DISPLAY_TEXT.SENT_FOR_REVIEW;
  private publishedQuestions: string = data_local.CONTRIBUTOR.STATUS.DISPLAY_TEXT.PUBLISHED_QUESTIONS;
  private rejectedQuestions: string = data_local.CONTRIBUTOR.STATUS.DISPLAY_TEXT.REJECTED;
  private draftedQuestions: string = data_local.CONTRIBUTOR.STATUS.DISPLAY_TEXT.DRAFT;
  sendForReviewText: string = data_local.CONTRIBUTOR.AUTHOR.SEND_FOR_REVIEW;
  changeRequests = data_local.CONTRIBUTOR.STATUS.DISPLAY_TEXT.CHANGE_REQUESTS;
  private approveConfirmationTitle: string = data_local.CONTRIBUTOR.APPROVE_QUESTION_CONFIRMATION_POPUP_TEXT
  createSuccessMessage: string = data_local.CONTRIBUTOR.NOTIFICATION_MESSAGES.CREATE
  updateSuccessMessage: string = data_local.CONTRIBUTOR.NOTIFICATION_MESSAGES.UPDATE
  approveSuccessMessage: string = data_local.CONTRIBUTOR.NOTIFICATION_MESSAGES.APPROVE

  defaultQuestionId: number = -1;
  statusMapper = {
    'REJECTED': {
      borderColor: '#BD4257',
      backgroundColor: '#BD425715',
      displayText: this.rejectedQuestions
    },
    'DRAFT': {
      borderColor: '#5D9EAA',
      backgroundColor: '#5D9EAA0D',
      displayText: this.draftedQuestions
    },
    'REQUESTED_FOR_CHANGE': {
      borderColor: '#BE873E',
      backgroundColor: '#BE873E0D',
      displayText: this.changeRequests
    },
    'PUBLISHED': {
      borderColor: '#6B9F78',
      backgroundColor: '#e8f8ec',
      displayText: this.publishedQuestions
    }
  }
  statusStyleMapper = new Map(Object.entries(this.statusMapper))
  action: string;
  contributorActionButtonText: string;
  admin: string = data_local.ADMIN.ROLE.ADMIN;
  reviewer: string = data_local.CONTRIBUTOR.ROLE.REVIEWER;
  approve: string = data_local.CONTRIBUTOR.STATUS.HOVER_TEXT.APPROVE;
  reject: string = data_local.CONTRIBUTOR.STATUS.HOVER_TEXT.REJECT;
  inProgress: string = data_local.CONTRIBUTOR.STATUS.DISPLAY_TEXT.IN_PROGRESS;
  private dialogRef: MatDialogRef<any>;
  private referenceErrorMessage: string =data_local.CONTRIBUTOR.REFERENCE_ERROR_MESSAGE;



  constructor(private store: Store<AppStates>, private appService: AppServiceService, private _snackBar: MatSnackBar, public dialog: MatDialog) {
    this.masterData = this.store.select((storeMap) => storeMap.masterData.masterData)
  }

  ngOnInit(): void {
    this.setActionByContributorType();
    this.questionArray = []
    this.unsavedChanges = []
    this.questionStatusMapper.clear()
    this.masterData.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data !== undefined) {
        this.categoryResponse = data
        this.setParameterQuestion()
        this.formatData()
        this.unsavedChanges = cloneDeep(this.getQuestionsFromParameter())
      }
    })
  }


  private setActionByContributorType() {
    if (this.role === this.author || this.role === 'contributor') {
      this.contributorActionButtonText = this.sendForReviewText
      this.action = this.sentForReview;
      this.statusStyleMapper.set(this.sentForReview, {
        borderColor: '#BE873E',
        backgroundColor: '#BE873E0D',
        displayText: this.sentForReviewText
      })
    } else if (this.role === this.reviewer) {
      this.contributorActionButtonText = this.sendForReassessment
      this.action = this.requestedForChange
      this.statusStyleMapper.set(this.sentForReview, {
        borderColor: '#BE873E',
        backgroundColor: '#BE873E0D',
        displayText: this.inProgress
      })
    }
  }

  addQuestion() {
    this.removeQuestion()
    let newQuestion: Question = {
      questionId: -1,
      questionText: '',
      status: this.draft,
      parameter: this.parameter.parameterId,
      isEdit: true,
      isReferenceOpened : false,
      references : this.hasQuestionReference() ? [] : undefined,
    }
    this.mapQuestionToStatus(newQuestion)
  }

  getQuestionsFromParameter(): QuestionStructure[] | undefined {
    return this.categoryResponse.find(category => category.categoryId === this.category)?.modules.find(module => module.moduleId === this.module)?.topics
      .find(topic => topic.topicId === this.topic)?.parameters
      .find(parameter => parameter.parameterId === this.parameter.parameterId)?.questions
  }

  setIsEdit(question: Question) {
    this.questionArray = []
    this.setParameterQuestion()
    this.resetChanges()
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
        eachQuestion.isReferenceOpened = false
        eachQuestion.references = this.hasQuestionReference() ? question.references : undefined
        this.questionArray?.unshift(eachQuestion)
      })
    }
  }

  saveQuestion(question: Question) {
    if (question.questionText.trimStart().length > 0 && (this.role === this.author || this.role === this.contributor.toLowerCase())) {
      let questionRequest: QuestionRequest = this.getQuestionRequest(question)
      this.appService.saveMasterQuestion(questionRequest).pipe(takeUntil(this.destroy$)).subscribe({
        next: (data) => {
          question.isEdit = false
          question.questionId = data.questionId
          this.sendToStore(data)
          this.showSuccess(this.createSuccessMessage, NOTIFICATION_DURATION)
          this.ngOnInit()
        }, error: _error => {
          this.showError(this.dataNotSaved);
        }
      })
    }
  }

  removeQuestion() {
    this.questionStatusMapper.forEach((value, key) => {
      let index = value.findIndex((eachQuestion: Question) => eachQuestion.questionId === -1)
      if (index !== -1 && index !== undefined)
        this.questionStatusMapper.get(key)?.splice(index, 1)
      this.deleteFromMap(key);
    })
  }

  private deleteFromMap(status: string | undefined) {
    if (status !== undefined) {
      if (this.questionStatusMapper.get(status)?.length === 0)
        this.questionStatusMapper.delete(status)
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

   showSuccess(data: string, duration: number) {
    this._snackBar.openFromComponent(NotificationSnackbarComponent, {
      data: {message: data, iconType: "done", notificationType: "Success:"}, panelClass: ['success'],
      duration: duration,
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }

  updateQuestion(question: Question) {
    let questionRequest: QuestionResponse = this.getQuestionWithId(question)
    if (this.role === this.author || this.role === this.reviewer) {
      this.appService.updateQuestion(question.questionId, questionRequest.questionText).pipe(takeUntil(this.destroy$)).subscribe({
        next: (_data) => {
          question.isEdit = false
          this.sendToStore(_data)
          this.role === this.author ? this.showSuccess(this.updateSuccessMessage, NOTIFICATION_DURATION) : this.showSuccess(this.approveSuccessMessage, NOTIFICATION_DURATION);
          this.questionArray = []
          this.ngOnInit()
        }, error: _error => {
          this.showError(this.dataNotSaved);
        }
      })
    }
  }

  private getQuestionWithId(question: Question | QuestionStructure): QuestionStructure {
    return {
      questionText: question.questionText,
      parameter: this.parameter.parameterId,
      questionId: question.questionId,
      status: question.status,
      references: this.getQuestionReferences(question.questionId)
    }
  }

  getQuestionRequest(question: Question): QuestionRequest {
    return {
      questionText: question.questionText,
      parameter: this.parameter.parameterId
    }
  }

  private sendToStore(data: QuestionStructure) {
    let question: Question = this.getQuestionWithId(data)
    let questions = this.getQuestionsFromParameter()
    if (questions === undefined) {
      let parameter: ParameterStructure | undefined = this.getParameter()
      if (parameter !== undefined) {
        parameter.questions = []
        parameter.questions.push(question)
      }
    } else {
      this.updateQuestionArray(questions, data, question)
    }
    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categoryResponse}))
  }

  private updateQuestionArray(questions: QuestionStructure[], data: QuestionStructure, question: QuestionResponse) {
    let index: number = questions.findIndex(eachQuestion => eachQuestion.questionId === data.questionId)
    if (index !== -1)
      questions.splice(index, 1, question)
    else
      questions?.push(question)
  }

  resetChanges() {
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
      this.mapQuestionToStatus(eachQuestion);
    })
  }

  private mapQuestionToStatus(question: Question) {
    if (question.status !== undefined) {
      if (this.questionStatusMapper.has(question?.status)) {
        this.questionStatusMapper.get(question?.status)?.unshift(question)
      } else {
        let questions = []
        questions.unshift(question)
        this.questionStatusMapper.set(question?.status, questions)
      }
    }
  }

  sendForReview(question: Question, action: string) {
    this.action = action;
    let questionRequest = this.getContributorQuestion(question);
    let contributorData: ContributorData = this.getContributorData(questionRequest)
    if((this.getQuestionReferences(question.questionId)?.length === 0 && this.action === this.sentForReview) || (this.getQuestionReferences(question.questionId) === undefined && this.action === this.sentForReview))
      this.showError(this.referenceErrorMessage)
    else
      this.openReviewDialog(questionRequest, contributorData);
  }

  private getContributorQuestion(question: Question) {
    let questionRequest: ContributorQuestion[] = []
    let contributorQuestion: ContributorQuestion = {
      comments: "", question: question.questionText, questionId: question.questionId, status: question.status,references : this.getQuestionReferences(question.questionId)
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
        action: this.action
      }
    });
    dialogRef.componentInstance.onSave.subscribe(response => {
      if (response) {
        this.updateQuestionStatusMapper(data.questions[0])
        this.deleteFromMap(data.questions[0].status)
        let question: QuestionStructure = {
          parameter: data.parameterId,
          questionId: response.questionId[0],
          questionText: data.questions[0].question,
          status: response.status,
          references : this.getQuestionReferences(response.questionId)
        }
        this.sendToStore(question)
        let updatedQuestion: Question = question
        this.mapQuestionToStatus(updatedQuestion)
        updatedQuestion.isEdit = false
      }
    })
    dialogRef.afterClosed();
    this.setActionByContributorType();
  }

  private updateQuestionStatusMapper(question: ContributorQuestion) {
    if (question.status !== undefined) {
      let index: number | undefined = this.questionStatusMapper.get(question.status)?.findIndex(eachQuestion => eachQuestion.questionId === question.questionId)
      if (index !== undefined && index !== -1)
        this.questionStatusMapper.get(question.status)?.splice(index, 1)
    }
  }

  deleteQuestion(question: Question) {
    if (question.status !== this.sentForReview) {
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
              this.updateQuestionStatusMapper(contributorQuestion[0])
              this.deleteFromMap(question.status)

            },
            error: () => {
              this.showError(this.serverError)
            }
          })
        }
      })
    }
  }

  private deleteFromStore(question: QuestionStructure) {
    let questions = this.getQuestionsFromParameter()
    if (questions !== undefined) {
      let index: number = questions.findIndex(eachQuestion => eachQuestion.questionId === question.questionId)
      if (index !== -1)
        questions.splice(index, 1)
    }
    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categoryResponse}))

  }

  updateAndApproveQuestion(question: Question) {
    const openConfirm = this.dialog.open(PopupConfirmationComponent, {
      width: '448px',
      height: '203px'
    });
    openConfirm.componentInstance.text = this.approveConfirmationTitle;
    openConfirm.afterClosed().subscribe(result => {
      if (result === 1) {
        this.updateQuestion(question)
      }
    })
  }

  async openQuestionReference(reference : any,question: Question) {
    if (this.hasQuestionReference()) {
      question.isReferenceOpened = true
      question.references=this.getReferences(question.questionId);
      this.dialogRef = this.dialog.open(reference,{
        width: '62vw',
        height: '66vh',
        maxWidth: '80vw',
        maxHeight: '71vh'
      })
      this.dialogRef.disableClose = true;
    }
  }

  private hasQuestionReference() {
    return !this.parameter.topicLevelReference && !this.parameter.parameterLevelReference
  }

  private getQuestionReferences(questionId : number) {
    if(this.hasQuestionReference()) {
      return this.getReferences(questionId);
    }
    else
      return undefined

  }

  private getReferences(questionId: number) {
    let question = this.categoryResponse.find(eachCategory => eachCategory.categoryId === this.category)?.modules.find(eachModule => eachModule.moduleId === this.module)?.topics.find(eachTopic => eachTopic.topicId === this.topic)?.parameters.find(eachParameter => eachParameter.parameterId === this.parameter.parameterId)?.questions.find(eachQuestion => eachQuestion.questionId === questionId);
    if (question?.references !== undefined && question?.references.length >0) {
      return question?.references
    }
    else
      return []
  }


}

