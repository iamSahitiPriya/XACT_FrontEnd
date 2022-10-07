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

class MockAppService {
  public getCategories() {
    const mockCategory =
      [
        {
          "categoryId": 1,
          "categoryName": "My Category1",
          "modules": [
            {
              "moduleId": 1,
              "moduleName": "My Module",
              "category": 1,
              "topics": [
                {
                  "topicId": 1,
                  "topicName": "My Topic",
                  "module": 1,
                  "parameters": [
                    {
                      "parameterId": 1,
                      "parameterName": "My Parameter",
                      "topic": 1,
                      "questions": [
                        {
                          "questionId": 1,
                          "questionText": "My Question",
                          "parameter": 1
                        }
                      ],
                      "references": []
                    }
                  ],
                  "references": []
                }
              ]
            },
          ]
        }, {
        "categoryId": 2,
        "categoryName": "My Category1",
        "modules": [
          {
            "moduleId": 2,
            "moduleName": "My Module",
            "category": 2,
            "topics": [
              {
                "topicId": 1,
                "topicName": "My Topic",
                "module": 2,
                "parameters": [
                  {
                    "parameterId": 1,
                    "parameterName": "My Parameter",
                    "topic": 1,
                    "questions": [
                      {
                        "questionId": 1,
                        "questionText": "My Question",
                        "parameter": 1
                      }
                    ],
                    "references": []
                  }
                ],
                "references": []
              }
            ]
          },
        ]
      },
      ]
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
      declarations: [AssessmentModulesDetailsComponent, TopicLevelAssessmentComponent, AssessmentQuestionComponent, AssessmentMenuComponent, ParameterLevelRatingComponent, TopicLevelRatingComponent],
      imports: [HttpClientModule, MatTabsModule, MatIconModule, MatToolbarModule, MatExpansionModule, NoopAnimationsModule,
        MatCardModule, MatFormFieldModule, MatDialogModule, FormsModule, ReactiveFormsModule, MatInputModule, MatMenuModule, CommonModule, MatSnackBarModule,
        RouterTestingModule.withRoutes([
          {path: 'assessmentModuleDetails', component: AssessmentModulesDetailsComponent}
        ]), StoreModule.forRoot(reducers)],
      providers: [
        {provide: AppServiceService, useClass: MockAppService},
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

  it("should return the categories", () => {
    const expectedData = [
      {
        "categoryId": 1,
        "categoryName": "My Category1",
        "modules": [
          {
            "moduleId": 1,
            "moduleName": "My Module",
            "category": 1,
            "topics": [
              {
                "topicId": 1,
                "topicName": "My Topic",
                "module": 1,
                "parameters": [
                  {
                    "parameterId": 1,
                    "parameterName": "My Parameter",
                    "topic": 1,
                    "questions": [
                      {
                        "questionId": 1,
                        "questionText": "My Question",
                        "parameter": 1
                      }
                    ],
                    "references": []
                  }
                ],
                "references": []
              }
            ]
          },
        ]
      },

      {
        "categoryId": 2,
        "categoryName": "My Category1",
        "modules": [
          {
            "moduleId": 2,
            "moduleName": "My Module",
            "category": 2,
            "topics": [
              {
                "topicId": 1,
                "topicName": "My Topic",
                "module": 2,
                "parameters": [
                  {
                    "parameterId": 1,
                    "parameterName": "My Parameter",
                    "topic": 1,
                    "questions": [
                      {
                        "questionId": 1,
                        "questionText": "My Question",
                        "parameter": 1
                      }
                    ],
                    "references": []
                  }
                ],
                "references": []
              }
            ]
          },
        ]
      },
    ]
    mockAppService.getCategories().subscribe(data => {
      expect(data).toBe(expectedData)
    })
  });

  it('Tab change should move forward', () => {
    // @ts-ignore
    const tabChangeEvent: MatTabChangeEvent = {tab: undefined, index: 1};
    component.selectedIndex = 0;
    component.topics = [{
      topicId: 1,
      topicName: "hello",
      assessmentLevel: "topic",
      parameters: [],
      module: 1,
      references: []
    }, {topicId: 2, topicName: "hello", assessmentLevel: "topic", parameters: [], module: 1, references: []},
      {topicId: 3, topicName: "hello", assessmentLevel: "topic", parameters: [], module: 1, references: []}]
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
      assessmentLevel: "topic",
      parameters: [],
      module: 1,
      references: []
    }, {topicId: 2, topicName: "hello", assessmentLevel: "topic", parameters: [], module: 1, references: []},
      {topicId: 3, topicName: "hello", assessmentLevel: "topic", parameters: [], module: 1, references: []}]
    component.tabChanged(tabChangeEvent);
    expect(component.selectedIndex).toBe(1);
  });

});
