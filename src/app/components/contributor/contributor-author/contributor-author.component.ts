import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ReviewDialogComponent} from "../review-dialog/review-dialog.component";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {ContributorResponse} from "../../../types/Contributor/ContributorResponse";
import {ContributorData} from "../../../types/Contributor/ContributorData";
import {Question} from "../../../types/Contributor/Question";

@Component({
  selector: 'app-contributor-author',
  templateUrl: './contributor-author.component.html',
  styleUrls: ['./contributor-author.component.css']
})
export class ContributorAuthorComponent implements OnInit {
  searchBarText: string = "Search questions";
  searchText: string;
  isEdit: boolean;
  text: string = "Hello"
  sentToReview: boolean = false;
  clicked: boolean = false;
  contributorResponse: ContributorResponse;
  contributorData: ContributorData[] = []
  public dialogRef: MatDialogRef<ReviewDialogComponent>

  constructor(public dialog: MatDialog, private appService: AppServiceService) {
  }

  ngOnInit(): void {
    this.appService.getContributorQuestions("Author").subscribe((data) => {
      this.contributorResponse = data
      this.formatResponse()
    })
  }

  editQuestion(question:Question) {
    question.isEdit = true;
  }

  sendForReview(question: Question) {
    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      data: {
        role: 'author',
        question:question.question,
        sentToReview: this.sentToReview
      }
    });
    dialogRef.componentInstance.onSave.subscribe(data => {
      this.sentToReview = data
    })
    dialogRef.afterClosed()
  }

  cancelChanges(question: Question) {
    question.isEdit = false
  }

  isCardClicked(response: ContributorData) {
    this.contributorData.filter(data => data !== response).forEach(eachResponse =>{
      eachResponse.isClicked = false
    })
    response.isClicked = true
  }

  private formatResponse() {
    this.contributorResponse.categories?.forEach(eachCategory => {
      eachCategory.modules?.forEach(eachModule => {
        eachModule.topics?.forEach(eachTopic => {
          eachTopic.parameters?.forEach(eachParameter => {
            let data: ContributorData = {categoryName: "", moduleName: "", parameterName: "", questions: [], topicName: "", isClicked:false}
            data.categoryName = eachCategory.categoryName
            data.moduleName = eachModule.moduleName
            data.topicName = eachTopic.topicName
            data.parameterName = eachParameter.parameterName
            eachParameter.questions.forEach(eachQuestion =>{
              eachQuestion.isEdit = false
              data.questions.push(eachQuestion)
            })
            this.contributorData.push(data)
          })
        })
      })

    })
  }
}
