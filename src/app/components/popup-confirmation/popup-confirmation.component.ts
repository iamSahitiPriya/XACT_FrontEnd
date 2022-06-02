import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-popup-confirmation',
  templateUrl: './popup-confirmation.component.html',
  styleUrls: ['./popup-confirmation.component.css']
})
export class PopupConfirmationComponent{
  text: string;

  constructor(public dialogRef: MatDialogRef<PopupConfirmationComponent>) { }

  cancelChanges() {
    this.dialogRef.close(1)
  }


}
