/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AssessmentModulesComponent} from './assessment-modules.component';
import {HttpClientModule} from "@angular/common/http";
import {MatIconModule} from "@angular/material/icon";
import {RouterTestingModule} from "@angular/router/testing";
import {of} from "rxjs";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {MatCardModule} from "@angular/material/card";
import {MatExpansionModule} from "@angular/material/expansion";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

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
        },
      ]
    return of(mockCategory)
  }
}

describe('AssessmentModulesComponent', () => {
  let component: AssessmentModulesComponent;
  let mockAppService: MockAppService
  let fixture: ComponentFixture<AssessmentModulesComponent>;

  beforeEach(async () => {
    window.history.pushState({assessmentName: "hello"}, '', 'assessmentModule')
    await TestBed.configureTestingModule({
      declarations: [AssessmentModulesComponent],
      imports: [HttpClientModule, MatIconModule, MatCardModule, MatExpansionModule, NoopAnimationsModule,
        RouterTestingModule.withRoutes([
          {path: 'assessmentModule', component: AssessmentModulesComponent}
        ])],
      providers: [
        {provide: AppServiceService, useClass: MockAppService}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    mockAppService = new MockAppService()
    fixture = TestBed.createComponent(AssessmentModulesComponent);
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
    ]
    mockAppService.getCategories().subscribe(data => {
      expect(data).toBe(expectedData)
    })
  });


});
