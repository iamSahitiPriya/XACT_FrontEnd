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

class MockAppService {
  moduleRequest: UserAssessmentModuleRequest[] = [{moduleId: 0}, {moduleId: 1}]
  categoryData: UserCategoryResponse = {
    assessmentCategories: [{
      categoryId: 0,
      categoryName: "hello",
      modules: [{moduleId: 0, moduleName: "module", topics: [], category: 0}]
    }],
    userAssessmentCategories: [{categoryId: 0, categoryName: "Hello", modules: []}]
  }
  category: UserCategoryResponse = {
    assessmentCategories: [{
      categoryId: 0,
      categoryName: "hello",
      modules: [{moduleId: 0, moduleName: "module", topics: [], category: 0}]
    }],
    userAssessmentCategories: []
  }

  public getCategories(assessmentId: number) {
    if (assessmentId === 1) {
      this.categoryData.userAssessmentCategories = []
      this.category.userAssessmentCategories = []
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssessmentModulesComponent],
      imports: [HttpClientModule, MatIconModule, MatCardModule, MatExpansionModule, NoopAnimationsModule, MatCheckboxModule,
        RouterTestingModule.withRoutes([
          {path: 'assessment/:assessmentId', component: AssessmentModulesDetailsComponent}
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
    component.category = {
      assessmentCategories: [{
        categoryId: 0,
        categoryName: "hello",
        modules: [{moduleId: 0, moduleName: "module", topics: [], category: 0}]
      }],
      userAssessmentCategories: [{categoryId: 0, categoryName: "Hello", modules: []}]
    }
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
    mockAppService.getCategories(1).subscribe(data => {
      expect(data).toBe(expectedData)
    })
  });
  it("should return status of category", () => {
    jest.spyOn(component, "checkedStatus")
    let response = component.checkedStatus(0)
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
    component.saveUserModule()
    mockAppService.updateUserModules().subscribe(data => {
      expect(data).toBe(moduleRequest)
    })
    expect(component.navigate).toHaveBeenCalled()
  });
  it("should fetch all the active categories", () => {
    let categoryResponse = {
      assessmentCategories: [{
        categoryId: 0,
        categoryName: "hello",
        modules: [{moduleId: 0, moduleName: "module", topics: [], category: 0}]
      }],
      userAssessmentCategories: [{categoryId: 0, categoryName: "Hello", modules: []}]
    }
    jest.spyOn(component, "setModules")
    jest.spyOn(component, "getModule")
    component.ngOnInit()
    mockAppService.getCategories(1).subscribe(data => {
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
    let categoryResponse = {
      assessmentCategories: [{
        categoryId: 0,
        categoryName: "hello",
        modules: [{moduleId: 0, moduleName: "module", topics: [], category: 0}]
      }],
    }
    jest.spyOn(component, "setModules")
    jest.spyOn(component, "getModule")
    component.ngOnInit()
    mockAppService.getCategories(2).subscribe(_date => {
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
    let response = {userAssessmentCategories: [{categoryId: 0, categoryName: "Hello", modules: [{moduleId:0,moduleName:"hello",topics:[],category:0}]}]}

    jest.spyOn(component,"getModule")
    component.setModules(response.userAssessmentCategories)
    expect(component.getModule).toHaveBeenCalled()
  });
});
