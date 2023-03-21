import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ReviewDialogComponent} from "../review-dialog/review-dialog.component";
import {AppServiceService} from "../../../services/app-service/app-service.service";

@Component({
  selector: 'app-contributor-author',
  templateUrl: './contributor-author.component.html',
  styleUrls: ['./contributor-author.component.css']
})
export class ContributorAuthorComponent implements OnInit {
  searchBarText: string = "Search questions";
  searchText: string;
  isEdit: boolean;
  text: string = "Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing?";
  sentToReview: boolean = false;
  clicked: boolean = false;
  public dialogRef: MatDialogRef<ReviewDialogComponent>

  constructor(public dialog: MatDialog,private appService : AppServiceService) {
  }

  ngOnInit(): void {
    this.appService.getContributorQuestions("Author").subscribe((data) => {
      console.log(data)
    })
  }

  editQuestion() {
    this.isEdit = true;
    return this.isEdit;
  }

  sendForReview() {
    const dialogRef = this.dialog.open(ReviewDialogComponent,{
      data:{
        role:'author',
        question:this.text,
        sentToReview:this.sentToReview
      }
    });
    dialogRef.componentInstance.onSave.subscribe(data =>{
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
}
