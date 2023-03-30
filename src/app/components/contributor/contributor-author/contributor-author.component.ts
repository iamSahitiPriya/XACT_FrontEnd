import {Component, OnInit} from '@angular/core';
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
  parameterData: ParameterData;
  masterData: Observable<CategoryResponse[]>
  masterData1:CategoryResponse[]

  constructor(public dialog: MatDialog, private appService: AppServiceService, private _snackBar: MatSnackBar, private store:Store<AppStates>) {
    this.masterData = this.store.select((storeMap) => storeMap.masterData.masterData)
  }

  ngOnInit(): void {
    this.masterData.subscribe(data =>{
      this.masterData1 = data
    })
    this.appService.getContributorQuestions("Author").subscribe((data) => {
      this.unsavedData = []
      this.contributorResponse = data
      this.formatResponse()
      this.unsavedData = cloneDeep(this.contributorData)
    })
  }

  isContributorQuestionsOpened() {
    this.isAllQuestionsOpened = false
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
      categoryId: -1,
      parameterId: -1,
      topicId: -1,
      categoryName: "",
      moduleName: "",
      moduleId: -1,
      parameterName: "",
      questions: [],
      topicName: "",
      isClicked: false,
      allSelected: true
    }
    data.categoryId = eachData.categoryId
    data.topicId = eachData.topicId
    data.parameterId = eachData.parameterId
    data.categoryName = eachData.categoryName
    data.moduleName = eachData.moduleName
    data.moduleId = eachData.moduleId
    data.topicName = eachData.topicName
    data.parameterName = eachData.parameterName
    data.isClicked = eachData.isClicked
    data.allSelected = eachData.allSelected
    return data;
  }

  sendForReview(question: Question, response:ContributorData) {
    let questionRequest:Question[] = []
    questionRequest.push(question)
    this.openReviewDialog(questionRequest,response);
  }

  private openReviewDialog(questionRequest: Question[], data: ContributorData) {
    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      width: '64vw',
      data: {
        role: 'author',
        question: questionRequest,
        moduleId: data.moduleId,
      }
    });
    dialogRef.componentInstance.onSave.subscribe(response => {
      this.setQuestionStatus(response, questionRequest)
      this.updateStore(response, data)
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
    this.contributorResponse.contributorModuleData?.forEach(eachModule => {
        eachModule.topics?.forEach(eachTopic => {
          eachTopic.parameters?.forEach(eachParameter => {
            let data: ContributorData = {
              categoryId: -1,
              parameterId: -1,
              topicId: -1,
              categoryName: "",
              moduleId: -1,
              moduleName: "",
              parameterName: "",
              questions: [],
              topicName: "",
              isClicked: false
            }
            data.categoryName = eachModule.categoryName
            data.categoryId = eachModule.categoryId
            data.moduleName = eachModule.moduleName
            data.moduleId = eachModule.moduleId
            data.topicName = eachTopic.topicName
            data.topicId = eachTopic.topicId
            data.parameterName = eachParameter.parameterName
            data.parameterId = eachParameter.parameterId
            data.allSelected = false
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

  sendAllQuestionsForReview(contributorData: ContributorData) {
    console.log(contributorData)
    let question: Question[] = []
    contributorData.questions.forEach(eachQuestion => {
      if (eachQuestion.isSelected) {
        question.push(eachQuestion)
      }
    })
    this.openReviewDialog(question,contributorData)
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

  private setQuestionStatus(response: any, questions: any[]) {
    response.questionId.forEach((eachResponse: any) => {
      let index = questions.findIndex(eachQuestion => eachQuestion.questionId === eachResponse)
      if (index !== -1) {
        questions[index].status = response.status
      }
    })
    this.store.dispatch(fromActions.getUpdatedCategories({newMasterData: this.masterData1}))
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

  openAllQuestions(response: ContributorData) {
    this.isAllQuestionsOpened = true
    this.parameterData = this.getParameterData(response)
  }

  private getParameterData(data: ContributorData) {
    return {
      categoryId: data.categoryId,
      categoryName: data.categoryName,
      moduleId: data.moduleId,
      moduleName: data.moduleName,
      parameterId: data.parameterId,
      parameterName: data.parameterName,
      topicId:data.topicId,
      topicName: data.topicName
    }
  }

  closeQuestions() {
    this.isAllQuestionsOpened = false
  }

  private updateStore(response: any, data:ContributorData) {
    let categoryIndex = this.masterData1.findIndex(eachData => eachData.categoryId === data.categoryId);
    if(categoryIndex !== -1) {
      let moduleIndex = this.masterData1[categoryIndex].modules.findIndex(eachModule => eachModule.moduleId === data.moduleId)
      if(moduleIndex !== -1){
        let topicIndex = this.masterData1[categoryIndex].modules[moduleIndex].topics.findIndex(eachTopic => eachTopic.topicId === data.topicId)
        if(topicIndex !== -1){
          let parameterIndex = this.masterData1[categoryIndex].modules[moduleIndex].topics[topicIndex].parameters.findIndex(eachParameter => eachParameter.parameterId === data.parameterId)
          this.setQuestionStatus(response, this.masterData1[categoryIndex].modules[moduleIndex].topics[topicIndex].parameters[parameterIndex].questions)
        }
      }
    }
  }
}
