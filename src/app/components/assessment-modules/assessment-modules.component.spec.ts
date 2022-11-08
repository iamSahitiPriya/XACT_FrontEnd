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
import {UserAssessmentModuleRequest} from "../../types/UserAssessmentModuleRequest";
import {UserCategoryResponse} from "../../types/UserCategoryResponse";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {AssessmentModulesDetailsComponent} from "../assessment-modules-details/assessment-modules-details.component";
import {Ng2SearchPipe} from "ng2-search-filter";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../reducers/reducers";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {Location} from "@angular/common";
import {SpyLocation} from "@angular/common/testing";


class MockAppService {
  moduleRequest: UserAssessmentModuleRequest[] = [{moduleId: 0}, {moduleId: 1}]
  categoryData: UserCategoryResponse = {
    assessmentCategories: [{
      categoryId: 0,
      categoryName: "hello",active:true,
      modules: [{moduleId: 0, moduleName: "module", topics: [], category: 0}]
    }],
    userAssessmentCategories: [{categoryId: 0,active:true, categoryName: "Hello", modules: []}]
  }
  category: UserCategoryResponse = {
    assessmentCategories: [{
      categoryId: 0,
      categoryName: "hello",active:true,
      modules: [{moduleId: 0, moduleName: "module", topics: [], category: 0}]
    }],
    userAssessmentCategories: []
  }

  public getCategories(assessmentId: number) {
    if (assessmentId === 1) {
      // @ts-ignore
      this.categoryData.userAssessmentCategories = undefined
      return of(this.categoryData)
    } else {
      return of(this.category)
    }

  }

  saveUserModules() {
    return of(this.moduleRequest)
  }

  updateUserModules() {
    return of(this.moduleRequest)
  }
}

describe('AssessmentModulesComponent', () => {
  let component: AssessmentModulesComponent;
  let mockAppService: MockAppService
  let fixture: ComponentFixture<AssessmentModulesComponent>;
  let locationStub :SpyLocation

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssessmentModulesComponent,Ng2SearchPipe],
      imports: [HttpClientModule, MatIconModule, MatCardModule, MatExpansionModule,MatTooltipModule,MatSnackBarModule,
        StoreModule.forRoot(reducers),
        NoopAnimationsModule, MatCheckboxModule,MatInputModule,MatFormFieldModule,FormsModule,
        RouterTestingModule.withRoutes([
          {path: 'assessment/:assessmentId', component: AssessmentModulesDetailsComponent}
        ])],
      providers: [
        {provide: AppServiceService, useClass: MockAppService},
        {provide: Location, useClass: SpyLocation}
      ],

    })
      .compileComponents();
  });

  beforeEach(() => {
    mockAppService = new MockAppService()
    fixture = TestBed.createComponent(AssessmentModulesComponent);
    component = fixture.componentInstance;
    locationStub = TestBed.get(Location);
    fixture.detectChanges();
    component.category = {
      assessmentCategories: [{
        categoryId: 0,active:true,
        categoryName: "hello",
        modules: [{moduleId: 0, moduleName: "module", topics: [], category: 0}]
      }],
      userAssessmentCategories: [{categoryId: 0, active:true,categoryName: "Hello", modules: []}]
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should return the categories", () => {
    component.assessmentId = 1
    let assessmentId = 1
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
    mockAppService.getCategories(component.assessmentId).subscribe(data => {
      expect(data).toBe(expectedData)
    })
  });
  it("should return status of category", () => {
    jest.spyOn(component, "checkAllStatus")
    let response = component.checkAllStatus(0)
    expect(response).toBe(true)
  });
  it("should get a category", () => {
    jest.spyOn(component, "getModule")
    component.getCategory(0, true)
    expect(component.getModule).toHaveBeenCalled();
  });
  it("should save user selected module", () => {
    let moduleRequest: UserAssessmentModuleRequest[] = [{moduleId: 0}, {moduleId: 1}]
    component.category = {
      assessmentCategories: [],
      userAssessmentCategories: []
    }
    // @ts-ignore
    component.category.userAssessmentCategories = undefined
    jest.spyOn(component, "navigate")
    component.moduleRequest = moduleRequest
    component.saveUserModule()
    mockAppService.saveUserModules().subscribe(data => {
      expect(data).toBe(moduleRequest)
    })
    expect(component.navigate).toHaveBeenCalled()
  });
  it("should update user selected module", () => {
    let moduleRequest: UserAssessmentModuleRequest[] = [{moduleId: 0}, {moduleId: 1}]
    component.category = {
      assessmentCategories: [],
      userAssessmentCategories: []
    }
    jest.spyOn(component, "navigate")
    component.moduleRequest = moduleRequest
    component.saveUserModule()
    mockAppService.updateUserModules().subscribe(data => {
      expect(data).toBe(moduleRequest)
    })
    expect(component.navigate).toHaveBeenCalled()
  });
  it("should throw error when the user selected no module", () => {
    component.category = {
      assessmentCategories: [],
      userAssessmentCategories: []
    }
    // @ts-ignore
    component.category.userAssessmentCategories = undefined
    jest.spyOn(component, "showError")
    component.saveUserModule()
    expect(component.showError).toHaveBeenCalled()
  });
  it("should fetch all the active categories", () => {
    component.assessmentId = 1
    let assessmentId = 1
    let categoryResponse = {
      assessmentCategories: [{
        categoryId: 0,
        categoryName: "hello",active:true,
        modules: [{moduleId: 0, moduleName: "module", topics: [], category: 0}]
      }],
      userAssessmentCategories: [{categoryId: 0, categoryName: "Hello", active:true,modules: []}]
    }
    jest.spyOn(component, "setModules")
    jest.spyOn(component, "getModule")
    component.ngOnInit()
    mockAppService.getCategories(component.assessmentId).subscribe(data => {
      expect(data).toBe(categoryResponse)
    })
    component.setModules(categoryResponse.userAssessmentCategories)
    expect(component.setModules).toHaveBeenCalled()
  });
  it("should remove a category", () => {
    jest.spyOn(component, "getModule")
    component.getCategory(0, false)
    expect(component.getModule).toHaveBeenCalled();
  });
  it("should select all the categories", () => {
    let response = component.checkedModuleStatus(1, 1, true, false)
    expect(response).toBeTruthy()
  });
  it("should fetch all the user selected categories", () => {
    component.assessmentId = 2
    let assessmentId = 2
    let categoryResponse = {
      assessmentCategories: [{
        categoryId: 0,active:true,
        categoryName: "hello",
        modules: [{moduleId: 0, moduleName: "module", topics: [], category: 0}]
      }],
    }
    jest.spyOn(component, "setModules")
    jest.spyOn(component, "getModule")
    component.ngOnInit()
    mockAppService.getCategories(component.assessmentId).subscribe(_date => {
      // @ts-ignore
      _date.userAssessmentCategories = undefined
      expect(_date).toBe(categoryResponse)
    })
  });
  it("should select all the categories", () => {
    let response = component.checkedModuleStatus(0, 0, true, false)
    expect(response).toBeFalsy()
  });
  it("should set modules", () => {
    let response = {userAssessmentCategories: [{categoryId: 0, active:true,categoryName: "Hello", modules: [{moduleId:0,moduleName:"hello",topics:[],category:0}]}]}

    jest.spyOn(component,"getModule")
    component.setModules(response.userAssessmentCategories)
    expect(component.getModule).toHaveBeenCalled()
  });
  it("fetch assessment name and id from the store", () => {
    component.assessmentResponse = of({
      assessmentId: 5,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentPurpose:"",
      assessmentStatus: "Active",
      updatedAt: 1654664982698,
      assessmentState:"inProgress",
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
            effort: "LOW",
            deliveryHorizon: "some more text"
          }
        ]
      }],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, parameterLevelRecommendation: [{}]}]
    })
    component.ngOnInit()
    expect(component.assessmentName).toBe("abc1")
    expect(component.assessmentId).toBe(0)
  });
  it("should fetch the assessment categories", () => {
    let assessmentId = 1
    component.assessmentId = 1
    component.ngOnInit()
    mockAppService.getCategories(component.assessmentId).subscribe(data =>{
      // @ts-ignore
      expect(data.assessmentCategories).toBeDefined()
      expect(data.userAssessmentCategories).toBeUndefined()
    })
  });
});
