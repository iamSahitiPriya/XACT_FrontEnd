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
import {ActivatedRoute, convertToParamMap} from "@angular/router";


class MockAppService {
  moduleRequest: UserAssessmentModuleRequest[] = [{moduleId: 0}, {moduleId: 1}]
  categoryData: UserCategoryResponse = {
    assessmentCategories: [{
      categoryId: 0,
      categoryName: "hello", active: true,
      modules: [{
        moduleId: 0, moduleName: "module", topics: [], category: 0, active: true,
        updatedAt: 0,
        comments: "",
      }]
    }],
    userAssessmentCategories: [{categoryId: 0, active: true, categoryName: "Hello", modules: []}]
  }
  category = {}

  public getCategories = (assessmentId: number) => {
    if (assessmentId === 1) {
      return of(this.categoryData)
    } else {
      return of(this.category)
    }

  };

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
    const activatedRouteStub = {
      paramMap: {
        subscribe() {
          return of(1);
        }
      }
    };
    await TestBed.configureTestingModule({
      declarations: [AssessmentModulesComponent, Ng2SearchPipe],
      imports: [HttpClientModule, MatIconModule, MatCardModule, MatExpansionModule, MatTooltipModule, MatSnackBarModule,
        StoreModule.forRoot(reducers),
        NoopAnimationsModule, MatCheckboxModule, MatInputModule, MatFormFieldModule, FormsModule,
        RouterTestingModule.withRoutes([
          {path: 'assessment/:assessmentId', component: AssessmentModulesDetailsComponent}
        ])],
      providers: [
        {provide: AppServiceService, useClass: MockAppService},
        {provide: ActivatedRoute, useValue: {snapshot: {paramMap: convertToParamMap({'assessmentId': '1'})}}}
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
        categoryId: 0, active: true,
        categoryName: "hello",
        modules: [{
          moduleId: 0, moduleName: "module", topics: [], category: 0, active: true,
          updatedAt: 0,
          comments: "",
        }]
      }],
      userAssessmentCategories: [{categoryId: 0, active: true, categoryName: "Hello", modules: []}]
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
    let categoryResponse = {
      assessmentCategories: [{
        categoryId: 0,
        categoryName: "hello", active: true,
        modules: [{moduleId: 0, moduleName: "module", topics: [], category: 0}]
      }],
      userAssessmentCategories: [{categoryId: 0, categoryName: "Hello", active: true, modules: []}]
    }
    component.assessmentId = 1
    jest.spyOn(component, "setModules")
    jest.spyOn(component, "getModule")
    component.ngOnInit()
    mockAppService.getCategories(2).subscribe(data => {
      expect(data).toBe(categoryResponse)
    })
    expect(component.setModules).toHaveBeenCalled()
  });
  it("should fetch all the user selected categories when no category is selected", () => {
    // jest.spyOn(component, "getCategoriesData")
    component.getCategoriesData(2);
    mockAppService.getCategories(2).subscribe(_date => {
      expect(_date).toBe({})
    })
  });

  it("should set modules", () => {
    let response = {
      userAssessmentCategories: [{
        categoryId: 0, active: true, categoryName: "Hello", modules: [{
          moduleId: 0, moduleName: "hello", topics: [], category: 0, active: true,
          updatedAt: 0,
          comments: "",
        }]
      }]
    }

    component.moduleRequest = []
    jest.spyOn(component, "getModule")
    component.setModules(response.userAssessmentCategories)
    expect(component.moduleRequest.length).toBe(1)
  });
  it("fetch assessment name and id from the store", () => {
    component.assessmentResponse = of({
      assessmentId: 5,
      assessmentName: "abc1",
      organisationName: "Thoughtworks",
      assessmentPurpose: "",
      assessmentStatus: "Active",
      updatedAt: 1654664982698,
      assessmentState: "inProgress",
      domain: "",
      industry: "",
      teamSize: 0,
      users: [],
      owner:true,
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
    expect(component.assessmentId).toBe(1)
  });
  it("should navigate back to previous page on clicking back button", () => {
    jest.spyOn(component, 'navigateBack');
    const button = fixture.nativeElement.querySelector("#backButton");
    button.click()
    expect(component.navigateBack).toBeCalled();
  })

  it("should set allComplete to false when userAssessmentCategory is undefined", () => {
    // @ts-ignore
    component.category.userAssessmentCategories = undefined

    expect(component.category.assessmentCategories.category[0].allComplete).toBeFalsy()
  })
});
