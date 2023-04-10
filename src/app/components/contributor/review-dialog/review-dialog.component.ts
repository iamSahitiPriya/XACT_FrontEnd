import {Component, EventEmitter, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {data_local} from "../../../messages";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {Subject, takeUntil} from "rxjs";
import {NotificationSnackbarComponent} from "../../notification-component/notification-component.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Question} from "../../../types/Contributor/Question";
import {ContributorQuestionRequest} from "../../../types/Contributor/ContributorQuestionRequest";

const NOTIFICATION_DURATION = 2000;

@Component({
  selector: 'app-review-dialog',
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.css']
})
export class ReviewDialogComponent implements OnDestroy, OnInit{
  comments: string;
  onSave = new EventEmitter();
  inputWarningLabel = data_local.LEGAL_WARNING_MSG_FOR_INPUT;
  private destroy$: Subject<void> = new Subject<void>();
  serverError: string = data_local.SHOW_ERROR_MESSAGE.POPUP_ERROR
  questions: string = data_local.ADMIN.QUESTION.QUESTIONS;
  sendForReview: string = data_local.CONTRIBUTOR.AUTHOR.SEND_FOR_REVIEW;
  cancel: string = data_local.CONTRIBUTOR.CANCEL;
  sentForReview : string = data_local.CONTRIBUTOR.STATUS.SENT_FOR_REVIEW
  displayButtonText : string = " " ;
  requestedForChange : string = data_local.CONTRIBUTOR.STATUS.REQUESTED_FOR_CHANGE
  sendForReassessment : string = data_local.CONTRIBUTOR.STATUS.DISPLAY_TEXT.SEND_FOR_REASSESSMENT


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, public appService : AppServiceService, private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    if(this.data.action === this.sentForReview)
      this.displayButtonText = this.sendForReview
    else if(this.data.action === this.requestedForChange)
      this.displayButtonText = this.sendForReassessment
    else if(this.data.action === "PUBLISHED")
      this.displayButtonText = "Approve"
    else if(this.data.action === "REJECTED")
      this.displayButtonText = "Reject"

  }

  evaluateQuestion(question: Question[]) {
    let questionId: number[] = []
    question.forEach((eachQuestion) =>{
      questionId.push(eachQuestion.questionId)
    })
    let updatedQuestion : ContributorQuestionRequest = {comments: this.comments, questionId: questionId}
    this.appService.updateQuestionStatus(this.data.moduleId, this.data.action, updatedQuestion).pipe(takeUntil(this.destroy$)).subscribe({
      next : (response) => {
        this.onSave.emit(response)
      }, error : _error => {
        this.showError(this.serverError);
      }
    })

    this.dialog.closeAll()
  }

  cancelChanges() {
    this.onSave.emit(false)
    this.comments = ""
    this.dialog.closeAll()
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  showError(message: string) {
    this._snackBar.openFromComponent(NotificationSnackbarComponent, {
      data: {message: message, iconType: "error_outline", notificationType: "Error:"}, panelClass: ['error-snackBar'],
      duration: NOTIFICATION_DURATION,
      verticalPosition: "top",
      horizontalPosition: "center"
    })
  }
}
