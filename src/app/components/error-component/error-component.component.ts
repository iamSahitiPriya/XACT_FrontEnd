import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-error-component',
  templateUrl: './error-component.component.html',
  styleUrls: ['./error-component.component.css']
})
export class ErrorComponentComponent {

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
