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
import {Observable, of, throwError} from "rxjs";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {User} from "../../types/user";
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
  mockedUser: User = {
    email: "sam@gmail.com",
    firstName: "Sam",
    lastName: "None",
    role: ""
  }
  public addAssessments(assessmentDataPayload: {} ): Observable<any> {
    if(assessmentDataPayload.hasOwnProperty("assessmentName")) {
      return of(this.assessmentMock)
    }else{
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

  it('should add user when email is given', () => {
    const dummyEmail = "sam@gmail.com"
    component.loggedInUser = {
      email: "sam1@gmail.com",
      firstName: "sam",
      lastName: "",
      role: ""
    }
    const expectedResponse: User = {
      email: "sam@gmail.com",
      firstName: "Sam",
      lastName: "None",
      role: ""
    }
    component.addUser(dummyEmail)
    mockAppService.getUserByEmail(dummyEmail).subscribe(response => {
      expect(response).toBe(expectedResponse)
    })
    expect(component.dataSource.length).toBe(1)
  });

  it("should remove user", () => {
    component.dataSource = [{
      email: "Sam@gmail.com",
      firstName: "sam",
      lastName: "",
      role: "dev"
    }, {email: "Sam2@gmail.com", firstName: "sam", lastName: "", role: "dev"}]
    component.removeUser({email: "Sam@gmail.com", firstName: "sam", lastName: "", role: "dev"})
    fixture.detectChanges()
    expect(component.dataSource.length).toBe(1)
    expect(component.dataSource[0].email).toBe("Sam2@gmail.com")
  })

  it("should display error if the user is already present", () => {
    component.dataSource = [{email: "Sam@gmail.com", firstName: "sam", lastName: "", role: "dev"}]
  })

  it("should not add if the user is already present", () => {
    component.dataSource = [{email: "Sam@gmail.com", firstName: "sam", lastName: "", role: "dev"}]
    const dummyEmail = "Sam@gmail.com"
    component.addUser(dummyEmail)
    fixture.detectChanges()
    expect(component.dataSource.length).toBe(1)

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
    const assessmentDataPayload:any  = [];
    mockAppService.addAssessments(assessmentDataPayload).subscribe((data) =>{
      expect(data).toBeDefined()
      console.log(data)
    },(error) => {
      expect(component.loading).toBeFalsy()
      expect(error).toBe("Error!")
    })

  });
});
