import {ComponentFixture, fakeAsync, flush, TestBed, tick} from '@angular/core/testing';

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

class MockDialog {
  open() {
    return {
      afterClosed: () => of({})
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

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [AssessmentMenuComponent],
      imports: [MatDialogModule, RouterTestingModule, MatFormFieldModule, MatIconModule, MatInputModule,
        MatTableModule, HttpClientTestingModule, NoopAnimationsModule,RouterModule,
        ReactiveFormsModule, MatSnackBarModule,FormsModule,MatButtonModule,MatRippleModule,MatMenuModule,
      StoreModule.forRoot({})],
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
    component.answerResponse1 = of({assessmentId:1,assessmentName:"abc",organisationName:"xyz",assessmentStatus:"Active",updatedAt:0,domain:"TW",industry:"IT",teamSize:2,users:[],answerResponseList:[],parameterRatingAndRecommendation:[],topicRatingAndRecommendation:[]})
    component.assessmentStatus = "Active";
    jest.spyOn(component, 'confirmFinishAssessmentAction');
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
    component.answerResponse1 = of({assessmentId:1,assessmentName:"abc",organisationName:"xyz",assessmentStatus:"Completed",updatedAt:0,domain:"TW",industry:"IT",teamSize:2,users:[],answerResponseList:[],parameterRatingAndRecommendation:[],topicRatingAndRecommendation:[]})
    component.assessmentStatus = "Completed";
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
    expect(component.assessmentStatus).toBe("Completed");
  });
  it("should set the assessment name and status", () => {
    component.assessment = {assessmentId:1,assessmentName:"abc",organisationName:"xyz",assessmentStatus:"Active",updatedAt:0,domain:"TW",industry:"IT",teamSize:2,users:[],answerResponseList:[],parameterRatingAndRecommendation:[],topicRatingAndRecommendation:[]}
    component.setAssessment()
    expect(component.assessmentName).toBe("abc")
    expect(component.organizationName).toBe("xyz")
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
  it("should get valid users", () => {
    component.userEmail = "abc@thougworks.com, xyz@thoughtworks.com"
    let a = component.getValidUsers()
    let dummyResponse = [{"email": "abc@thougworks.com"}, {"email": " xyz@thoughtworks.com"}]
    expect(a).toStrictEqual(dummyResponse)
  });
});






