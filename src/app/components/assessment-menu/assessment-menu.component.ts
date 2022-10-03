/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Input, OnDestroy, OnInit} from '@angular/core';


import {AppServiceService} from "../../services/app-service/app-service.service";
import {saveAs} from 'file-saver';
import {PopupConfirmationComponent} from "../popup-confirmation/popup-confirmation.component";
import {MatDialog} from "@angular/material/dialog";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AssessmentStructure} from "../../types/assessmentStructure";
import {Store} from "@ngrx/store";
import {AssessmentState} from "../../reducers/app.states";
import * as fromReducer from "../../reducers/assessment.reducer";
import {Observable, Subject, takeUntil} from "rxjs";
import * as fromActions from "../../actions/assessment-data.actions";
import * as moment from 'moment';
import {data_local} from "../../messages";
import {NotificationSnackbarComponent} from "../notification-component/notification-component.component";

export const assessmentData = [{}]

@Component({
  selector: 'app-assessment-menu',
  templateUrl: './assessment-menu.component.html',
  styleUrls: ['./assessment-menu.component.css']
})


export class AssessmentMenuComponent {
  @Input()
  assessment: AssessmentStructure;

  public static answerSaved: string;
  menuButtonToolTip = data_local.ASSESSMENT_MENU.MENU_BUTTON.TOOLTIP;
  manageAssessmentToolTip = data_local.ASSESSMENT_MENU.MANAGE_ASSESSMENT.TOOLTIP;
  manageAssessmentTitle = data_local.ASSESSMENT_MENU.MANAGE_ASSESSMENT.TITLE;
  addModuleTitle = data_local.ASSESSMENT_MENU.ADD_ASSESSMENT_MODULE.TITLE;
  summaryTitle = data_local.SUMMARY_REPORT.TITLE;
  summaryTitleToolTip = data_local.SUMMARY_REPORT.TOOLTIP;


  constructor(private dialog: MatDialog) {
  }

  async openAssessment(content: any) {
    assessmentData.splice(0, assessmentData.length)

    const dialogRef = this.dialog.open(content, {
      width: '630px', height: '650px',
    })
    dialogRef.disableClose = true;
  }


  closePopUp(): void {
    this.dialog.closeAll()
  }



}


