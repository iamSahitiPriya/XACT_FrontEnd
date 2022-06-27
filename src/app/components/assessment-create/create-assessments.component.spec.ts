/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateAssessmentsComponent} from './create-assessments.component';
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {OKTA_AUTH} from "@okta/okta-angular";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatTableModule} from "@angular/material/table";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Observable, of, throwError} from "rxjs";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {AssessmentRequest} from "../../types/assessmentRequest";
import {User} from "../../types/user";
import {RouterModule} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatRippleModule} from "@angular/material/core";
import {AssessmentStructure} from "../../types/assessmentStructure";


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

class MockAppService {
  assessmentMock = {
    "assessmentId": 45,
    "assessmentName": "xact",
    "organisationName": "abc",
    "assessmentStatus": "Active",
    "updatedAt": 1650886511968
  };

  mockedUser: User = {
    email: "sam@gmail.com",
    role: ""
  }
  public addAssessments(assessmentDataPayload: AssessmentRequest ): Observable<any> {
    if(assessmentDataPayload.assessmentName === "xact"){
      return of(this.assessmentMock)
    }
    else{
      return throwError("Error!")
    }
  }
  public updateAssessment(assessmentId:number,assessmentDataPayload: AssessmentRequest ): Observable<any> {
    if(assessmentDataPayload.assessmentName === "xact"){
      return of(this.assessmentMock)
    }
    else{
      return throwError("Error!")
    }
  }
  public getUserByEmail(email: "sam@gmail.com"): Observable<User> {
    return of(this.mockedUser)
  }
}


describe('CreateAssessmentsComponent', () => {
  let component: CreateAssessmentsComponent;
  let fixture: ComponentFixture<CreateAssessmentsComponent>;
  let dialog: any;
  let controller: HttpTestingController
  let mockAppService: MockAppService
  const original = window.location;
  let matDialog: any
  const oktaAuth = require('@okta/okta-auth-js');
  const reloadFn = () => {
    window.location.reload();
  };

  beforeEach(async () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {reload: jest.fn()}
    })
    jest.mock('@okta/okta-auth-js');
    oktaAuth.getUser = jest.fn(() => Promise.resolve({name: 'Sam', email: "sam@gmail.com"}));
    await TestBed.configureTestingModule({
      declarations: [CreateAssessmentsComponent],
      imports: [MatDialogModule, RouterTestingModule, MatFormFieldModule, MatIconModule, MatInputModule,
        MatTableModule, HttpClientTestingModule, NoopAnimationsModule,RouterModule,
        ReactiveFormsModule, MatSnackBarModule,FormsModule,MatButtonModule,MatRippleModule],
      providers: [
        {provide: OKTA_AUTH, useValue: oktaAuth},
        {provide: AppServiceService, useClass: MockAppService},
        {provide: MatDialog, useClass: MockDialog}

      ]
    })
      .compileComponents();
  });
  afterAll(() => {
    Object.defineProperty(window, 'location', {configurable: true, value: original});
  });

  beforeEach(() => {
    mockAppService = new MockAppService()
    fixture = TestBed.createComponent(CreateAssessmentsComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
    controller = TestBed.inject(HttpTestingController)
    fixture.detectChanges();
    matDialog = fixture.debugElement.injector.get(MatDialog)
    component.assessment=blankAssessment;
  });

  const blankAssessment : AssessmentStructure ={
    answerResponseList: [],
    assessmentId: -1,
    assessmentName: "",
    assessmentStatus: "",
    domain: "",
    industry: "",
    organisationName: "",
    parameterRatingAndRecommendation: [],
    teamSize: 0,
    topicRatingAndRecommendation: [],
    updatedAt: 0,
    users: []
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should close the popup', () => {
    jest.spyOn(matDialog, 'closeAll')
    component.assessment = mockAssessment;
    component.assessmentCopy = mockAssessment;
    component.close()
    fixture.detectChanges()
    expect(matDialog.closeAll).toHaveBeenCalled()
  });


  it('should save assessment and make the window reload', () => {
    component.assessment = mockAssessment;
    component.assessmentCopy = mockAssessment;
    const assessmentDataPayload:AssessmentRequest = {
      assessmentName: "xact", organisationName: "abc",
      domain: "abc", industry: "abc", teamSize: 12, users: []
    };
    const assessmentData =
      {
        "assessmentId": 45,
        "assessmentName": "xact",
        "organisationName": "abc",
        "assessmentStatus": "Active",
        "updatedAt": 1650886511968
      }

    component.createAssessmentForm.controls['assessmentNameValidator'].setValue("xact")
    component.createAssessmentForm.controls['organizationNameValidator'].setValue("abc")
    component.createAssessmentForm.controls['domainNameValidator'].setValue("abc")
    component.createAssessmentForm.controls['industryValidator'].setValue("xyz")
    component.createAssessmentForm.controls['teamSizeValidator'].setValue(12)
    expect(component.createAssessmentForm.valid).toBeTruthy()
    component.saveAssessment()
    expect(component).toBeTruthy()
    mockAppService.addAssessments(assessmentDataPayload).subscribe(data => {
      expect(data).toBe(assessmentData)
      console.log(data)
      expect(component.loading).toBe(false)
      reloadFn()
      expect(window.location.reload).toHaveBeenCalled()
    })
  });

  it("should call the form", () => {
    component.assessment = mockAssessment;
    component.assessmentCopy = mockAssessment;
    expect(component.form).toBeTruthy()
  });

  it("should return error for an unsuccessful creation of assessment", () => {
    component.assessment = mockAssessment;
    component.assessmentCopy = mockAssessment;

    const assessmentDataPayload:AssessmentRequest  = {
      assessmentName:"abc",organisationName:"abc",domain:"123", industry:"hello", teamSize:12, users:[]
    };
    component.createAssessmentForm.controls['assessmentNameValidator'].setValue("abc")
    component.createAssessmentForm.controls['organizationNameValidator'].setValue("abc")
    component.createAssessmentForm.controls['domainNameValidator'].setValue("abc")
    component.createAssessmentForm.controls['industryValidator'].setValue("xyz")
    component.createAssessmentForm.controls['teamSizeValidator'].setValue(12)
    expect(component.createAssessmentForm.valid).toBeTruthy()
    component.saveAssessment()

    mockAppService.addAssessments(assessmentDataPayload).subscribe((data) =>{
      expect(data).toBeUndefined()
    },(error) => {
      expect(component.loading).toBeFalsy()
      expect(error).toBe(new Error("Error!"))
    })
  });

  it('should update assessment', () => {
    component.assessment = mockAssessment;
    component.assessmentCopy = mockAssessment;
    const assessmentDataPayload:AssessmentRequest = {
      assessmentName: "xact", organisationName: "abc",
      domain: "abc", industry: "abc", teamSize: 12, users: []
    };
    const assessmentData =
      {
        "assessmentId": 45,
        "assessmentName": "xact",
        "organisationName": "abc",
        "assessmentStatus": "Active",
        "updatedAt": 1650886511968
      }

    component.createAssessmentForm.controls['assessmentNameValidator'].setValue("xact")
    component.createAssessmentForm.controls['organizationNameValidator'].setValue("abc")
    component.createAssessmentForm.controls['domainNameValidator'].setValue("abc")
    component.createAssessmentForm.controls['industryValidator'].setValue("xyz")
    component.createAssessmentForm.controls['teamSizeValidator'].setValue(12)
    expect(component.createAssessmentForm.valid).toBeTruthy()
    component.updateAssessment()
    expect(component).toBeTruthy()
    mockAppService.addAssessments(assessmentDataPayload).subscribe(data => {
      expect(data).toBe(assessmentData)
    })
    fixture.detectChanges()
  });

  it("should reset  the form", () => {
    component.assessment = mockAssessment;
    component.assessmentCopy = mockAssessment;
    component.assessment.assessmentName = "Changed";
    component.resetAssessment();
    expect(component.assessment.assessmentName).toBe(component.assessmentCopy.assessmentName);
  });
  it("should throw error if the assesssment details are empty while saving/updating", () => {
    component.saveAssessment()
    component.updateAssessment()
  });
});
