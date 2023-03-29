import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ReviewDialogComponent} from "../review-dialog/review-dialog.component";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {ContributorResponse} from "../../../types/Contributor/ContributorResponse";
import {ContributorData} from "../../../types/Contributor/ContributorData";
import {Question} from "../../../types/Contributor/Question";
import {cloneDeep} from "lodash";
import {Parameter} from "../../../types/Contributor/Parameter";
import {Subject, takeUntil} from "rxjs";
import {NotificationSnackbarComponent} from "../../notification-component/notification-component.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {data_local} from "../../../messages";
import {PopupConfirmationComponent} from "../../popup-confirmation/popup-confirmation.component";

const NOTIFICATION_DURATION = 2000;


@Component({
  selector: 'app-contributor-author',
  templateUrl: './contributor-author.component.html',
  styleUrls: ['./contributor-author.component.css']
})
export class ContributorAuthorComponent implements OnInit {
  searchBarText: string = "Search questions";
  searchText: string;
  isEdit: boolean;
  sentToReview: boolean = false;
  clicked: boolean = false;
  contributorResponse: ContributorResponse;
  contributorData: ContributorData[] = []
  unsavedData: ContributorData[]
  overallComments: string = ""
  private destroy$: Subject<void> = new Subject<void>();
  public dialogRef: MatDialogRef<ReviewDialogComponent>
  serverError: string = data_local.SHOW_ERROR_MESSAGE.POPUP_ERROR
  isAllQuestionsOpened: boolean = false;

  constructor(public dialog: MatDialog, private appService: AppServiceService, private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.appService.getContributorQuestions("Author").subscribe((data) => {
      this.unsavedData = []
      this.contributorResponse = data
      this.formatResponse()
      this.unsavedData = cloneDeep(this.contributorData)
    })
  }

  editQuestion(question1: Question) {
    this.contributorData = []
    this.unsavedData.forEach(eachData => {
      let data = this.getContributorData(eachData);
      eachData.questions.forEach(eachQuestion => {
        let question = this.getQuestion(eachQuestion);
        if (eachQuestion.questionId === question1.questionId)
          question.isEdit = true;
        data.questions.push(question)
      })
      this.contributorData.push(data)
    })
  }

  private getQuestion(eachQuestion: Question) {
    let question: Question = {comments: "", isEdit: false, question: "", questionId: -1, status: ""}
    question.question = eachQuestion.question
    question.questionId = eachQuestion.questionId
    question.isEdit = eachQuestion.isEdit
    question.status = eachQuestion.status
    question.comments = eachQuestion.comments
    return question;
  }

  private getContributorData(eachData: ContributorData) {
    let data: ContributorData = {
      categoryName: "",
      moduleName: "",
      moduleId: -1,
      parameterName: "",
      questions: [],
      topicName: "",
      isClicked: false,
      allSelected: true
    }
    data.categoryName = eachData.categoryName
    data.moduleName = eachData.moduleName
    data.moduleId = eachData.moduleId
    data.topicName = eachData.topicName
    data.parameterName = eachData.parameterName
    data.isClicked = eachData.isClicked
    data.allSelected = eachData.allSelected
    return data;
  }

  sendForReview(question: Question, moduleId: number) {
    let questionRequest:Question[] = []
    questionRequest.push(question)
    this.openReviewDialog(questionRequest, moduleId);
  }

  private openReviewDialog(questionRequest: Question[], moduleId: number) {
    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      width: '64vw',
      data: {
        role: 'author',
        question: questionRequest,
        moduleId: moduleId,
      }
    });
    dialogRef.componentInstance.onSave.subscribe(response => {
      this.setQuestionStatus(response, questionRequest)
    })
    dialogRef.afterClosed()
  }

  cancelChanges() {
    this.overallComments = ""
    this.contributorData = []
    this.unsavedData.forEach(eachData => {
      let data = this.getContributorData(eachData);
      eachData.questions.forEach(eachQuestion => {
        let question = this.getQuestion(eachQuestion);
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
    this.contributorResponse.categories?.forEach(eachCategory => {
      eachCategory.modules?.forEach(eachModule => {
        eachModule.topics?.forEach(eachTopic => {
          eachTopic.parameters?.forEach(eachParameter => {
            let data: ContributorData = {
              categoryName: "",
              moduleId: -1,
              moduleName: "",
              parameterName: "",
              questions: [],
              topicName: "",
              isClicked: false
            }
            data.categoryName = eachCategory.categoryName
            data.moduleName = eachModule.moduleName
            data.moduleId = eachModule.moduleId
            data.topicName = eachTopic.topicName
            data.parameterName = eachParameter.parameterName
            data.allSelected = false
            this.formatQuestion(eachParameter, data);
          })
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

  sendAllQuestionsForReview(contributorData: ContributorData) {
    console.log(contributorData)
    let question: Question[] = []
    contributorData.questions.forEach(eachQuestion => {
      if (eachQuestion.isSelected) {
        question.push(eachQuestion)
      }
    })
    this.openReviewDialog(question,contributorData.moduleId)
  }

  changeSelectedQuestions(data: ContributorData) {
    return data.questions.filter(eachQuestion => eachQuestion.isSelected).length > 0 && !data.allSelected;
  }

  updateAllSelectedStatus(data: ContributorData) {
    data.allSelected = data.questions.every(eachQuestion => ((eachQuestion.isSelected === true && eachQuestion.status === 'Draft') || (eachQuestion.isSelected === false && eachQuestion.status === 'Sent_For_Review')));
  }

  setAllQuestions(isSelected: boolean, data: ContributorData) {
    data.allSelected = true
    data.questions.forEach(eachQuestion => {
      if (eachQuestion.status === 'Sent_For_Review') eachQuestion.isSelected = false
      else eachQuestion.isSelected = isSelected
    });
  }

  saveQuestion(question: Question) {
    this.appService.updateQuestion(question.questionId, question.question).pipe(takeUntil(this.destroy$)).subscribe({
      next: (_response: any) => {
        question.isEdit = false
      }, error: _error => {
        this.showError(this.serverError);
      }
    })
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

  private setQuestionStatus(response: any, questions: Question[]) {
    response.forEach((eachResponse: any) => {
      let index = questions.findIndex(eachQuestion => eachQuestion.questionId === eachResponse.questionId)
      if (index !== -1) {
        questions[index].status = eachResponse.contributorQuestionStatus
      }
    })
  }

  deleteQuestion(question: Question, response: ContributorData) {
    const openConfirm = this.dialog.open(PopupConfirmationComponent, {
      width: '448px',
      height: '203px'
    });
    openConfirm.componentInstance.text = "Are you sure";
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

  openAllQuestions() {
    this.isAllQuestionsOpened = true
  }
}
