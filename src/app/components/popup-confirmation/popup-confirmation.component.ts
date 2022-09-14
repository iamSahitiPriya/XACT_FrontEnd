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

  buttonText = data_local.POPUP_BUTTON.BUTTON_TEXT;

  constructor(public dialogRef: MatDialogRef<PopupConfirmationComponent>) {
  }

  cancelChanges() {
    this.dialogRef.close(1)
  }


}
