/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  flush,
  flushMicrotasks,
  TestBed,
  tick
} from '@angular/core/testing';

import {AdminDashboardComponent} from './admin-dashboard.component';
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {HttpClientModule} from "@angular/common/http";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatNativeDateModule, MatOptionModule} from "@angular/material/core";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule} from "@angular/forms";
import {of, throwError} from "rxjs";
import {AdminAssessmentRequest} from "../../../types/Admin/adminAssessmentRequest";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {AdminAssessmentResponse} from "../../../types/Admin/adminAssessmentResponse";
import {MatTooltipModule} from "@angular/material/tooltip";

class MockAppService {
 adminAssessmentResponse : AdminAssessmentResponse={
   totalActiveAssessments: 0,
   totalAssessments: 0,
   totalCompleteAssessments: 0
 };
  getAdminAssessment(adminAssessmentRequest: AdminAssessmentRequest) {
    if (adminAssessmentRequest.assessmentId === 1) {
      return of(this.adminAssessmentResponse);
    } else {
      return throwError("Error!")
    }
  }
  generateAdminReport() {
    return of(new Blob());
  }
}

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let mockAppService:MockAppService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDashboardComponent ],
      imports:[MatIconModule, MatCardModule,HttpClientModule,MatSnackBarModule,MatFormFieldModule,MatTooltipModule,MatSelectModule,MatOptionModule,BrowserAnimationsModule,NoopAnimationsModule,FormsModule,MatDatepickerModule,MatNativeDateModule],
      providers:[{provide : AppServiceService, useClass :MockAppService}],
    })

    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    mockAppService=new MockAppService();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should able to get quarter end date when getAssessmentDataForQuarter is called", () => {

    component.selectedOption=0;

    let date = new Date();
    date.setDate(date.getDate() - 92);
    let quarterDate=component.datePipe.transform(date,'YYYY-MM-dd');

    jest.spyOn(component,'getAssessmentDataForQuarter')
    component.ngOnInit()
    jest.spyOn(component,'inputChange')
    component.inputChange();

    expect(component.adminAssessmentRequest.endDate).toEqual(quarterDate);
  });

  it("should able to get week end date when getAssessmentDataForWeek is called", () => {
    component.selectedOption=1

    let date = new Date();
    date.setDate(date.getDate() - 7);
    let weekDate=component.datePipe.transform(date,'YYYY-MM-dd');

    component.ngOnInit()
    jest.spyOn(component,'inputChange');
    component.inputChange();
    jest.spyOn(component,'getAssessmentDataForWeek');

    expect(component.adminAssessmentRequest.endDate).toEqual(weekDate);
  });

  it("should able to get Month end date when getAssessmentDataForMonth is called", () => {
    component.selectedOption=2

    let date = new Date();
    date.setDate(date.getDate() - 30);
    let monthDate=component.datePipe.transform(date,'YYYY-MM-dd');

    component.ngOnInit()
    jest.spyOn(component,'inputChange');
    component.inputChange();
    jest.spyOn(component,'getAssessmentDataForMonth');

    expect(component.adminAssessmentRequest.endDate).toEqual(monthDate);
  });

  it("should able to get Year end date when getAssessmentDataForYear is called", () => {
    component.selectedOption=3

    let date = new Date();
    date.setDate(date.getDate() - 365);
    let yearDate=component.datePipe.transform(date,'YYYY-MM-dd');


    component.ngOnInit()
    jest.spyOn(component,'inputChange');
    component.inputChange();
    jest.spyOn(component,'getAssessmentDataForYear');

    expect(component.adminAssessmentRequest.endDate).toEqual(yearDate);
  });

  it("should call the error whenever a problem occurs", () => {
    jest.spyOn(component, "showError")
    component.showError("Error", "Close")
    expect(component.showError).toHaveBeenCalled()

  });

  // it("should able to get the calender start date", () => {
  //
  //   let startDate="2022-08-12";
  //  let  endDate="2022-09-12";
  //    let firstParameter : MatDatepickerInputBase<any,any>;
  //    let secondParameter:HTMLElement;
  //
  //   let MatDate: MatDatepickerInputEvent<Date, unknown>;
  //   // @ts-ignore
  //   MatDate = new MatDatepickerInputEvent(firstParameter.value=startDate, secondParameter);
  //   jest.spyOn(component,'getStartDate');
  //   component.getStartDate(startDate,MatDate);
  //   jest.spyOn(component,'getEndDate');
  //   component.getEndDate(endDate,MatDate);
  //
  //   expect(component.startDate).toEqual("2022-08-12");
  // });

  // it("should able to get assessment data between date range",()=>{
  //   let adminAssessmentRequest = {
  //     assessmentId: 0, endDate: "", startDate: ""
  //   };
  //
  //   let adminAssessmentResponse = {
  //     totalAssessments: 2,
  //     totalActiveAssessments: 0,
  //     totalCompleteAssessments: 0
  //   };
  //
  //   component.startDate="2022-07-13";
  //   component.endDate="2022-09-24";
  //   component.adminAssessmentRequest.assessmentId=1;
  //   jest.spyOn(component,'getAssessmentDataForDateRange');
  //   component.getAssessmentDataForDateRange();
  //   component.adminAssessmentResponse.totalAssessments = adminAssessmentResponse.totalAssessments;
  //   mockAppService.getAdminAssessment(component.adminAssessmentRequest).subscribe((data) => {
  //     expect(data).toBe(adminAssessmentResponse)
  //     data = adminAssessmentResponse;
  //
  //   })
  //
  //   expect(component.adminAssessmentResponse.totalAssessments).toEqual(2);
  // })

  it('should  generate report for quarter', fakeAsync(() => {
    component.selectedOption=0

    jest.spyOn(component, 'getReportForQuarter');
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();
    component.ngOnInit()
    fixture.detectChanges();
    let generateReport = fixture.debugElement.nativeElement.querySelector("#generate-report");
    generateReport.click();
    tick();
    expect(component.getReportForQuarter).toHaveBeenCalled();
    flush()
    flushMicrotasks();
    discardPeriodicTasks();
  }));

  it('should  generate report for week', fakeAsync(() => {
    component.selectedOption=1

    jest.spyOn(component, 'getReportForWeek');
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();
    component.ngOnInit()
    fixture.detectChanges();
    let generateReport = fixture.debugElement.nativeElement.querySelector("#generate-report");
    generateReport.click();
    tick();
    expect(component.getReportForWeek).toHaveBeenCalled();
    flush()
    flushMicrotasks();
    discardPeriodicTasks();
  }));
  it('should  generate report for Month', () => {
    component.selectedOption=2

    jest.spyOn(component, 'getReportForMonth');
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();
    component.ngOnInit()
    fixture.detectChanges();
    let generateReport = fixture.debugElement.nativeElement.querySelector("#generate-report");
    generateReport.click();
    expect(component.getReportForMonth).toHaveBeenCalled();
  });
  it('should  generate report for Year', () => {
    component.selectedOption=3

    jest.spyOn(component, 'getReportForYear');
    component.ngOnInit()
    fixture.detectChanges();
    let generateReport = fixture.debugElement.nativeElement.querySelector("#generate-report");
    generateReport.click();
    expect(component.getReportForYear).toHaveBeenCalled();
  });

  it("should throw error when problem occurs if undefined is sent",  () => {
    let adminAssessmentRequest = {
      assessmentId: 0, endDate: "", startDate: ""
    };

    component.selectedOption=0;
    component.adminAssessmentRequest.assessmentId=0;
    component.adminAssessmentRequest.startDate="";
    component.adminAssessmentRequest.endDate="";
    jest.spyOn(component,'inputChange');
    jest.spyOn(component,'getAssessmentDataForQuarter');
    jest.spyOn(component,'setAssessmentData')

    component.setAssessmentData(component.adminAssessmentRequest);

    mockAppService.getAdminAssessment(adminAssessmentRequest).subscribe((data) => {
      expect(data).toBeUndefined()
    }, error => {
      expect(component.showError).toHaveBeenCalled()
      expect(error).toBe(new Error("Error!"))
    })
  });
});
