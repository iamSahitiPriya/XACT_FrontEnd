import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import * as data from "../../../../messages.json";

@Component({
  selector: 'app-popup-confirmation',
  templateUrl: './popup-confirmation.component.html',
  styleUrls: ['./popup-confirmation.component.css']
})
export class PopupConfirmationComponent{
  text: string;

  data_local: any = (data as any).default;


  constructor(public dialogRef: MatDialogRef<PopupConfirmationComponent>) { }

  cancelChanges() {
    this.dialogRef.close(1)
  }


}
