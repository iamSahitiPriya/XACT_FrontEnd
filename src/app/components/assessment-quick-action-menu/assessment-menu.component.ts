/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Input, OnDestroy} from '@angular/core';


import {AppServiceService} from "../../services/app-service/app-service.service";
import {saveAs} from 'file-saver';
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AssessmentStructure} from "../../types/assessmentStructure";
import {Subject, takeUntil} from "rxjs";
import * as moment from 'moment';
import {data_local} from "../../messages";
import {NotificationSnackbarComponent} from "../notification-component/notification-component.component";

export const assessmentData = [{}]

@Component({
  selector: 'app-assessment-menu',
  templateUrl: './assessment-menu.component.html',
  styleUrls: ['./assessment-menu.component.css']
})


export class AssessmentMenuComponent implements OnDestroy{
  @Input()
  assessment: AssessmentStructure;
  @Input()
  type: string;



  public static answerSaved: string;
  menuButtonToolTip = data_local.ASSESSMENT_MENU.MENU_BUTTON.TOOLTIP;
  manageAssessmentToolTip = data_local.ASSESSMENT_MENU.MANAGE_ASSESSMENT.TOOLTIP;
  manageAssessmentTitle = data_local.ASSESSMENT_MENU.MANAGE_ASSESSMENT.TITLE;
  manageCategoryModules = data_local.ASSESSMENT_MENU.ADD_ASSESSMENT_MODULE.TOOLTIP;
  addModuleTitle = data_local.ASSESSMENT_MENU.ADD_ASSESSMENT_MODULE.TITLE;
  summaryTitle = data_local.SUMMARY_REPORT.TITLE;
  summaryTitleToolTip = data_local.SUMMARY_REPORT.TOOLTIP;
  generateReportToolTip = data_local.ASSESSMENT_MENU.GENERATE_REPORT.TOOLTIP;
  generateReportTitle = data_local.ASSESSMENT_MENU.GENERATE_REPORT.TITLE;
  private completedReportDownloadStatus = data_local.ASSESSMENT_MENU.COMPLETE_REPORT_DOWNLOADING_MESSAGE;
  private inProgressReportDownloadStatus = data_local.ASSESSMENT_MENU.IN_PROGRESS_REPORT_DOWNLOADING_MESSAGE;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private dialog: MatDialog,private appService: AppServiceService, private snackBar: MatSnackBar) {
  }


  generateReport() {
    this.displayNotifications();
    let reportStatus = this.assessment.assessmentStatus === 'Active' ? 'interim' : 'final';
    const date = moment().format('DD-MM-YYYY');
    const reportName = reportStatus + "-xact-report-" + AssessmentMenuComponent.formattedName(this.assessment.assessmentName) + "-" + date + ".xlsx";
    this.appService.generateReport(this.assessment.assessmentId).pipe(takeUntil(this.destroy$)).subscribe(blob => {
      saveAs(blob, reportName);
    });
  }

  private displayNotifications() {
    if (this.assessment.assessmentStatus === 'Completed') {
      this.showNotification(this.completedReportDownloadStatus, 20000);
    } else {
      this.showNotification(this.inProgressReportDownloadStatus, 10000);
    }
  }

  getTemplate() {
    if (this.assessment.assessmentStatus === 'Completed') {
      this.appService.getTemplate().pipe(takeUntil(this.destroy$)).subscribe(blob => {
        saveAs(blob, data_local.ASSESSMENT_MENU.REPORT_TEMPLATE_NAME);
      });
    }
  }

  private static formattedName(name: string) {
    return name.toLowerCase().replace(/ /g, "-");
  }

  private showNotification(reportData: string, duration: number) {
    this.snackBar.openFromComponent(NotificationSnackbarComponent, {
      data: reportData,
      duration: duration,
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  async openAssessment(content: any) {
    assessmentData.splice(0, assessmentData.length)

    const dialogRef = this.dialog.open(content, {
      width: '630px',
      maxHeight: '85vh'
    })
    dialogRef.disableClose = true;
  }


  closePopUp(): void {
    this.dialog.closeAll()
  }


  isAssessmentHeader(): boolean {
    return this.type == "assessmentHeader";
  }
  isAssessmentTable(): boolean {
    return this.type == "assessmentTable" ;
  }

}


