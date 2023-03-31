import {Component, EventEmitter, Inject, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {data_local} from "../../../messages";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {Subject, takeUntil} from "rxjs";
import {NotificationSnackbarComponent} from "../../notification-component/notification-component.component";
import {MatSnackBar} from "@angular/material/snack-bar";

const NOTIFICATION_DURATION = 2000;

@Component({
  selector: 'app-review-dialog',
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.css']
})
export class ReviewDialogComponent implements OnDestroy{
  comments: string;
  onSave = new EventEmitter();
  inputWarningLabel = data_local.LEGAL_WARNING_MSG_FOR_INPUT;
  private destroy$: Subject<void> = new Subject<void>();
  serverError: string = data_local.SHOW_ERROR_MESSAGE.POPUP_ERROR

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, public appService : AppServiceService, private _snackBar: MatSnackBar) {
  }

  sendToReview(question: any) {
    let questionId: any[] = []
    question.forEach((eachQuestion: { questionId: any; }) =>{
      questionId.push(eachQuestion.questionId)
    })
    let updatedQuestion : any = {comments: this.comments, questionId: questionId}
    this.appService.sendForReview(this.data.moduleId, "Sent_For_Review", updatedQuestion).pipe(takeUntil(this.destroy$)).subscribe({
      next : (response:any) => {
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
