import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ReviewDialogComponent} from "../review-dialog/review-dialog.component";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {ContributorResponse} from "../../../types/Contributor/ContributorResponse";
import {ContributorData} from "../../../types/Contributor/ContributorData";

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

  editQuestion() {
    this.isEdit = true;
    return this.isEdit;
  }

  sendForReview() {
    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      data: {
        role: 'author',
        // question:this.text,
        sentToReview: this.sentToReview
      }
    });
    dialogRef.componentInstance.onSave.subscribe(data => {
      this.sentToReview = data
    })
    dialogRef.afterClosed()
  }

  cancelChanges() {
    this.isEdit = false
  }

  isCardClicked() {
    this.clicked = true
  }

  private formatResponse() {
    this.contributorResponse.categories?.forEach(eachCategory => {
      eachCategory.modules?.forEach(eachModule => {
        console.log(eachModule.moduleName)
        eachModule.topics?.forEach(eachTopic => {
          eachTopic.parameters?.forEach(eachParameter => {
            let data: ContributorData = {categoryName: "", moduleName: "", parameterName: "", questions: [], topicName: ""}
            data.categoryName = eachCategory.categoryName
            data.moduleName = eachModule.moduleName
            data.topicName = eachTopic.topicName
            data.parameterName = eachParameter.parameterName
            data.questions.push(...eachParameter.questions)
            this.contributorData.push(data)
          })
        })
      })

    })
  }
}
