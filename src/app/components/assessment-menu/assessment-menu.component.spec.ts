import {ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick} from '@angular/core/testing';

import {AssessmentMenuComponent} from './assessment-menu.component';
import {MatMenuModule} from "@angular/material/menu";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {MatIconModule} from "@angular/material/icon";
import {of} from "rxjs";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {OKTA_AUTH} from "@okta/okta-angular";
import {RouterTestingModule} from "@angular/router/testing";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatTableModule} from "@angular/material/table";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatButtonModule} from "@angular/material/button";
import {MatRippleModule} from "@angular/material/core";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../reducers/reducers";
import {AssessmentStructure} from "../../types/assessmentStructure";

class MockDialog {
  open() {
    return {
      afterClosed: () => of(true)
    }
  }

  closeAll() {
  }

  addUser() {
  }
}
describe('AssessmentMenuComponent', () => {
  let dialog: any;
  let matDialog: any
  const oktaAuth = require('@okta/okta-auth-js');

  let component: AssessmentMenuComponent;
  let fixture: ComponentFixture<AssessmentMenuComponent>;

  class MockAppService {
    generateReport() {
      return of(new Blob());
    }

    finishAssessment() {
      return of({assessmentId: 123, assessmentName: "Demo", assessmentStatus: "Completed"});
    }

    reopenAssessment() {
      return of({assessmentId: 123, assessmentName: "Demo", assessmentStatus: "Active"});
    }

  }

  const mockAssessment : AssessmentStructure ={
    answerResponseList: [],
    assessmentId: 123,
    assessmentName: "Mock",
    assessmentStatus: "Active",
    domain: "IT",
    industry: "Telecom",
    organisationName: "Rel",
    parameterRatingAndRecommendation: [],
    teamSize: 10,
    topicRatingAndRecommendation: [],
    updatedAt: 0,
    users: []
  }


  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [AssessmentMenuComponent],
      imports: [MatDialogModule, RouterTestingModule, MatFormFieldModule, MatIconModule, MatInputModule,
        MatTableModule, HttpClientTestingModule, NoopAnimationsModule,RouterModule,
        ReactiveFormsModule, MatSnackBarModule,FormsModule,MatButtonModule,MatRippleModule,MatMenuModule,
        StoreModule.forRoot(reducers)],
      providers: [
        {provide: AppServiceService, useClass: MockAppService},
        {provide: OKTA_AUTH, useValue: oktaAuth},
        {provide: MatDialog, useClass: MockDialog}


      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    jest.mock('@okta/okta-auth-js');
    oktaAuth.getUser = jest.fn(() => Promise.resolve({name: 'Sam', email: "sam@gmail.com"}));
    fixture = TestBed.createComponent(AssessmentMenuComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
    matDialog = fixture.debugElement.injector.get(MatDialog)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call generate report on click', fakeAsync(() => {
    discardPeriodicTasks()
    component.answerResponse1 = of({assessmentId:1,assessmentName:"abc",organisationName:"xyz",assessmentStatus:"Completed",updatedAt:0,domain:"TW",industry:"IT",teamSize:2,users:[],answerResponseList:[],parameterRatingAndRecommendation:[],topicRatingAndRecommendation:[]})
    jest.spyOn(component, 'generateReport');
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();
    component.ngOnInit()
    fixture.detectChanges();
    let generateReport = fixture.debugElement.nativeElement.querySelector("#generate-report");
    generateReport.click();
    tick();
    expect(component.generateReport).toHaveBeenCalled();
    flush()
  }));

  it('should call finish assessment if active', fakeAsync(() => {
    discardPeriodicTasks()
    component.answerResponse1 = of({assessmentId:1,assessmentName:"abc",organisationName:"xyz",assessmentStatus:"Active",updatedAt:0,domain:"TW",industry:"IT",teamSize:2,users:[],answerResponseList:[],parameterRatingAndRecommendation:[],topicRatingAndRecommendation:[]})
    component.assessment = mockAssessment;
    component.assessment.assessmentStatus = "Active";
    jest.spyOn(component, 'confirmFinishAssessmentAction');
    jest.spyOn(matDialog,'open')
    jest.spyOn(component,'finishAssessment')
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();
    component.ngOnInit()
    fixture.detectChanges();
    let finishAssessment = fixture.debugElement.nativeElement.querySelector("#finishAssessment");
    finishAssessment.click();
    tick();
    expect(component.confirmFinishAssessmentAction).toHaveBeenCalled();
    flush()
  }));

  it('should call reopen assessment if completed', fakeAsync(() => {
    discardPeriodicTasks()
    component.answerResponse1 = of({assessmentId:1,assessmentName:"abc",organisationName:"xyz",assessmentStatus:"Completed",updatedAt:0,domain:"TW",industry:"IT",teamSize:2,users:[],answerResponseList:[],parameterRatingAndRecommendation:[],topicRatingAndRecommendation:[]})
    component.assessment = mockAssessment;
    component.assessment.assessmentStatus = "Completed";
    jest.spyOn(component, 'reopenAssessment');
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();
    component.ngOnInit()
    fixture.detectChanges();
    let reopenAssessment = fixture.debugElement.nativeElement.querySelector("#reopenAssessment");
    reopenAssessment.click();
    tick();
    expect(component.reopenAssessment).toHaveBeenCalled();
    flush()
  }));

  it('should complete assessment', () => {

    component.answerResponse1 = of({
      assessmentId: 5,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentStatus: "Completed",
      updatedAt: 1654664982698,
      domain: "",
      industry: "",
      teamSize: 0,
      users: [],
      answerResponseList: [
        {
          questionId: 1,
          answer: "answer1"
        }],
      topicRatingAndRecommendation: [{topicId: 0, rating: "1", recommendation: ""}],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: "2", recommendation: ""}]
    })
    component.ngOnInit()
    component.finishAssessment();
    expect(component.assessment.assessmentStatus).toBe("Completed");
  });
  it('should open dialog box', () => {
    jest.spyOn(matDialog, 'open')
    component.openAssessment("")
    fixture.detectChanges()
    expect(matDialog.open).toHaveBeenCalled()
  });
  it('should close the popup', () => {
    jest.spyOn(matDialog, 'closeAll')
    component.closePopUp()
    fixture.detectChanges()
    expect(matDialog.closeAll).toHaveBeenCalled()
  });
});






