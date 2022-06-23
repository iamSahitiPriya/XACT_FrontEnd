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
import {OKTA_AUTH} from "@okta/okta-angular";
import oktaAuth from "@okta/okta-auth-js";
import {RouterTestingModule} from "@angular/router/testing";
import {FormBuilder, FormsModule} from "@angular/forms";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {AssessmentModulesComponent} from "../assessment-modules/assessment-modules.component";
import {RouterModule} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {MatDialog} from "@angular/material/dialog";

class MockAppService {
  ASSESSMENT_DATA: AssessmentStructure [] = [
    {
      "assessmentId": 1,
      "assessmentName": "xact",
      "organisationName": "abc",
      "assessmentStatus": "ACTIVE",
      "updatedAt": 1649836702001,
      "domain":"TW",
      "industry":"IT",
      "teamSize":2,
      "users":[],
      "answerResponseList": [],
      "parameterRatingAndRecommendation": [],
      "topicRatingAndRecommendation": [],


    },
    {
      "assessmentId": 1,
      "assessmentName": "xact",
      "organisationName": "abc",
      "assessmentStatus": "ACTIVE",
      "updatedAt": 1649836702001,
      "domain":"TW",
      "industry":"IT",
      "teamSize":2,
      "users":[],
      "answerResponseList": [],
      "parameterRatingAndRecommendation": [],
      "topicRatingAndRecommendation": [],
    }
  ]

  public getAssessments(): Observable<AssessmentStructure[]> {
    return of(this.ASSESSMENT_DATA)
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
      declarations: [AssessmentsComponent, SearchComponent, CreateAssessmentsComponent],
      imports: [MatFormFieldModule, MatIconModule, MatInputModule, RouterTestingModule, MatPaginatorModule,
        BrowserAnimationsModule, MatTableModule, MatSnackBarModule, RouterModule, MatCardModule, FormsModule,
        RouterTestingModule.withRoutes([{
          path: "assessmentModule", component: AssessmentModulesComponent
        }])],
      providers: [HttpClient, HttpHandler, FormBuilder, RouterTestingModule,
        {
          provide: AppServiceService,
          useClass: MockAppService
        },
        {provide: OKTA_AUTH, useValue: oktaAuth},
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
  it('should get response', () => {
    let assData: AssessmentStructure[] = [
      {
        "assessmentId": 1,
        "assessmentName": "xact",
        "organisationName": "abc",
        "assessmentStatus": "ACTIVE",
        "updatedAt": 1649836702001,
        "domain":"TW",
        "industry":"IT",
        "teamSize":2,
        "users":[],
        "answerResponseList": [],
        "parameterRatingAndRecommendation": [],
        "topicRatingAndRecommendation": [],
      },
      {"assessmentId": 1,
        "assessmentName": "xact",
        "organisationName": "abc",
        "assessmentStatus": "ACTIVE",
        "updatedAt": 1649836702001,
        "domain":"TW",
        "industry":"IT",
        "teamSize":2,
        "users":[],
        "answerResponseList": [],
        "parameterRatingAndRecommendation": [],
        "topicRatingAndRecommendation": [],
      }

    ]
    expect(component).toBeTruthy();
    fixture.detectChanges()
    mockAppService.getAssessments().subscribe((data) => {
      expect(data).toBe(assData)
    })
  });
  it("should get navigated to the module route.", () => {
    jest.spyOn(component.router, 'navigateByUrl')
    const dummyAssessmentName = "hello123"
    expect(component.assessmentModule(dummyAssessmentName)).toBeTruthy()
    expect(component.router.navigateByUrl).toHaveBeenCalledWith('assessmentModule', {state: {assessmentName: dummyAssessmentName}})
  });
  it("should open assessment", () => {
    jest.spyOn(matDialog,"open")
    component.openAssessment("")
    fixture.detectChanges()
    expect(matDialog.open).toHaveBeenCalled()
  });
});
