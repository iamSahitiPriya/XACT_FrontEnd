import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  flush,
  flushMicrotasks,
  TestBed,
  tick
} from '@angular/core/testing';

import {AssessmentHeaderComponent} from './assessment-header.component';
import {of} from "rxjs";
import {AssessmentStructure} from "../../types/assessmentStructure";
import {PopupConfirmationComponent} from "../popup-confirmation/popup-confirmation.component";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {RouterTestingModule} from "@angular/router/testing";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatTableModule} from "@angular/material/table";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatButtonModule} from "@angular/material/button";
import {MatRippleModule} from "@angular/material/core";
import {MatMenuModule} from "@angular/material/menu";
import {MatTooltipModule} from "@angular/material/tooltip";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../reducers/reducers";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {AssessmentMenuComponent} from "../assessment-quick-action-menu/assessment-menu.component";


class MockDialog {
  open() {
    return {
      afterClosed: () => of(true),
      componentInstance: jest.fn()
    }
  }

  closeAll() {
  }

  addUser() {
  }
}

describe('AssessmentHeaderComponent', () => {
  let matDialog: any
  let dialog:any
  let component: AssessmentHeaderComponent;
  let fixture: ComponentFixture<AssessmentHeaderComponent>;
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

    getTemplate(){
      return of(new Blob());
    }

  }
  const mockAssessment: AssessmentStructure = {
    answerResponseList: [],
    assessmentId: 123,
    assessmentName: "Mock",
    assessmentStatus: "Active",
    assessmentPurpose:"",
    domain: "IT",
    assessmentState:"inProgress",
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
      declarations: [ AssessmentHeaderComponent,PopupConfirmationComponent,AssessmentMenuComponent ],
      imports: [MatDialogModule, RouterTestingModule, MatFormFieldModule, MatIconModule, MatInputModule,
        MatTableModule, HttpClientTestingModule, NoopAnimationsModule, RouterModule,
        ReactiveFormsModule, MatSnackBarModule, FormsModule, MatButtonModule, MatRippleModule, MatMenuModule, MatTooltipModule,
        StoreModule.forRoot(reducers)],
      providers: [
        {provide: AppServiceService, useClass: MockAppService},
        {provide: MatDialog, useClass: MockDialog}],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentHeaderComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
    matDialog = fixture.debugElement.injector.get(MatDialog)
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call finish assessment if active', fakeAsync(() => {
    component.answerResponse1 = of({
      assessmentId: 1,
      assessmentName: "abc",
      organisationName: "xyz",
      assessmentStatus: "Active",
      assessmentState:"inProgress",
      assessmentPurpose:"Client Request",
      updatedAt: 0,
      domain: "TW",
      industry: "IT",
      teamSize: 2,
      users: [],
      answerResponseList: [],
      parameterRatingAndRecommendation: [],
      topicRatingAndRecommendation: []
    })
    component.assessment = mockAssessment;
    component.assessment.assessmentStatus = "Active";
    jest.spyOn(component, 'confirmFinishAssessmentAction');
    jest.spyOn(matDialog, 'open')
    jest.spyOn(component, 'finishAssessment')
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();
    component.ngOnInit()
    fixture.detectChanges();
    let finishAssessment = fixture.debugElement.nativeElement.querySelector("#finishAssessment");
    finishAssessment.click();
    tick();
    expect(component.confirmFinishAssessmentAction).toHaveBeenCalled();
    flush()
    flushMicrotasks();
    discardPeriodicTasks();
  }));


  it('should call reopen assessment if completed', fakeAsync(() => {
    discardPeriodicTasks()
    component.answerResponse1 = of({
      assessmentId: 1,
      assessmentName: "abc",
      organisationName: "xyz",
      assessmentStatus: "Completed",
      assessmentPurpose:"Client Request",
      updatedAt: 0,
      assessmentState:"inProgress",
      domain: "TW",
      industry: "IT",
      teamSize: 2,
      users: [],
      answerResponseList: [],
      parameterRatingAndRecommendation: [],
      topicRatingAndRecommendation: []
    })
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
    flushMicrotasks();
    discardPeriodicTasks();
  }));

  it('should complete assessment', () => {

    component.answerResponse1 = of({
      assessmentId: 5,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentPurpose:"Client Request",
      assessmentStatus: "Completed",
      assessmentState:"inProgress",
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
      topicRatingAndRecommendation: [{
        topicId: 0, rating: 1, topicLevelRecommendation: [
          {
            recommendationId: 1,
            recommendation: "some text",
            impact: "HIGH",
            effect: "LOW",
            deliveryHorizon: "some more text"
          }
        ]
      }],

      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, recommendation: ""}]
    })
    component.ngOnInit()
    component.finishAssessment();
    expect(component.assessment.assessmentStatus).toBe("Completed");
  });


});