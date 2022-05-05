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
import {ReactiveFormsModule} from "@angular/forms";
import {Observable, of} from "rxjs";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {MatSnackBarModule} from "@angular/material/snack-bar";


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

  public addAssessments(assessmentDataPayload: {}): Observable<any> {
    return of(this.assessmentMock)
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
        MatTableModule, HttpClientTestingModule, NoopAnimationsModule,
        ReactiveFormsModule, MatSnackBarModule],
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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


  it('should save assessment and make the window reload', () => {
    const assessmentDataPayload = {
      assessmentName: "xact", organisationName: "abc",
      domain: "abc", industry: "abc", teamSize: 12, users: []
    };
    const assessmentData =
      {
        "assessmentId": 45,
        "assessmentName": "xact",
        "organisationName": "abc",
        "assessmentStatus": "ACTIVE",
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
    })
    reloadFn()
    expect(window.location.reload).toHaveBeenCalled()
    fixture.detectChanges()
  });

  it("should call the form", () => {
    expect(component.form).toBeTruthy()
  });

  it("should return error for an unsuccessful creation of assessment", () => {
    const assessmentDataPayload: any = [];
    const error = {
      status: 401,
      message: 'You are not logged in',
    }
    jest.spyOn(mockAppService, 'addAssessments').mockImplementation(() => {
      throw new Error("Error!")
    })
    component.createAssessmentForm.controls['assessmentNameValidator'].setValue("xact")
    component.createAssessmentForm.controls['organizationNameValidator'].setValue("abc")
    component.createAssessmentForm.controls['domainNameValidator'].setValue("abc")
    component.createAssessmentForm.controls['industryValidator'].setValue("xyz")
    component.createAssessmentForm.controls['teamSizeValidator'].setValue(12)
    expect(component.createAssessmentForm.valid).toBeTruthy()
    component.saveAssessment()
    expect(mockAppService.addAssessments).toThrow()
  });
});
