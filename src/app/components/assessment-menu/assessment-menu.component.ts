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
import {data_local} from "../../../assets/messages";

export const assessmentData = [{}]

@Component({
  selector: 'app-assessment-menu',
  templateUrl: './assessment-menu.component.html',
  styleUrls: ['./assessment-menu.component.css']
})


export class AssessmentMenuComponent implements OnInit, OnDestroy {
  savedAnswer: string
  createAssessmentForm: FormGroup;
  columnName = ["name", "delete"];
  assessment: AssessmentStructure;
  data: AssessmentStructure;
  @Input()
  assessmentId: number
  answerResponse1: Observable<AssessmentStructure>;
  private cloneAssessment: AssessmentStructure;
  public static answerSaved: string;
  generateReportToolTip = data_local.ASSESSMENT_MENU.GENERATE_REPORT.TOOLTIP;
  generateReportTitle = data_local.ASSESSMENT_MENU.GENERATE_REPORT.TITLE;
  finishAssessmentToolTip = data_local.ASSESSMENT_MENU.FINISH_ASSESSMENT.TOOLTIP;
  finishAssessmentTitle = data_local.ASSESSMENT_MENU.FINISH_ASSESSMENT.TITLE;
  reopenAssessmentToolTip = data_local.ASSESSMENT_MENU.REOPEN_ASSESSMENT.TOOLTIP;
  reopenAssessmentTitle = data_local.ASSESSMENT_MENU.REOPEN_ASSESSMENT.TITLE;
  menuButtonToolTip = data_local.ASSESSMENT_MENU.MENU_BUTTON.TOOLTIP;
  manageAssessmentToolTip = data_local.ASSESSMENT_MENU.MANAGE_ASSESSMENT.TOOLTIP;
  manageAssessmentTitle = data_local.ASSESSMENT_MENU.MANAGE_ASSESSMENT.TITLE;
  addModuleTitle = data_local.ASSESSMENT_MENU.ADD_ASSESSMENT_MODULE.TITLE;
  summaryTitle = data_local.SUMMARY_REPORT.TITLE;
  summaryTitleToolTip = data_local.SUMMARY_REPORT.TOOLTIP;

  private destroy$: Subject<void> = new Subject<void>();
  assessmentUpdateStatus = data_local.ASSESSMENT_MENU.LAST_SAVE_STATUS_TEXT;

  constructor(private appService: AppServiceService, private dialog: MatDialog, private errorDisplay: MatSnackBar, private formBuilder: FormBuilder, private store: Store<AssessmentState>) {
    this.answerResponse1 = this.store.select(fromReducer.getAssessments)
  }

  generateReport() {
    let reportStatus = this.assessment.assessmentStatus === 'Active' ? 'interim' : 'final';
    const date = moment().format('DD-MM-YYYY');
    const reportName = reportStatus + "-xact-report-" + this.formattedName(this.assessment.assessmentName) + "-" + date + ".xlsx";
    this.appService.generateReport(this.assessmentId).pipe(takeUntil(this.destroy$)).subscribe(blob => {
      saveAs(blob, reportName);
    });
  }

  private formattedName(name: string) {
    return name.toLowerCase().replace(/ /g, "-");
  }


  finishAssessment() {
    this.appService.finishAssessment(this.assessmentId).pipe(takeUntil(this.destroy$)).subscribe((_data) => {
        this.cloneAssessment = Object.assign({}, this.assessment)
        this.cloneAssessment.assessmentStatus = _data.assessmentStatus
        this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneAssessment}))
      }
    )
  }

  confirmFinishAssessmentAction() {
    const openConfirm = this.dialog.open(PopupConfirmationComponent, {
      width: '448px',
      height: '203px'
    });
    openConfirm.componentInstance.text = data_local.ASSESSMENT_MENU.CONFIRMATION_POPUP_TEXT;
    openConfirm.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
      if (result === 1) {
        this.finishAssessment();
      }
    })
  }

  reopenAssessment() {
    this.appService.reopenAssessment(this.assessmentId).pipe(takeUntil(this.destroy$)).subscribe((_data) => {
        this.sendAssessmentStatus(_data.assessmentStatus)
      }
    )
  }

  sendAssessmentStatus(assessmentStatus: string) {
    this.cloneAssessment = Object.assign({}, this.assessment)
    this.cloneAssessment.assessmentStatus = assessmentStatus
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneAssessment}))
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

  ngOnInit(): void {
    this.answerResponse1.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data !== undefined) {
        this.assessment = data;
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}


