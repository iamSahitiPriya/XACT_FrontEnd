import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DatePipe} from "@angular/common";
import {AdminAssessmentRequest} from "../../../types/Admin/adminAssessmentRequest";
import {AdminAssessmentResponse} from "../../../types/Admin/adminAssessmentResponse";
import {saveAs} from "file-saver";
import {Subject, takeUntil} from "rxjs";
import {data_local} from "../../../../assets/messages";


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  selectedOption = 0;

  datePipe: DatePipe = new DatePipe('en-US');
  todayDate: string | null;
  myDate = new Date();
  startDate: string | null;
  endDate: string | null;
  adminAssessmentRequest: AdminAssessmentRequest = {assessmentId: 0, endDate: "", startDate: ""};
  adminAssessmentResponse: AdminAssessmentResponse = {
    totalActiveAssessments: 0,
    totalAssessments: 0,
    totalCompleteAssessments: 0
  };

  private destroy$: Subject<void> = new Subject<void>();

  Total_Assessment = data_local.ADMIN_DASHBOARD_LABEL.TOTAL_ASSESSMENT;
  Active_Assessment = data_local.ADMIN_DASHBOARD_LABEL.TOTAL_ACTIVE;
  Complete_Assessment = data_local.ADMIN_DASHBOARD_LABEL.TOTAL_COMPLETE;
  last_month = data_local.DROPDOWN_OPTION_TEXT.LAST_MONTH;
  last_week = data_local.DROPDOWN_OPTION_TEXT.LAST_WEEK;
  last_quarter=data_local.DROPDOWN_OPTION_TEXT.LAST_QUARTER;
  last_year= data_local.DROPDOWN_OPTION_TEXT.LAST_YEAR;
  download_label =data_local.ADMIN_DASHBOARD_LABEL.DOWNLOAD_REPORT;
  download =data_local.ADMIN_DASHBOARD_LABEL.DOWNLOAD_REPORT_LABEL;
  dropdown_label =data_local.ADMIN_DASHBOARD_LABEL.DROPDOWN_LABEL;


  ngOnInit(): void {
    this.todayDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
    this.getAssessmentDataForQuarter();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  constructor(private appService: AppServiceService, private _snackBar: MatSnackBar) {
  }

  // dateRange() {
  //   this.selectedOption = 2;
  //   this.getAssessmentDataForDateRange();
  // }


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
    }
  }

  showError(message: string, action: string) {
    this._snackBar.open(message, action, {
      verticalPosition: 'top',
      panelClass: ['errorSnackbar'],
      duration: 2000
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
    this.setAssessmentData(this.setYearRequest());
  }

  setAssessmentData(adminRequest: AdminAssessmentRequest) {
    this.appService.getAdminAssessment(adminRequest).pipe(takeUntil(this.destroy$)).subscribe({
      next: (_data) => {
        this.adminAssessmentResponse.totalAssessments = _data.totalAssessments;
        this.adminAssessmentResponse.totalActiveAssessments = _data.totalActiveAssessments;
        this.adminAssessmentResponse.totalCompleteAssessments = _data.totalCompleteAssessments;
      }, error: _error => {
        this.showError("Data cannot be saved", "Close");
      }
    })
  }

  // getStartDate(type: string, event: MatDatepickerInputEvent<Date>) {
  //   this.startDate = this.datePipe.transform(event.value, 'YYYY-MM-dd');
  // }
  //
  // getEndDate(type: string, event: MatDatepickerInputEvent<Date>) {
  //   this.endDate = this.datePipe.transform(event.value, 'YYYY-MM-dd');
  // }
  //
  // getAssessmentDataForDateRange() {
  //   if (this.startDate != null && this.endDate != null) {
  //     this.adminAssessmentRequest.startDate = this.endDate;
  //     this.adminAssessmentRequest.endDate = this.startDate;
  //     this.adminAssessmentRequest.assessmentId = 1;
  //   }
  //   this.setAssessmentData(this.adminAssessmentRequest);
  // }

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
    }
  }

  getReport(adminAssessmentRequest: AdminAssessmentRequest) {
    const reportName = "XAct-AdminReport-" + this.datePipe.transform(adminAssessmentRequest.endDate, 'dd-MM-YYYY') + "-to-" + this.datePipe.transform(adminAssessmentRequest.startDate, 'dd-MM-YYYY') + ".xlsx";
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


  // selectedOptions() {
  //   this.selectedOption = 4;
  // }
}
