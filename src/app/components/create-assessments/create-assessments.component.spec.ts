import {ComponentFixture, TestBed} from '@angular/core/testing';

import {assessmentData, CreateAssessmentsComponent, user} from './create-assessments.component';
import {MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {OKTA_AUTH} from "@okta/okta-angular";
import oktaAuth from "@okta/okta-auth-js";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatTableModule} from "@angular/material/table";
import {ReactiveFormsModule} from "@angular/forms";
import {Observable, of} from "rxjs";
import {AssessmentStructure} from "../assessments/assessmentStructure";
import {AppServiceService} from "../../services/app-service/app-service.service";

class MockDialog{
  open(){
    return{
      afterClosed:()=>of({})
    }
  }
  closeAll(){}
  addUser(){}
}
export const assessmentDataMock = [{}]
class MockAppService{
  assessmentMock = {
    "assessmentId": 45,
    "assessmentName": "xact",
    "organisationName": "abc",
    "assessmentStatus": "ACTIVE",
    "updatedAt": 1650886511968
  }
  public addAssessments(assessmentDataPayload:{}):Observable<any>{
    return of(this.assessmentMock)
  }
}
describe('CreateAssessmentsComponent', () => {
  let component: CreateAssessmentsComponent;
  let fixture: ComponentFixture<CreateAssessmentsComponent>;
  let dialog:any;
  let mockAppService:MockAppService

  let matDialog:any
  const oktaAuth = require('@okta/okta-auth-js');

  beforeEach(async () => {
    jest.mock('@okta/okta-auth-js');
    oktaAuth.getUser = jest.fn(() => Promise.resolve({name: 'Sam'}));
    await TestBed.configureTestingModule({
      declarations: [ CreateAssessmentsComponent ],
      imports:[MatDialogModule,RouterTestingModule,MatFormFieldModule,MatIconModule,MatInputModule,
        MatTableModule,HttpClientTestingModule,NoopAnimationsModule,
        ReactiveFormsModule],
      providers: [
        {provide: OKTA_AUTH, useValue: oktaAuth},
        {provide: AppServiceService, useClass: MockAppService},
        {provide: MatDialog, useClass:MockDialog}

      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    mockAppService = new MockAppService()
    fixture = TestBed.createComponent(CreateAssessmentsComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
    matDialog = fixture.debugElement.injector.get(MatDialog)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should open dialog box', () => {
    jest.spyOn(matDialog,'open')
    component.openAssessment("")
    fixture.detectChanges()
    expect(matDialog.open).toHaveBeenCalled()
  });
  it('should close the popup', () => {
    jest.spyOn(matDialog,'closeAll')
    component.closePopUp()
    fixture.detectChanges()
    expect(matDialog.closeAll).toHaveBeenCalled()
  });
  it('should add user when email is given', () => {
    expect(component.addUser()).toBeTruthy()
  });
  it("should remove user",() =>{
    component.dataSource = [{"name":"hello"}]
    component.removeUser("hello")
    fixture.detectChanges()
    expect(component.dataSource.length).toBe(1)
  })
  it('should save assessment', () => {
    const expectedAssessmentDataPayload = {
      "assessmentId": 45,
      "assessmentName": "xact",
      "organisationName": "abc",
      "assessmentStatus": "ACTIVE",
      "updatedAt": 1650886511968
    }
    component.saveAssessment();
    mockAppService.addAssessments(expectedAssessmentDataPayload).subscribe(data =>{
      expect(data).toBe(expectedAssessmentDataPayload)
    })
    fixture.detectChanges()
  });
});
