import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ReviewDialogComponent} from "../review-dialog/review-dialog.component";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {ContributorResponse} from "../../../types/Contributor/ContributorResponse";
import {ContributorData} from "../../../types/Contributor/ContributorData";
import {Question} from "../../../types/Contributor/Question";
import {cloneDeep} from "lodash";
import {Parameter} from "../../../types/Contributor/Parameter";
import {Observable, Subject, takeUntil} from "rxjs";
import {NotificationSnackbarComponent} from "../../notification-component/notification-component.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {data_local} from "../../../messages";
import {PopupConfirmationComponent} from "../../popup-confirmation/popup-confirmation.component";
import {ParameterData} from "../../../types/ParameterData";
import {AppStates} from "../../../reducers/app.states";
import {Store} from "@ngrx/store";
import {CategoryResponse} from "../../../types/categoryResponse";
import * as fromActions from "../../../actions/assessment-data.actions";
import {QuestionStructure} from "../../../types/questionStructure";
import {Router} from "@angular/router";
import {ContributorQuestionRequest} from "../../../types/Contributor/ContributorQuestionRequest";
import {ContributorQuestionResponse} from "../../../types/Contributor/ContributorQuestionResponse";

const NOTIFICATION_DURATION = 2000;

@Component({
  selector: 'app-contributor-author',
  templateUrl: './contributor-author.component.html',
  styleUrls: ['./contributor-author.component.css']
})
export class ContributorAuthorComponent implements OnInit, OnDestroy {
  searchBarText: string = data_local.CONTRIBUTOR.SEARCH_QUESTIONS;
  searchText: string;
  isEdit: boolean;
  isReviewSent: boolean = false;
  clicked: boolean = false;
  contributorResponse: ContributorResponse;
  contributorData: ContributorData[] = []
  unsavedChanges: ContributorData[]
  private destroy$: Subject<void> = new Subject<void>();
  public dialogRef: MatDialogRef<ReviewDialogComponent>
  serverError: string = data_local.SHOW_ERROR_MESSAGE.POPUP_ERROR
  isAllQuestionsOpened: boolean = false;
  parameterData: ParameterData;
  masterData: Observable<CategoryResponse[]>
  categoryResponse: CategoryResponse[]
  close: string = data_local.CONTRIBUTOR.CLOSE;
  contributor: string = data_local.CONTRIBUTOR.CONTRIBUTOR;
  contributorTitle: string = data_local.CONTRIBUTOR.TITLE;
  allQuestions: string = data_local.CONTRIBUTOR.ALL_QUESTIONS;
  selectAll: string = data_local.CONTRIBUTOR.SELECT_ALL;
  sendForReviewText: string = data_local.CONTRIBUTOR.AUTHOR.SEND_FOR_REVIEW;
  sentForReviewText : string = data_local.CONTRIBUTOR.STATUS.DISPLAY_TEXT.SENT_FOR_REVIEW;
  sentForReview: string = data_local.CONTRIBUTOR.STATUS.SENT_FOR_REVIEW;
  contributorActionButtonText : string;
  draft: string = data_local.CONTRIBUTOR.STATUS.DRAFT;
  edit: string = data_local.CONTRIBUTOR.EDIT;
  save: string = data_local.CONTRIBUTOR.SAVE;
  author: string = data_local.CONTRIBUTOR.ROLE.AUTHOR;
  private confirmationTitle: string = data_local.CONTRIBUTOR.CONFIRMATION_POPUP_TEXT;
  noDataPresentText: string = data_local.CONTRIBUTOR.NO_DATA_PRESENT;
  sendForReassessment : string = data_local.CONTRIBUTOR.STATUS.DISPLAY_TEXT.SEND_FOR_REASSESSMENT
  requestedForChange : string = data_local.CONTRIBUTOR.STATUS.REQUESTED_FOR_CHANGE
  reviewer: string = data_local.CONTRIBUTOR.ROLE.REVIEWER;
  published : string = data_local.CONTRIBUTOR.STATUS.PUBLISHED
  rejected : string = data_local.CONTRIBUTOR.STATUS.REJECTED
  action: string;
  contributorType:string
  search: string = data_local.CONTRIBUTOR.SEARCH_TEXT;
  requestedForChangeText: string = data_local.CONTRIBUTOR.STATUS.HOVER_TEXT.REQUESTED_FOR_CHANGE;
  approve: string = data_local.CONTRIBUTOR.STATUS.HOVER_TEXT.APPROVE;


  constructor(public router: Router,public dialog: MatDialog, private appService: AppServiceService, private _snackBar: MatSnackBar, private store: Store<AppStates>) {
    this.masterData = this.store.select((storeMap) => storeMap.masterData.masterData)
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const currentRoute = this.router.url.split('?')[0];
      const path = currentRoute.split('/').pop() || '';
      this.contributorType = path.toUpperCase();
    })
  }

  ngOnInit(): void {
    this.setActionByContributorType();
    this.masterData.subscribe(data => {
      this.categoryResponse = data
    })
    this.appService.getContributorQuestions(this.contributorType).subscribe((data) => {
      this.unsavedChanges = []
      this.contributorResponse = data
      this.formatResponse()
      this.unsavedChanges = cloneDeep(this.contributorData)
    })
  }

  private setActionByContributorType() {
    if (this.contributorType === this.author) {
      this.contributorActionButtonText = this.sendForReviewText
      this.action = this.sentForReview;
    } else {
      this.contributorActionButtonText = this.sendForReassessment
      this.action = this.requestedForChange
    }
  }

  editQuestion(question: Question) {
    this.contributorData = []
    this.unsavedChanges.forEach(eachContributorData => {
      let contributorData = ContributorAuthorComponent.getContributorData(eachContributorData);
      eachContributorData.questions.forEach(eachQuestion => {
        let formattedQuestion = ContributorAuthorComponent.getFormattedQuestion(eachQuestion);
        if (eachQuestion.questionId === question.questionId)
          formattedQuestion.isEdit = true;
        contributorData.questions.push(formattedQuestion)
      })
      this.contributorData.push(contributorData)
    })
  }

  private static getFormattedQuestion(eachQuestion: Question) {
    let question: Question = {comments: "", isEdit: false, question: "", questionId: -1, status: ""}
    question.question = eachQuestion.question
    question.questionId = eachQuestion.questionId
    question.isEdit = eachQuestion.isEdit
    question.status = eachQuestion.status
    question.comments = eachQuestion.comments
    return question;
  }

  private static getContributorData(eachData: ContributorData) :ContributorData{
    return {
      categoryId: eachData.categoryId,
      parameterId: eachData.parameterId,
      topicId: eachData.topicId,
      categoryName: eachData.categoryName,
      moduleName: eachData.moduleName,
      moduleId: eachData.moduleId,
      parameterName: eachData.parameterName,
      questions: [],
      topicName: eachData.topicName,
      isClicked: eachData.isClicked,
      allSelected: eachData.allSelected
    };
  }

  evaluateQuestion(question: Question, response: ContributorData, action: string) {
    this.action = action
    let questionRequest: Question[] = []
    questionRequest.push(question)
    this.openReviewDialog(questionRequest, response);
  }

  private openReviewDialog(questionRequest: Question[], data: ContributorData) {
    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      width: '64vw',
      data: {
        role: this.contributorType.toLowerCase(),
        question: questionRequest,
        moduleId: data.moduleId,
        action: this.action
      }
    });


    dialogRef.componentInstance.onSave.subscribe(response => {
      if(response) {
        this.setQuestionStatus(response, questionRequest)
        this.removeAssessedQuestions(response, data);
      }
    })
    dialogRef.afterClosed().subscribe(() => {
      this.resetCheckbox(questionRequest, data)
    })
    this.setActionByContributorType()
  }

  private removeAssessedQuestions(questionRequest: ContributorQuestionRequest, contributorData: ContributorData) {
    if (this.contributorType === this.reviewer) {
      questionRequest.questionId.forEach((eachQuestion: number) => {
        let index = contributorData.questions.findIndex(question => question.questionId === eachQuestion)
        if (index !== -1) {
          contributorData.questions.splice(index, 1)
          if (contributorData.questions.length === 0) {
            let parameterIndex = this.contributorData.findIndex(eachContributorData => eachContributorData.parameterId === contributorData.parameterId)
            if (parameterIndex !== -1) {
              this.contributorData.splice(parameterIndex, 1)
              this.unsavedChanges.splice(parameterIndex, 1)
            }
          }
        }
      })
    }
  }

  cancelChanges() {
    this.contributorData = []
    this.unsavedChanges.forEach(eachData => {
      let data = ContributorAuthorComponent.getContributorData(eachData);
      eachData.questions.forEach(eachQuestion => {
        let question = ContributorAuthorComponent.getFormattedQuestion(eachQuestion);
        data.questions.push(question)
      })
      this.contributorData.push(data)
    })
  }

  isCardClicked(response: ContributorData) {
    this.contributorData.filter(data => data !== response).forEach(eachResponse => {
      eachResponse.isClicked = false
    })
    response.isClicked = true
  }

  private formatResponse() {
    this.contributorResponse.contributorModuleData?.forEach(eachModule => {
      eachModule.topics?.forEach(eachTopic => {
        eachTopic.parameters?.forEach(eachParameter => {
          let data: ContributorData = {
            categoryId: eachModule.categoryId,
            parameterId: eachParameter.parameterId,
            topicId: eachTopic.topicId,
            categoryName: eachModule.categoryName,
            moduleId: eachModule.moduleId,
            moduleName: eachModule.moduleName,
            parameterName: eachParameter.parameterName,
            questions: [],
            topicName: eachTopic.topicName,
            isClicked: false,
            allSelected: false
          }
          this.formatQuestion(eachParameter, data);
        })
      })

    })
  }

  private formatQuestion(eachParameter: Parameter, data: ContributorData) {
    eachParameter.questions.forEach(eachQuestion => {
      eachQuestion.isEdit = false
      eachQuestion.isSelected = false
      data.questions.push(eachQuestion)
    })
    this.contributorData.push(data)
  }

  evaluateQuestions(contributorData: ContributorData,action : string) {
    this.action = action
    let question: Question[] = []
    contributorData.questions.forEach(eachQuestion => {
      if (eachQuestion.isSelected) {
        question.push(eachQuestion)
      }
    })
    this.openReviewDialog(question, contributorData)
  }

  isQuestionIndeterminate(data: ContributorData) {
    return data.questions.filter(eachQuestion => eachQuestion.isSelected).length > 0 && !data.allSelected;
  }

  updateSelectAllStatus(data: ContributorData) {
    if(this.contributorType === this.author)
      data.allSelected = data.questions.every(eachQuestion => ((eachQuestion.isSelected === true && eachQuestion.status === this.draft) || (eachQuestion.isSelected === false && eachQuestion.status === this.sentForReview)));
    else
      data.allSelected = data.questions.every(eachQuestion => eachQuestion.isSelected === true)
  }

  setQuestionsSelectedStatus(isSelected: boolean, data: ContributorData) {
    data.allSelected = true
    data.questions.forEach(eachQuestion => {
      if (this.contributorType === this.author && eachQuestion.status === this.sentForReview) eachQuestion.isSelected = false
      else eachQuestion.isSelected = isSelected
    });
  }

  updateQuestion(question: Question, contributorData: ContributorData) {
    if(question.question.trimStart().length>0) {
      this.appService.updateQuestion(question.questionId, question.question).pipe(takeUntil(this.destroy$)).subscribe({
        next: (response: QuestionStructure) => {
          question.isEdit = false
          this.updateToStore(response, contributorData)
          let questionRequest: ContributorQuestionRequest = {
            questionId: [question.questionId],
            comments: question.comments
          }
          this.removeAssessedQuestions(questionRequest, contributorData)
          this.unsavedChanges = cloneDeep(this.contributorData)
        }, error: _error => {
          this.showError(this.serverError);
        }
      })
    }
  }

  showError(message: string) {
    this._snackBar.openFromComponent(NotificationSnackbarComponent, {
      data: {message: message, iconType: "error_outline", notificationType: "Error:"}, panelClass: ['error-snackBar'],
      duration: NOTIFICATION_DURATION,
      verticalPosition: "top",
      horizontalPosition: "center"
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setQuestionStatus(response: ContributorQuestionResponse, questions: Question[] | QuestionStructure[]) {
    response.questionId.forEach((eachResponse: number) => {
      let index = questions.findIndex(eachQuestion => eachQuestion.questionId === eachResponse)
      if (index !== -1) {
        questions[index].status = response.status
      }
    })
    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categoryResponse}))
  }

  deleteQuestion(question: Question, response: ContributorData) {
    if(question.status !== this.sentForReview) {
      const openConfirm = this.dialog.open(PopupConfirmationComponent, {
        width: '448px',
        height: '203px'
      });
      openConfirm.componentInstance.text = this.confirmationTitle;
      openConfirm.afterClosed().subscribe(result => {
        if (result === 1) {
          this.appService.deleteQuestion(question.questionId).subscribe({
            next: () => {
              let index = response.questions.findIndex(eachQuestion => eachQuestion.questionId === question.questionId)
              if (index !== -1)
                response.questions.splice(index, 1)
            },
            error: () => {
              this.showError(this.serverError)
            }
          })
        }
      })
    }
  }

  showAllQuestions(response: ContributorData) {
    this.isAllQuestionsOpened = true
    this.parameterData = ContributorAuthorComponent.getParameterData(response)
  }

  private static getParameterData(data: ContributorData) {
    return {
      categoryId: data.categoryId,
      categoryName: data.categoryName,
      moduleId: data.moduleId,
      moduleName: data.moduleName,
      parameterId: data.parameterId,
      parameterName: data.parameterName,
      topicId: data.topicId,
      topicName: data.topicName
    }
  }

  closeQuestions() {
    this.isAllQuestionsOpened = false
    window.location.reload();
  }

  private getQuestionsFromContributorData(contributorData: ContributorData) {
    let categoryIndex = this.categoryResponse.findIndex(eachData => eachData.categoryId === contributorData.categoryId);
    let moduleIndex = 0
    let topicIndex = 0
    let parameterIndex = 0
    if (categoryIndex !== -1) {
      moduleIndex = this.categoryResponse[categoryIndex].modules.findIndex(eachModule => eachModule.moduleId === contributorData.moduleId)
      if (moduleIndex !== -1) {
        topicIndex = this.categoryResponse[categoryIndex].modules[moduleIndex].topics.findIndex(eachTopic => eachTopic.topicId === contributorData.topicId)
        if (topicIndex !== -1) {
          parameterIndex = this.categoryResponse[categoryIndex].modules[moduleIndex].topics[topicIndex].parameters.findIndex(eachParameter => eachParameter.parameterId === contributorData.parameterId)
        }
      }
    }
    return this.categoryResponse[categoryIndex].modules[moduleIndex].topics[topicIndex].parameters[parameterIndex]?.questions
  }

  private updateToStore(question: QuestionStructure, contributorData: ContributorData) {
    let questions: QuestionStructure[] = this.getQuestionsFromContributorData(contributorData)
    let questionIndex = questions.findIndex(eachQuestion => eachQuestion.questionId === question.questionId)
    if (questionIndex !== -1) {
      questions[questionIndex].questionText = question.questionText
      questions[questionIndex].status = question.status
      questions[questionIndex].parameter = question.parameter
    }
    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.categoryResponse}))
  }

  private resetCheckbox(questionRequest: Question[], data: ContributorData) {
    questionRequest.forEach(eachQuestion => {
      let question = data.questions.find(question1 => question1.questionId === eachQuestion.questionId)
      if (question !== undefined) question.isSelected = false
    })

    data.allSelected = false
  }

  shouldCheckboxBeDisabled(data: ContributorData): boolean {
    if(this.contributorType === this.author)
      return data.questions.every(eachQuestion => eachQuestion.status === this.sentForReview);
    else
      return false;
  }

  isStatusValid(status: string) : boolean {
    return ((status === this.sentForReview && this.contributorType == this.author) || (status === this.requestedForChange && this.contributorType == this.reviewer));
  }
}
