import {ComponentFixture, fakeAsync, flush, TestBed, tick} from '@angular/core/testing';

import {AssessmentMenuComponent} from './assessment-menu.component';
import {MatMenuModule} from "@angular/material/menu";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {MatIconModule} from "@angular/material/icon";
import {of} from "rxjs";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {OKTA_AUTH} from "@okta/okta-angular";
import oktaAuth from "@okta/okta-auth-js";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {RouterTestingModule} from "@angular/router/testing";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatTableModule} from "@angular/material/table";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatRippleModule} from "@angular/material/core";

describe('AssessmentMenuComponent', () => {
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
      providers: [
        {provide: OKTA_AUTH, useValue: oktaAuth},
        {provide: AppServiceService, useClass: MockAppService}
      ],
      imports: [MatMenuModule, MatDialogModule, MatIconModule,BrowserAnimationsModule,NoopAnimationsModule,MatSnackBarModule,
      RouterTestingModule, MatFormFieldModule, MatInputModule,
      MatTableModule, HttpClientTestingModule,RouterModule,
      ReactiveFormsModule,FormsModule,MatButtonModule,MatRippleModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call generate report on click', fakeAsync(() => {
    component.assessmentStatus = "Completed";
    jest.spyOn(component, 'generateReport');
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();
    fixture.detectChanges();
    let generateReport = fixture.debugElement.nativeElement.querySelector("#generate-report");
    generateReport.click();
    tick();
    expect(component.generateReport).toHaveBeenCalled();
    flush()
  }));

  it('should call finish assessment if active', fakeAsync(() => {
    component.assessmentStatus = "Active";
    jest.spyOn(component, 'confirmFinishAssessmentAction');
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();
    fixture.detectChanges();
    let finishAssessment = fixture.debugElement.nativeElement.querySelector("#finishAssessment");
    finishAssessment.click();
    tick();
    expect(component.confirmFinishAssessmentAction).toHaveBeenCalled();
    flush()
  }));

  it('should call reopen assessment if completed', fakeAsync(() => {
    component.assessmentStatus = "Completed";
    jest.spyOn(component, 'reopenAssessment');
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();
    fixture.detectChanges();
    let reopenAssessment = fixture.debugElement.nativeElement.querySelector("#reopenAssessment");
    reopenAssessment.click();
    tick();
    expect(component.reopenAssessment).toHaveBeenCalled();
    flush()
  }));

  it('should complete assessment', () => {
    component.assessmentStatus = "Active";
    component.finishAssessment();
    expect(component.assessmentStatus).toBe("Completed");
  });


});
