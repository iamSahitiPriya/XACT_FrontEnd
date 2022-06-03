/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TopicLevelAssessmentComponent} from './topic-level-assessment.component';
import {TopicScoreComponent} from "../topic-score/topic-score.component";
import {AssessmentRecommendationComponent} from "../assessment-recommendation/assessment-recommendation.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCardModule} from "@angular/material/card";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {of} from "rxjs";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AssessmentQuestionComponent} from "../assessment-question/assessment-question.component";
import {SaveRequest} from "../../types/saveRequest";
import {AssessmentModulesDetailsComponent} from "../assessment-modules-details/assessment-modules-details.component";
import {TopicLevelRecommendationComponent} from "../topic-level-recommendation/topic-level-recommendation.component";
import {Component, ViewChild} from "@angular/core";
import {MatToolbarModule} from "@angular/material/toolbar";

class MockAppService {

  getCategories() {
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
  saveAssessment(saveRequest: SaveRequest) {
    return of(saveRequest);
  }
}



describe('TopicLevelAssessmentComponent', () => {
  let component: TopicLevelAssessmentComponent, fixture: ComponentFixture<TopicLevelAssessmentComponent>,
    component1: AssessmentModulesDetailsComponent, fixture1: ComponentFixture<AssessmentModulesDetailsComponent>,
    component2: AssessmentQuestionComponent, fixture2: ComponentFixture<AssessmentQuestionComponent>,
    // component3: AssessmentRecommendationComponent, fixture3: ComponentFixture<AssessmentRecommendationComponent>,
    mockAppService: MockAppService,
    dialog: any, matDialog: any;
  const original = window.location;
  const reloadFn = () => {
    window.location.reload();
  };
  beforeEach(async () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {reload: jest.fn()}
    })
    await TestBed.configureTestingModule({
      declarations: [TopicLevelAssessmentComponent, TopicScoreComponent, AssessmentRecommendationComponent, AssessmentQuestionComponent, AssessmentModulesDetailsComponent, TopicLevelRecommendationComponent],
      providers: [{provide: AppServiceService, useClass: MockAppService},
        {provide: MatDialog,MatToolbarModule, useClass: MockDialog}
      ],
      imports: [MatFormFieldModule, MatCardModule, MatDialogModule, NoopAnimationsModule, FormsModule, ReactiveFormsModule],

    })
      .compileComponents();
  });
  afterAll(() => {
    Object.defineProperty(window, 'location', {configurable: true, value: original});
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicLevelAssessmentComponent);
    component = fixture.componentInstance;
    fixture1 = TestBed.createComponent(AssessmentModulesDetailsComponent);
    component1 = fixture1.componentInstance;
    dialog = TestBed.inject(MatDialog);
    matDialog = fixture.debugElement.injector.get(MatDialog)
    component = fixture.debugElement.componentInstance;
  });

  it('should create', () => {
    // const references = [{
    //   referenceId: 1,
    //   topic: 1,
    //   rating: "1",
    //   reference: "text"
    // },
    //   {
    //     referenceId: 2,
    //     topic: 1,
    //     rating: "2",
    //     reference: "text"
    //   }];
    // const rating = "3";
    // component.topicInput = {
    //   topicId: 1,
    //   topicName: "topicName",
    //   module: 1,
    //   assessmentLevel: "Topic",
    //   parameters: [],
    //   references: references
    // }

    // component.getParameterWithRatingAndRecommendationRequest(1);
    // fixture.detectChanges();
    expect(component).toBeTruthy();
  });

// @Component({
//
//   selector:`app-topic-level-assessment`,
//   template: `
//     <app-topic-level-assessment
//       [topicInput]={topicId:1,topicName:"topicName",module:1,assessmentLevel:"Topic",parameters:[],references:[]}
//       [selectedIndex]=1
//       [assessmentId]=1
//       [assessmentDetail]={assessmentId:1,assessmentName:"name",organisationName:'',assessmentStatus:'',updatedAt:null}
//       [assessmentStatus]=''></app-topic-level-assessment>`
// })
// class AssessmentModuleDetailsComponent {
//   @ViewChild(TopicLevelAssessmentComponent)
//   public topicLevelAssessmentComponent:TopicLevelAssessmentComponent;
// }

  // it('should move to next', () => {
  //   component.selectedIndex = 0;
  //   component.next(true);
  //   expect(component.selectedIndex).toEqual(1);
  // });
  //
  // it('should move back selected index', () => {
  //   component.selectedIndex = 1
  //   component.previous(true)
  //   expect(component.selectedIndex).toBe(0)
  // });
  //
  // // it('should save answers and reload the page', () => {
  // //   component.assessmentId = 123;
  // //   component.notes = [];
  // //   // component.save();
  // //   reloadFn()
  // //   expect(window.location.reload).toHaveBeenCalled()
  // // });
  // it('should cancel changes', () => {
  //   jest.spyOn(matDialog, 'open')
  //   component.cancel()
  //   fixture.detectChanges()
  //   expect(matDialog.open).toHaveBeenCalled()
  // });
  //
  // it('should open popup before moving to next without saving', () => {
  //   jest.spyOn(matDialog, 'open')
  //   component.next(false)
  //   fixture.detectChanges()
  //   expect(matDialog.open).toHaveBeenCalled()
  // });
  // it('should close the pop on clicking the cross', () => {
  //   jest.spyOn(matDialog, 'open')
  //   jest.spyOn(component1, 'handleCancel')
  //   jest.spyOn(component2, 'handleCancel')
  //   component.selectedIndex = 0
  //
  //   component.next(false)
  //
  //   expect(matDialog.open).toHaveBeenCalled()
  //   expect(component1.handleCancel).toBeTruthy()
  //   expect(component2.handleCancel).toBeTruthy()
  //   expect(component.selectedIndex).toBe(0)
  // });
  // it('should open popup before moving to back without saving', () => {
  //   jest.spyOn(matDialog, 'open')
  //   component.previous(false)
  //   fixture.detectChanges()
  //   expect(matDialog.open).toHaveBeenCalled()
  // });
  // it('should do cancel when the dialog box is closed', () => {
  // });
});



class MockDialog {
  open() {
    return {
      afterClosed: () =>
        of(1)

    }
  }

  closeAll() {
  }
}
