/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';
import {StoreModule} from '@ngrx/store';

import {AssessmentModulesDetailsComponent} from './assessment-modules-details.component';
import {HttpClientModule} from "@angular/common/http";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {of} from "rxjs";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatTabChangeEvent, MatTabsModule} from "@angular/material/tabs";
import {RouterTestingModule} from "@angular/router/testing";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatIconModule} from "@angular/material/icon";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {TopicLevelAssessmentComponent} from "../assessment-rating-and-recommendation/topic-level-assessment.component";
import {MatDialogModule} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AssessmentQuestionComponent} from "../assessment-parameter-questions/assessment-question.component";
import {MatInputModule} from "@angular/material/input";
import {MatMenuModule} from '@angular/material/menu';
import {AssessmentMenuComponent} from "../assessment-quick-action-menu/assessment-menu.component";
import {ParameterLevelRatingComponent} from "../parameter-level-rating/parameter-level-rating.component";
import {CommonModule} from "@angular/common";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {TopicLevelRatingComponent} from "../topic-level-rating/topic-level-rating.component";
import {reducers} from "../../reducers/reducers";
import {AssessmentHeaderComponent} from "../assessment-header/assessment-header.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ModuleStructure} from "../../types/moduleStructure";
import {UserCategoryResponse} from "../../types/UserCategoryResponse";
import {ActivatedRoute, convertToParamMap} from "@angular/router";

const mockCategory: UserCategoryResponse = {
  assessmentCategories: [
    {
      "categoryId": 1,
      "categoryName": "My Category1",
      "allComplete": true,
      "active": true,
      "modules": [
        {
          "moduleId": 1,
          "moduleName": "My Module",
          "category": 1,
          "active": true,
          "selected": true,
          "updatedAt": 10101010,
          "topics": [
            {
              "topicId": 1,
              "topicName": "My Topic",
              "module": 1,
              "updatedAt": 12345,
              "active": false,
              "parameters": [
                {
                  "parameterId": 1,
                  "parameterName": "My Parameter",
                  "topic": 1,
                  "updatedAt": 12345,
                  "active": false,
                  "questions": [
                    {
                      "questionId": 1,
                      "questionText": "My Question",
                      "parameter": 1
                    }
                  ],
                  "userQuestions": [],
                  "references": []
                }
              ],
              "references": []
            }
          ]
        },
      ]
    }], userAssessmentCategories: [
    {
      "categoryId": 1,
      "categoryName": "My Category1",
      "active": true,
      "modules": [
        {
          "moduleId": 1,
          "moduleName": "My Module",
          "category": 1,
          "active": true,
          "updatedAt": 10101010,
          "topics": [
            {
              "topicId": 1,
              "topicName": "My Topic",
              "module": 1,
              "updatedAt": 1234,
              "active": false,
              "parameters": [
                {
                  "parameterId": 1,
                  "parameterName": "My Parameter",
                  "topic": 1,
                  "updatedAt": 1234,
                  "active": false,
                  "questions": [
                    {
                      "questionId": 1,
                      "questionText": "My Question",
                      "parameter": 1
                    }
                  ],
                  "userQuestions": [],
                  "references": []
                }
              ],
              "references": []
            }
          ]
        },
      ]
    }
  ]
};


class MockAppService {
  public getCategories() {
    return of(mockCategory)
  }

  public getOnlySelectedCategories() {
    return of(mockCategory)
  }

  getAssessment(assessmentId: number) {
    return of({assessmentId: assessmentId, assessmentName: "Demo", assessmentStatus: "Active"});
  }

}


describe('AssessmentModulesDetailsComponent', () => {
  let component: AssessmentModulesDetailsComponent;
  let mockAppService: MockAppService;
  let fixture: ComponentFixture<AssessmentModulesDetailsComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssessmentModulesDetailsComponent, TopicLevelAssessmentComponent, AssessmentQuestionComponent, AssessmentMenuComponent, ParameterLevelRatingComponent, TopicLevelRatingComponent, AssessmentHeaderComponent],
      imports: [HttpClientModule, MatTabsModule, MatIconModule, MatToolbarModule, MatExpansionModule, NoopAnimationsModule, MatTooltipModule,
        MatCardModule, MatFormFieldModule, MatDialogModule, FormsModule, ReactiveFormsModule, MatInputModule, MatMenuModule, CommonModule, MatSnackBarModule,
        RouterTestingModule.withRoutes([
          {path: 'assessment/:assessmentId', component: AssessmentModulesDetailsComponent}

        ]), StoreModule.forRoot(reducers)],
      providers: [
        {provide: AppServiceService, useClass: MockAppService},
        {provide: ActivatedRoute, useValue: {snapshot: {paramMap: convertToParamMap({'assessmentId': '1'})}}}
        // {provide: OKTA_AUTH, useValue: oktaAuth},

      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    mockAppService = new MockAppService();
    fixture = TestBed.createComponent(AssessmentModulesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should return the categories", async () => {

    mockAppService.getCategories().subscribe(data => {
      expect(data).toBe(mockCategory)
    })
  });

  it('should get the assessment data', () => {
    component.answer = of({
      assessmentId: 1,
      assessmentName: "name",
      assessmentPurpose: "Client",
      organisationName: "New",
      assessmentStatus: "Active",
      domain: "new",
      industry: "new",
      assessmentState: "inProgress",
      teamSize: 1,
      users: ["abc@thoughtworks.com"],
      owner: true,
      updatedAt: 12341234,
      answerResponseList: [],
      parameterRatingAndRecommendation: [],
      topicRatingAndRecommendation: [],
      userQuestionResponseList: []
    })
    component.ngOnInit();
    expect(component.assessment.assessmentId).toBe(1)
  })
  it('Tab change should move forward', () => {
    // @ts-ignore
    const tabChangeEvent: MatTabChangeEvent = {tab: undefined, index: 1};
    component.selectedIndex = 0;
    component.topics = [{
      topicId: 1,
      topicName: "hello", updatedAt: 0, active: false,
      parameters: [],
      module: 1,
      references: []
    }, {topicId: 2, topicName: "hello", updatedAt: 0, active: false, parameters: [], module: 1, references: []},
      {topicId: 3, topicName: "hello", updatedAt: 0, active: false, parameters: [], module: 1, references: []}]
    component.tabChanged(tabChangeEvent);
    expect(component.selectedIndex).toBe(1);
  });
  it('Tab change should move backward', () => {
    // @ts-ignore
    const tabChangeEvent: MatTabChangeEvent = {tab: undefined, index: 1};
    component.selectedIndex = 2;
    component.topics = [{
      topicId: 1,
      topicName: "hello",
      active: false,
      parameters: [],
      module: 1,
      references: [], updatedAt: 0,
    }, {topicId: 2, topicName: "hello", parameters: [], module: 1, references: [], updatedAt: 0, active: false,},
      {topicId: 3, topicName: "hello", parameters: [], module: 1, references: [], updatedAt: 0, active: false,}]
    component.tabChanged(tabChangeEvent);
    expect(component.selectedIndex).toBe(1);
  });
  it("should navigate to particular module", () => {
    let dummyModule: ModuleStructure = {
      active: false,
      comments: "",
      updatedAt: 0,
      moduleId: 1,
      moduleName: "hello",
      topics: [{
        topicId: 1,
        topicName: "topic",
        module: 1,
        parameters: [],
        references: [],
        updatedAt: 0,
        active: false,
      }],
      category: 0
    }
    component.navigate(dummyModule)
    expect(component.moduleSelected).toBe(1)
    expect(component.topics.length).toBe(1)
  });


});
