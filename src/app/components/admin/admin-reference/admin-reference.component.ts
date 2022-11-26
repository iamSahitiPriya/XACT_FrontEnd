/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Input, OnInit} from '@angular/core';
import {data_local} from "../../../messages";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-admin-reference',
  templateUrl: './admin-reference.component.html',
  styleUrls: ['./admin-reference.component.css']
})
export class AdminReferenceComponent implements OnInit {

  @Input() topic:any;

  closeToolTip = data_local.ASSESSMENT.CLOSE.TOOLTIP_MESSAGE;
  header = data_local.ADMIN.REFERENCES.HEADER
  scoreCard = data_local.ADMIN.REFERENCES.SCORE_CARD

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    console.log(this.topic)
  }

  private closePopUp() {
    this.dialog.closeAll();
  }

  close() {
    this.closePopUp();
  }


}
