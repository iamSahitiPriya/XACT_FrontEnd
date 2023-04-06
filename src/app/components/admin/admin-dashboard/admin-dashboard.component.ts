/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DatePipe} from "@angular/common";
import {AdminAssessmentRequest} from "../../../types/Admin/adminAssessmentRequest";
import {AdminAssessmentResponse} from "../../../types/Admin/adminAssessmentResponse";
import {saveAs} from "file-saver";
import {Subject, takeUntil} from "rxjs";
import {data_local} from "../../../messages";
import {NgbCalendar, NgbDate, NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import {Router} from "@angular/router";

let MAXIMUM_NO_OF_DAYS: number = 700;
let HOURS: number = 24;
let MINUTES: number = 60;
let SECONDS: number = 60;
let MILLISECONDS: number = 1000;

const NOTIFICATION_DURATION = 2000;

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  selectedOption: number;
  datePipe: DatePipe = new DatePipe('en-US');
  todayDate: string | null;
  myDate = new Date();
  adminAssessmentRequest: AdminAssessmentRequest = {assessmentId: 0, endDate: "", startDate: ""};
  adminAssessmentResponse: AdminAssessmentResponse = {
    totalActiveAssessments: 0,
    totalAssessments: 0,
    totalCompleteAssessments: 0
  };

  private destroy$: Subject<void> = new Subject<void>();

  Total_Assessment = data_local.ADMIN.DASHBOARD.TOTAL_ASSESSMENT;
  Active_Assessment = data_local.ADMIN.DASHBOARD.TOTAL_ACTIVE;
  Complete_Assessment = data_local.ADMIN.DASHBOARD.TOTAL_COMPLETE;
  dashboard_Title = data_local.ADMIN.DASHBOARD.DASHBOARD_TITLE;
  last_month = data_local.DROPDOWN_OPTION_TEXT.LAST_MONTH;
  last_week = data_local.DROPDOWN_OPTION_TEXT.LAST_WEEK;
  last_quarter = data_local.DROPDOWN_OPTION_TEXT.LAST_QUARTER;
  last_year = data_local.DROPDOWN_OPTION_TEXT.LAST_YEAR;
  download_label = data_local.ADMIN.DASHBOARD.DOWNLOAD_REPORT;
  download = data_local.ADMIN.DASHBOARD.DOWNLOAD_REPORT_LABEL;
  dropdown_label = data_local.ADMIN.DASHBOARD.DROPDOWN_LABEL;
  apply_button_text = data_local.ADMIN.DASHBOARD.APPLY_BUTTON_TEXT;
  total = data_local.ADMIN.DASHBOARD.TOTAL_SUBTEXT;
  custom_date_error_message = data_local.ADMIN.DASHBOARD.CUSTOM_DATE_ERROR_MESSAGE


  custom: string = "Custom";
  displayText: string = this.last_quarter;
  noOfDays: number = 0;

  ngOnInit(): void {
    this.todayDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
    this.getAssessmentDataForMonth();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null = null;
  toDate: NgbDate | null = null;
  currentDate: NgbDate | null = null;

  constructor(private appService: AppServiceService, private _snackBar: MatSnackBar, calendar: NgbCalendar, private config: NgbDatepickerConfig,private router: Router) {
    this.fromDate = calendar.getPrev(calendar.getToday(), 'd', 1);
    this.toDate = this.currentDate = calendar.getToday();
    const currentDate = new Date();
    config.maxDate = {year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate()};
    config.minDate = {year: 2022, month: 1, day: 1};
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    this.noOfDays = this.getNoOfDays()
  }

  private getNoOfDays() {
    return (this.formatDateToTime(this.toDate) - this.formatDateToTime(this.fromDate)) / (HOURS * MINUTES * SECONDS * MILLISECONDS);
  }

  private formatDateToTime(date: null | NgbDate) {
    return new Date(date?.year + '-' + date?.month + '-' + date?.day).getTime();
  }

  isDisabled(date: NgbDate) {
    return date.after(this.currentDate)
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }


  inputChange() {
    switch (this.selectedOption) {
      case 0 : {
        this.getAssessmentDataForQuarter()
        break;
      }
      case 1: {
        this.getAssessmentDataForWeek()
        break;
      }
      case 2: {
        this.getAssessmentDataForMonth()
        break;
      }
      case 3: {
        this.getAssessmentDataForYear()
        break;
      }
      case 4: {
        this.setCustomOption()
        break;
      }
    }
  }

  showError(message: string, action: string) {
    this._snackBar.open(message, action, {
      verticalPosition: 'top',
      panelClass: ['errorSnackbar'],
      duration: NOTIFICATION_DURATION
    })
  }

  setQuarterRequest(): AdminAssessmentRequest {
    let quarterDate: string | null;
    let date = new Date();
    date.setDate(date.getDate() - 92);
    quarterDate = this.datePipe.transform(date, 'YYYY-MM-dd');
    if (this.todayDate != null && quarterDate != null) {
      this.adminAssessmentRequest.startDate = this.todayDate;
      this.adminAssessmentRequest.endDate = quarterDate;
      this.adminAssessmentRequest.assessmentId = 1;
    }
    return this.adminAssessmentRequest
  }

  getAssessmentDataForQuarter() {
    this.selectedOption = 0;
    this.displayText = this.last_quarter;
    this.setAssessmentData(this.setQuarterRequest());
  }

  setWeekRequest(): AdminAssessmentRequest {
    let weekDate: string | null;
    let date = new Date();
    date.setDate(date.getDate() - 7);
    weekDate = this.datePipe.transform(date, 'YYYY-MM-dd');
    if (this.todayDate != null && weekDate != null) {
      this.adminAssessmentRequest.startDate = this.todayDate;
      this.adminAssessmentRequest.endDate = weekDate;
      this.adminAssessmentRequest.assessmentId = 1;
    }
    return this.adminAssessmentRequest;
  }

  getAssessmentDataForWeek() {
    this.selectedOption = 1;
    this.displayText = this.last_week;
    this.setAssessmentData(this.setWeekRequest());
  }

  setMonthRequest(): AdminAssessmentRequest {
    let monthDate: string | null;
    let date = new Date();
    date.setDate(date.getDate() - 30);
    monthDate = this.datePipe.transform(date, 'YYYY-MM-dd');
    if (this.todayDate != null && monthDate != null) {
      this.adminAssessmentRequest.startDate = this.todayDate;
      this.adminAssessmentRequest.endDate = monthDate;
      this.adminAssessmentRequest.assessmentId = 1;
    }
    return this.adminAssessmentRequest;
  }

  getAssessmentDataForMonth() {
    this.selectedOption = 2;
    this.displayText = this.last_month;
    this.setAssessmentData(this.setMonthRequest());
  }

  setYearRequest(): AdminAssessmentRequest {
    let yearDate: string | null;
    let date = new Date();
    date.setDate(date.getDate() - 365);
    yearDate = this.datePipe.transform(date, 'YYYY-MM-dd');
    if (this.todayDate != null && yearDate != null) {
      this.adminAssessmentRequest.startDate = this.todayDate;
      this.adminAssessmentRequest.endDate = yearDate;
      this.adminAssessmentRequest.assessmentId = 1;
    }
    return this.adminAssessmentRequest;
  }

  getAssessmentDataForYear() {
    this.selectedOption = 3;
    this.displayText = this.last_year;
    this.setAssessmentData(this.setYearRequest());
  }

  setAssessmentData(adminRequest: AdminAssessmentRequest) {
    this.custom = 'Custom';
    if (adminRequest.assessmentId !== -1) {
      this.appService.getAdminAssessment(adminRequest).pipe(takeUntil(this.destroy$)).subscribe({
        next: (_data) => {
          this.adminAssessmentResponse.totalAssessments = _data.totalAssessments;
          this.adminAssessmentResponse.totalActiveAssessments = _data.totalActiveAssessments;
          this.adminAssessmentResponse.totalCompleteAssessments = _data.totalCompleteAssessments;
        }, error: _error => {
          this.showError(data_local.ADMIN.DASHBOARD.ERROR_MESSAGE, "Close");
        }
      })
      return true;
    } else {
      return false;
    }
  }

  getAssessmentDataForCustomDateRange() {
    if (this.setAssessmentData(this.setCustomDateRequest())) {
      this.displayText = this.custom = this.fromDate?.year + " " + this.getMonthName(this.fromDate?.month) + " " + this.fromDate?.day + " - " + this.toDate?.year + " " + this.getMonthName(this.toDate?.month) + " " + (this.toDate?.day);
      this.selectedOption = 4;
    } else {
      this.displayText = this.custom = "Custom";
      this.showError(this.custom_date_error_message, "Close");
      let date = new Date();
      this.fromDate = this.toDate = new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
    }
  }

  setCustomDateRequest() {
    if (this.noOfDays <= MAXIMUM_NO_OF_DAYS) {
      if (this.fromDate != null && this.toDate != null) {
        this.adminAssessmentRequest.startDate = String(this.toDate.year + "-" + this.toDate.month + "-" + this.toDate.day);
        this.adminAssessmentRequest.endDate = String(this.fromDate.year + "-" + this.fromDate.month + "-" + this.fromDate.day);
        this.adminAssessmentRequest.assessmentId = 1;
      }
    } else {
      this.adminAssessmentRequest.assessmentId = -1;
    }
    return this.adminAssessmentRequest;
  }

  downloadReport() {
    switch (this.selectedOption) {
      case 0 : {
        this.getReportForQuarter()
        break;
      }
      case 1: {
        this.getReportForWeek()
        break;
      }
      case 2: {
        this.getReportForMonth()
        break;
      }
      case 3: {
        this.getReportForYear()
        break;
      }
      case 4: {
        this.getReportForCustomDateRange()
        break;
      }
    }
  }

  getReport(adminAssessmentRequest: AdminAssessmentRequest) {
    const reportName = "Thoughtworks-XAct-AdminReport-" + this.datePipe.transform(adminAssessmentRequest.endDate, 'dd-MM-YYYY') + "-to-" + this.datePipe.transform(adminAssessmentRequest.startDate, 'dd-MM-YYYY') + ".xlsx";
    this.appService.generateAdminReport(adminAssessmentRequest).subscribe(blob => {
      saveAs(blob, reportName);
    });
  }


  getReportForQuarter() {
    this.getReport(this.setQuarterRequest());
  }

  getReportForWeek() {
    this.getReport(this.setWeekRequest());
  }

  getReportForMonth() {
    this.getReport(this.setMonthRequest());
  }

  getReportForYear() {
    this.getReport(this.setYearRequest());
  }

  getReportForCustomDateRange() {
    this.getReport(this.setCustomDateRequest());
  }


  setCustomOption() {
    this.displayText = this.custom = "Custom";
    this.selectedOption = 4;
  }

  getMonthName(monthNumber: number | undefined) {
    const date = new Date();
    if (monthNumber !== undefined) {
      date.setMonth(monthNumber - 1);
    }

    return date.toLocaleString('en-US', {month: 'short'});
  }


  selectCustomDateRange() {
    if (this.toDate === null) {
      this.toDate = this.fromDate;
    }
    this.getAssessmentDataForCustomDateRange()
  }
}

