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
    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      width: '64vw',
      height: '20vw',
      data: {
        role: 'author',
        question: question,
        moduleId: moduleId,
      }
    });
    dialogRef.componentInstance.onSave.subscribe(status => {
      question.status = status
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

  sendAllQuestionsForReview(contributorData: ContributorData, overallComments: string) {
    let questionId: number[] = []
    contributorData.questions.forEach(eachQuestion => {
      if (eachQuestion.isSelected) {
        questionId.push(eachQuestion.questionId)
      }
    })
    let questionRequest = {
      questionId: questionId,
      comments: overallComments
    }
    this.appService.sendForReview(contributorData.moduleId,"Sent_For_Review",questionRequest).pipe(takeUntil(this.destroy$)).subscribe({
      next:(response) =>{
        this.setQuestionStatus(response,contributorData.questions)
      }
  }
    )
  }

  changeSelectedQuestions(data: ContributorData) {
    return data.questions.filter(eachQuestion => eachQuestion.isSelected).length > 0 && !data.allSelected;
  }

  updateAllSelectedStatus(data: ContributorData) {
    data.allSelected = data.questions != null && data.questions.every(eachQuestion => eachQuestion.isSelected === true);
  }

  setAllQuestions(isSelected: boolean, data: ContributorData) {
    data.allSelected = true
    data.questions.forEach(eachQuestion => (eachQuestion.isSelected = isSelected));
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
    console.log(response, questions)
  }
}
