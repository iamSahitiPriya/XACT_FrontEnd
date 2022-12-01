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

import {AssessmentMenuComponent} from './assessment-menu.component';
import {MatMenuModule} from "@angular/material/menu";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {MatIconModule} from "@angular/material/icon";
import {of} from "rxjs";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
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
import {PopupConfirmationComponent} from "../popup-confirmation/popup-confirmation.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {AssessmentHeaderComponent} from "../assessment-header/assessment-header.component";

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

describe('AssessmentMenuComponent', () => {
  let dialog: any;
  let matDialog: any;
  let dom;
  let button;

  let component: AssessmentMenuComponent;
  let fixture: ComponentFixture<AssessmentMenuComponent>;

  class MockAppService {
    generateReport() {
      return of(new Blob());
    }

    getTemplate(){
      return of(new Blob());
    }

  }

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [AssessmentMenuComponent, PopupConfirmationComponent,AssessmentHeaderComponent],
      imports: [MatDialogModule, RouterTestingModule, MatFormFieldModule, MatIconModule, MatInputModule,
        MatTableModule, HttpClientTestingModule, NoopAnimationsModule, RouterModule,
        ReactiveFormsModule, MatSnackBarModule, FormsModule, MatButtonModule, MatRippleModule, MatMenuModule, MatTooltipModule,
        StoreModule.forRoot(reducers)],
      providers: [
        {provide: MatDialog, useClass: MockDialog},
        {provide: AppServiceService, useClass: MockAppService},

      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentMenuComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
    matDialog = fixture.debugElement.injector.get(MatDialog)
    fixture.autoDetectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call generate report & template on click for Completed Assessment', fakeAsync(() => {
    component.assessment = {
      assessmentPurpose: "",
      assessmentId: 1,
          assessmentName: "abc",
          organisationName: "xyz",
          assessmentStatus: "Completed",
          updatedAt: 0,
          assessmentState:"inProgress",
          domain: "TW",
          industry: "IT",
          teamSize: 2,
          users: [],
          answerResponseList: [],
          parameterRatingAndRecommendation: [],
          topicRatingAndRecommendation: [],
      userQuestionResponseList:[]
        }
    jest.spyOn(component, 'getTemplate');
    jest.spyOn(component, 'generateReport');
    jest.spyOn(component,'isAssessmentTable')
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();
    dom = fixture.debugElement.nativeElement;
    component.type="assessmentTable";
    fixture.detectChanges();
    button = dom.querySelector("#menu-button");
    button.click();
    let t : any;
    const menu = dom.parentNode.querySelector('#generate-menu');
    menu.click();
    tick();
    expect(component.generateReport).toHaveBeenCalled();
    tick(100);
    expect(component.getTemplate).toHaveBeenCalled();
    flush()
    flushMicrotasks();
    discardPeriodicTasks();
  }));


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

  it('should call generate report & template on click for InComplete Assessment', fakeAsync(() => {
    component.assessment = {
      assessmentPurpose: "",
      assessmentId: 1,
      assessmentName: "abc",
      organisationName: "xyz",
      assessmentStatus: "Active",
      updatedAt: 0,
      assessmentState:"inProgress",
      domain: "TW",
      industry: "IT",
      teamSize: 2,
      users: [],
      answerResponseList: [],
      parameterRatingAndRecommendation: [],
      topicRatingAndRecommendation: [],
      userQuestionResponseList:[]
    }
    jest.spyOn(component, 'generateReport');
    jest.spyOn(component,'isAssessmentTable')
    global.URL.createObjectURL = jest.fn();
    dom = fixture.debugElement.nativeElement;
    component.type="assessmentTable";
    fixture.detectChanges();
    button = dom.querySelector("#menu-button");
    button.click();
    let t : any;
    const menu = dom.parentNode.querySelector('#generate-menu');
    menu.click();
    tick();
    expect(component.generateReport).toHaveBeenCalled();
    tick(100);
    flush()
    flushMicrotasks();
    discardPeriodicTasks();
  }));

});






