/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AssessmentsComponent} from './assessments.component';
import {HttpClient, HttpHandler} from "@angular/common/http";
import {SearchComponent} from "../search-component/search.component";
import {CreateAssessmentsComponent} from "../assessment-create/create-assessments.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatTableModule} from "@angular/material/table";
import {AssessmentStructure} from "../../types/assessmentStructure";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {Observable, of} from "rxjs";
import {RouterTestingModule} from "@angular/router/testing";
import {FormBuilder, FormsModule} from "@angular/forms";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {AssessmentModulesComponent} from "../assessment-modules/assessment-modules.component";
import {RouterModule} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {MatDialog} from "@angular/material/dialog";
import {MatTooltipModule} from "@angular/material/tooltip";
import {AssessmentMenuComponent} from "../assessment-quick-action-menu/assessment-menu.component";
import {MatMenuModule} from "@angular/material/menu";

let ASSESSMENT_DATA: AssessmentStructure [] = [
  {
    "assessmentId": 1,
    "assessmentName": "xact",
    "organisationName": "abc",
    "assessmentDescription": "description",
    "assessmentStatus": "ACTIVE",
    "assessmentPurpose": "Client Request",
    "updatedAt": 1649836702001,
    assessmentState: "inProgress",
    "domain": "TW",
    "industry": "IT",
    "teamSize": 2,
    "users": [],
    "owner": true,
    "answerResponseList": [],
    "parameterRatingAndRecommendation": [],
    "topicRatingAndRecommendation": [],
    "userQuestionResponseList": []


  },
  {
    "assessmentId": 2,
    "assessmentName": "xact-1",
    "assessmentState": "inProgress",
    "assessmentDescription": "description",
    "organisationName": "abc",
    "assessmentStatus": "ACTIVE",
    "assessmentPurpose": "Client Request",
    "updatedAt": 1649836702001,
    "domain": "TW",
    "industry": "IT",
    "teamSize": 2,
    "users": [],
    "owner": true,
    "answerResponseList": [],
    "parameterRatingAndRecommendation": [],
    "topicRatingAndRecommendation": [],
    "userQuestionResponseList": []
  }
]

class MockAppService {

  public getAssessments(): Observable<AssessmentStructure[]> {
    return of(ASSESSMENT_DATA)
  }
}

class MockDialog {
  open() {
    return {
      afterClosed: () => of({})
    }
  }

  close() {
  }
}

describe('AssessmentsComponent', () => {
  let component: AssessmentsComponent;
  let mockAppService: MockAppService
  let fixture: ComponentFixture<AssessmentsComponent>;
  let matDialog: any

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [AssessmentsComponent, SearchComponent, CreateAssessmentsComponent, AssessmentMenuComponent],
      imports: [MatFormFieldModule, MatIconModule, MatInputModule, RouterTestingModule, MatPaginatorModule,
        BrowserAnimationsModule, MatTableModule, MatSnackBarModule, RouterModule, MatCardModule, FormsModule, MatMenuModule,
        RouterTestingModule.withRoutes([{
          path: "assessmentModule", component: AssessmentModulesComponent
        }]), MatTooltipModule],
      providers: [HttpClient, HttpHandler, FormBuilder, RouterTestingModule,
        {
          provide: AppServiceService,
          useClass: MockAppService
        },
        // {provide: OKTA_AUTH, useValue: oktaAuth},
        {provide: MatDialog, useClass: MockDialog}
      ]
    })
      .compileComponents();

  });

  beforeEach(() => {
    mockAppService = new MockAppService()
    fixture = TestBed.createComponent(AssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    matDialog = fixture.debugElement.injector.get(MatDialog)

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should get response and sort after update', () => {
    let assData: AssessmentStructure[] = [
      {
        "assessmentId": 1,
        "assessmentName": "xact",
        "organisationName": "abc",
        "assessmentStatus": "ACTIVE",
        "assessmentDescription": "description",
        "assessmentPurpose": "Client Request",
        "updatedAt": 1649836702001,
        "domain": "TW",
        "industry": "IT",
        "teamSize": 2,
        "users": [],
        "owner": true,
        "assessmentState": "inProgress",
        "answerResponseList": [],
        "parameterRatingAndRecommendation": [],
        "topicRatingAndRecommendation": [],
        "userQuestionResponseList": []
      },

      {
        "assessmentId": 2,
        "assessmentState": "inProgress",
        "assessmentName": "xact-1",
        "organisationName": "abc",
        "assessmentPurpose": "Client Request",
        "assessmentDescription": "description",
        "assessmentStatus": "ACTIVE",
        "updatedAt": 1649836702001,
        "domain": "TW",
        "industry": "IT",
        "teamSize": 2,
        "users": [],
        "owner": true,
        "answerResponseList": [],
        "parameterRatingAndRecommendation": [],
        "topicRatingAndRecommendation": [],
        "userQuestionResponseList": []
      }

    ]

    let assData1: AssessmentStructure[] = [
      {
        "assessmentId": 1,
        "assessmentName": "xact",
        "organisationName": "abc",
        "assessmentStatus": "ACTIVE",
        "assessmentPurpose": "Client Request",
        "assessmentDescription": "description",
        "updatedAt": 1649836702001,
        "domain": "TW",
        "industry": "IT",
        "teamSize": 2,
        "users": [],
        "owner": true,
        "assessmentState": "inProgress",
        "answerResponseList": [],
        "parameterRatingAndRecommendation": [],
        "topicRatingAndRecommendation": [],
        "userQuestionResponseList": []
      },
      {
        "assessmentId": 2,
        "assessmentState": "inProgress",
        "assessmentName": "xact-1",
        "organisationName": "abc",
        "assessmentPurpose": "Client Request",
        "assessmentDescription": "description",
        "assessmentStatus": "Completed",
        "updatedAt": 1649836702001,
        "domain": "TW",
        "industry": "IT",
        "teamSize": 2,
        "users": [],
        "owner": true,
        "answerResponseList": [],
        "parameterRatingAndRecommendation": [],
        "topicRatingAndRecommendation": [],
        "userQuestionResponseList": []
      }

    ]

    expect(component).toBeTruthy();
    component.ngOnInit()

    fixture.detectChanges()
    mockAppService.getAssessments().subscribe((data) => {
      expect(data).toBe(assData);
    })
    ASSESSMENT_DATA[1].assessmentStatus = "Completed";
    component.ngOnInit();
    mockAppService.getAssessments().subscribe((data) => {
      expect(data).toBe(assData1);
    })
  });
  it("should open assessment", () => {
    jest.spyOn(matDialog, "open")
    component.openAssessment("")
    fixture.detectChanges()
    expect(matDialog.open).toHaveBeenCalled()
  });

  it('should be able to navigate to assessment module selection page on first time click', () => {
    jest.spyOn(component, 'navigation');
    const button = fixture.nativeElement.querySelector("#assessmentRow");
    button.click();
    expect(component.navigation).toHaveBeenCalled();

  });

  it('should be able to navigate to assessment  page on click', () => {
    jest.spyOn(component, 'navigation');
    ASSESSMENT_DATA[0].assessmentState = "Complete";
    const button = fixture.nativeElement.querySelector("#assessmentRow");
    button.click();
    expect(component.navigation).toHaveBeenCalled();
  });
});
