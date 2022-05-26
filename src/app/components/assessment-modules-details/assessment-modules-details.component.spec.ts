/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AssessmentModulesDetailsComponent} from './assessment-modules-details.component';
import {HttpClientModule} from "@angular/common/http";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {of} from "rxjs";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatTabsModule} from "@angular/material/tabs";
import {RouterTestingModule} from "@angular/router/testing";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatIconModule} from "@angular/material/icon";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {TopicLevelAssessmentComponent} from "../topic-level-assessment/topic-level-assessment.component";
import {MatDialogModule} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AssessmentQuestionComponent} from "../assessment-question/assessment-question.component";
import {MatInputModule} from "@angular/material/input";

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
        },{
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

}


describe('AssessmentModulesDetailsComponent', () => {
  let component: AssessmentModulesDetailsComponent;
  let mockAppService: MockAppService;
  let fixture: ComponentFixture<AssessmentModulesDetailsComponent>;


  beforeEach(async () => {
    window.history.pushState({assessmentName: "hello"}, '', 'assessmentModulesDetails')


    await TestBed.configureTestingModule({
      declarations: [AssessmentModulesDetailsComponent,TopicLevelAssessmentComponent,AssessmentQuestionComponent],
      imports: [HttpClientModule, MatTabsModule, MatIconModule, MatToolbarModule, MatExpansionModule,NoopAnimationsModule,
        MatCardModule,MatFormFieldModule,MatDialogModule,FormsModule,ReactiveFormsModule,MatInputModule,
        RouterTestingModule.withRoutes([
          {path: 'assessmentModuleDetails', component: AssessmentModulesDetailsComponent}
        ])],
      providers: [
        {provide: AppServiceService, useClass: MockAppService}
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

  it('should set index on next', () => {
    component.selectedIndex=1;
    component.next(2);
    fixture.detectChanges();
    expect(component.selectedIndex).toEqual(2)
  });

  it('should set index on back', () => {
    component.selectedIndex=2;
    component.previous(1);
    fixture.detectChanges();
    expect(component.selectedIndex).toEqual(1)
  });

});
