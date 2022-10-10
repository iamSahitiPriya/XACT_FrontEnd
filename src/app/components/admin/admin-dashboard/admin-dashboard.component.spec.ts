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
import {NgbCalendar, NgbDate, NgbDatepickerConfig} from "@ng-bootstrap/ng-bootstrap";

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


    let date = new Date();
    date.setDate(date.getDate() - 7);
    let weekDate=component.datePipe.transform(date,'YYYY-MM-dd');

    component.ngOnInit()
    component.selectedOption=1
    jest.spyOn(component,'inputChange');
    component.inputChange();
    jest.spyOn(component,'getAssessmentDataForWeek');

    expect(component.adminAssessmentRequest.endDate).toEqual(weekDate);
  });

  it("should able to get custom date data when selected", () => {
    component.ngOnInit()
    component.selectedOption=4
    jest.spyOn(component,'inputChange');
    jest.spyOn(component,'setCustomOption');
    component.inputChange();

    expect(component.setCustomOption).toHaveBeenCalled();
  });


  it("should able to get Month end date when getAssessmentDataForMonth is called", () => {


    let date = new Date();
    date.setDate(date.getDate() - 30);
    let monthDate=component.datePipe.transform(date,'YYYY-MM-dd');

    component.ngOnInit()
    component.selectedOption=2
    jest.spyOn(component,'inputChange');
    component.inputChange();
    jest.spyOn(component,'getAssessmentDataForMonth');

    expect(component.adminAssessmentRequest.endDate).toEqual(monthDate);
  });

  it("should able to get Year end date when getAssessmentDataForYear is called", () => {


    let date = new Date();
    date.setDate(date.getDate() - 365);
    let yearDate=component.datePipe.transform(date,'YYYY-MM-dd');
    component.ngOnInit()
    component.selectedOption=3
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

  it("should disable future dates for custom selection", () =>{
    component.currentDate = new NgbDate(2022,10,1);
    jest.spyOn(component,'isDisabled');
    const date = new NgbDate(2022,10,5);
    expect(component.isDisabled(date)).toBe(true);
  })

  it("should able to set the display text as custom when setCustomOption", () => {
    component.selectedOption = 0;
    component.displayText = "";
    component.ngOnInit()
    jest.spyOn(component,"setCustomOption");
    component.setCustomOption();
    expect(component.selectedOption).toBe(4);
    expect(component.displayText).toBe("Custom");
  });

  it("should be able to set the display text as selected date range", () => {
    component.fromDate = new NgbDate(2022,10,1);
    component.toDate = new NgbDate(2022,10,30);

    component.ngOnInit()
    jest.spyOn(component,"selectCustomDateRange");
    component.selectCustomDateRange();

    expect(component.displayText).toBe("2022 Oct 1 - 2022 Oct 30");

    expect(component.adminAssessmentRequest.endDate).toBe("2022-10-1")
  })

  it("should be able to set the display text as single selected date and later select new toDate ", () => {
    component.fromDate = new NgbDate(2022,10,1);
    component.toDate = null;
    let date = new NgbDate(2022,10,10);

    component.ngOnInit()
    jest.spyOn(component,"selectCustomDateRange");
    component.selectCustomDateRange();

    expect(component.displayText).toBe("2022 Oct 1 - 2022 Oct 1");

    expect(component.adminAssessmentRequest.endDate).toBe("2022-10-1")

    component.toDate = null;
    jest.spyOn(component,"onDateSelection")
    component.onDateSelection(date);

    expect(component.toDate).toEqual({"day": 10, "month": 10, "year": 2022});
  })

  it("should set the from date as selected date when from and to dates are null",() => {
    component.fromDate = null;
    component.toDate = null;
    let date = new NgbDate(2022,10,10);

    component.ngOnInit();
    component.onDateSelection(date);

    expect(component.fromDate).toEqual({"day": 10, "month": 10, "year": 2022});
  })

  it("should be able to visualize the date range",() => {
    component.fromDate = new NgbDate(2022,3,23);
    component.toDate = null;
    component.hoveredDate = new NgbDate(2022,3,25);

    let date = new NgbDate(2022,3,24);

    component.ngOnInit();
    jest.spyOn(component,"isHovered");

    expect(component.isHovered(date)).toBe(true);
  })

  it("should be able to visualize the dates inside the range and select new dates",() => {
    component.fromDate = new NgbDate(2022,3,23);
    component.toDate = new NgbDate(2022,3,29);
    let date = new NgbDate(2022,3,24);

    component.ngOnInit();
    jest.spyOn(component,"isRange");
    jest.spyOn(component,"isHovered");
    jest.spyOn(component,"isInside")


    expect(component.isRange(date)).toBe(true);
    expect(component.isInside).toHaveBeenCalled();

    jest.spyOn(component,"onDateSelection");
    component.onDateSelection(date);
    expect(component.fromDate).toEqual({"day": 24, "month": 3, "year": 2022})
  })


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


    jest.spyOn(component, 'getReportForWeek');
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();
    component.ngOnInit()
    fixture.detectChanges();
    component.selectedOption=1
    let generateReport = fixture.debugElement.nativeElement.querySelector("#generate-report");
    generateReport.click();
    tick();
    expect(component.getReportForWeek).toHaveBeenCalled();
    flush()
    flushMicrotasks();
    discardPeriodicTasks();
  }));
  it('should  generate report for Month', () => {


    jest.spyOn(component, 'getReportForMonth');
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();
    component.ngOnInit()
    fixture.detectChanges();
    component.selectedOption=2
    let generateReport = fixture.debugElement.nativeElement.querySelector("#generate-report");
    generateReport.click();
    expect(component.getReportForMonth).toHaveBeenCalled();
  });
  it('should  generate report for Year', () => {


    jest.spyOn(component, 'getReportForYear');
    component.ngOnInit()
    fixture.detectChanges();
    component.selectedOption=3
    let generateReport = fixture.debugElement.nativeElement.querySelector("#generate-report");
    generateReport.click();
    expect(component.getReportForYear).toHaveBeenCalled();
  });

  it('should  generate report for Custom date range', () => {
    jest.spyOn(component, 'getReportForCustomDateRange');
    component.ngOnInit()
    fixture.detectChanges();
    component.selectedOption=4
    let generateReport = fixture.debugElement.nativeElement.querySelector("#generate-report");
    generateReport.click();
    expect(component.getReportForCustomDateRange).toHaveBeenCalled();
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
