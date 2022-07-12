import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {data_local} from "../../../assets/messages";

@Component({
  selector: 'app-error-component',
  templateUrl: './error-component.component.html',
  styleUrls: ['./error-component.component.css']
})
export class ErrorComponentComponent {

  homePageText = data_local.ERROR_MESSAGE_LINK_TEXT.HOMEPAGE_LINK_TEXT;
  retryText = data_local.ERROR_MESSAGE_LINK_TEXT.RETRY_TEXT;
  bodyText: string;

  constructor(public dialogRef: MatDialogRef<ErrorComponentComponent>) {
    dialogRef.disableClose = true;
  }

  cancelChanges() {
    this.dialogRef.close(1)
  }

  retry() {
    window.location.reload();
  }

}
