import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {data_local} from "../../../messages";

@Component({
  selector: 'app-review-dialog',
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.css']
})
export class ReviewDialogComponent implements OnInit {
  comments: string;
  onSave = new EventEmitter();
  inputWarningLabel = data_local.LEGAL_WARNING_MSG_FOR_INPUT;


  constructor(@Inject(MAT_DIALOG_DATA) public data:any,public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  sendToReview() {
    this.onSave.emit(true)
    this.dialog.closeAll()
  }

  cancelChanges() {
    this.onSave.emit(false)
    this.comments = ""
    this.dialog.closeAll()

  }
}
