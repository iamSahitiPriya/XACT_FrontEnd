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
import {PopupConfirmationComponent} from "../popup-confirmation/popup-confirmation.component";
import {Router} from "@angular/router";

export const assessmentData = [{}]

@Component({
  selector: 'app-assessment-menu',
  templateUrl: './assessment-menu.component.html',
  styleUrls: ['./assessment-menu.component.css']
})


export class AssessmentMenuComponent implements OnDestroy {
  @Input()
  assessment: AssessmentStructure;
  @Input()
  type: string;


  public static answerSaved: string;
  menuButtonToolTip = data_local.ASSESSMENT_MENU.MENU_BUTTON.TOOLTIP;
  manageAssessmentToolTip = data_local.ASSESSMENT_MENU.MANAGE_ASSESSMENT.TOOLTIP;
  deleteAssessmentToolTip = data_local.ASSESSMENT_MENU.DELETE_ASSESSMENT.TOOLTIP;
  manageAssessmentTitle = data_local.ASSESSMENT_MENU.MANAGE_ASSESSMENT.TITLE;
  manageCategoryModules = data_local.ASSESSMENT_MENU.ADD_ASSESSMENT_MODULE.TOOLTIP;
  addModuleTitle = data_local.ASSESSMENT_MENU.ADD_ASSESSMENT_MODULE.TITLE;
  summaryTitle = data_local.SUMMARY_REPORT.TITLE;
  summaryTitleToolTip = data_local.SUMMARY_REPORT.TOOLTIP;
  generateReportToolTip = data_local.ASSESSMENT_MENU.GENERATE_REPORT.TOOLTIP;
  generateReportTitle = data_local.ASSESSMENT_MENU.GENERATE_REPORT.TITLE;
  deleteAssessmentTitle = data_local.ASSESSMENT_MENU.DELETE_ASSESSMENT.TITLE;
  deleteAssessmentDialog = data_local.ASSESSMENT_MENU.DELETE_ASSESSMENT.DIALOG;
  deleteAssessmentErrorMessage = data_local.ASSESSMENT_MENU.DELETE_ASSESSMENT.ERROR_MESSAGE;
  private completedReportDownloadStatus = data_local.ASSESSMENT_MENU.COMPLETE_REPORT_DOWNLOADING_MESSAGE;
  private inProgressReportDownloadStatus = data_local.ASSESSMENT_MENU.IN_PROGRESS_REPORT_DOWNLOADING_MESSAGE;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private dialog: MatDialog, private appService: AppServiceService, private snackBar: MatSnackBar, private router: Router) {
  }


  generateReport() {
    this.displayNotifications();
    let reportStatus = this.assessment.assessmentStatus === 'Active' ? 'interim' : 'final';
    const date = moment().format('DD-MM-YYYY');
    const reportName = reportStatus + "-thoughtworks-xact-report-" + AssessmentMenuComponent.formattedName(this.assessment.assessmentName) + "-" + date + ".xlsx";
    this.appService.generateReport(this.assessment.assessmentId).pipe(takeUntil(this.destroy$)).subscribe(blob => {
      saveAs(blob, reportName);
    });
  }

  private displayNotifications() {
    if (this.assessment.assessmentStatus === 'Completed') {
      this.showNotification(this.completedReportDownloadStatus, 20000);
    } else {
      this.showNotification(this.inProgressReportDownloadStatus, 20000);
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
      data: {message: reportData, iconType: "done", notificationType: "Success:"}, panelClass: ['success'],
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
    return this.type == "assessmentTable";
  }


  deleteAssessment(assessmentId: number) {
    const openConfirm = this.dialog.open(PopupConfirmationComponent, {
      width: '448px',
      height: '203px'
    });
    openConfirm.componentInstance.text = this.deleteAssessmentDialog;
    openConfirm.afterClosed().subscribe(result => {
      if (result === 1) {
        this.appService.deleteAssessment(assessmentId).pipe(takeUntil(this.destroy$)).subscribe({
          next: () => {
            this.isAssessmentTable() ? window.location.reload() : this.router.navigate(['/']);
          },
          error: (_error) => {
            this.showError(this.deleteAssessmentErrorMessage);
          }
        });
      }
    })
  }


  private showError(message: string) {
    this.snackBar.openFromComponent(NotificationSnackbarComponent, {
      data: {message: message, iconType: "error_outline", notificationType: "Error:"}, panelClass: ['error-snackBar'],
      duration: 2000,
      verticalPosition: "top",
      horizontalPosition: "center"
    })
  }
}


