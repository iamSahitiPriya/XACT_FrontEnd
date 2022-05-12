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
      declarations: [AssessmentModulesDetailsComponent],
      imports: [HttpClientModule, MatTabsModule, MatIconModule, MatToolbarModule, MatExpansionModule,NoopAnimationsModule,
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
});
