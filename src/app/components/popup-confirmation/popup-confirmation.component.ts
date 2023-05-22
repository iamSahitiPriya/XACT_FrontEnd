/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {data_local} from "../../messages";

@Component({
  selector: 'app-popup-confirmation',
  templateUrl: './popup-confirmation.component.html',
  styleUrls: ['./popup-confirmation.component.css']
})
export class PopupConfirmationComponent {
  text: string;
  warningLabel : string;

  buttonText = data_local.POPUP_BUTTON.BUTTON_TEXT;
  cancel : number =0;
  save : number =1;
  no: number = 2;
  noButtonText : string = data_local.POPUP_BUTTON.NO_BUTTON_TEXT

  constructor(public dialogRef: MatDialogRef<PopupConfirmationComponent>) {
  }

  closeDialog(result: number) {
    this.dialogRef.close(result)
  }


}
