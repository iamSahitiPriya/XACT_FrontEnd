import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ReviewDialogComponent} from "../review-dialog/review-dialog.component";
import {logger} from "html2canvas/dist/types/core/__mocks__/logger";

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

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  editQuestion() {
    this.isEdit = true;
    return this.isEdit;
  }

  sendForReview() {
    const dialogRef = this.dialog.open(ReviewDialogComponent,{
      width: '48vw',
      height: '33vh',
      maxWidth: '80vw',
      maxHeight: '71vh',
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
