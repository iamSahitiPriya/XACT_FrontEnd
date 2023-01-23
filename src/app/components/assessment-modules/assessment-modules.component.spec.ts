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
import {ActivatedRoute, convertToParamMap, Router} from "@angular/router";
import {MtxPopoverModule} from "@ng-matero/extensions/popover";
import {Location} from '@angular/common';


class MockAppService {
  moduleRequest: UserAssessmentModuleRequest[] = [{moduleId: 0}, {moduleId: 1}]
  categoryData: UserCategoryResponse = {
    assessmentCategories: [{
      categoryId: 0,
      categoryName: "hello", active: true,
      allComplete: true,
      modules: [{
        moduleId: 0, moduleName: "module", topics: [], category: 0, active: true,
        updatedAt: 0,
        comments: "",
        selected: true
      }]
    }, {
      categoryId: 1,
      categoryName: "hello", active: true,
      allComplete: true,
      modules: [{
        moduleId: 0, moduleName: "module", topics: [], category: 0, active: true,
        updatedAt: 0,
        comments: "",
        selected: true
      }]
    }],
    userAssessmentCategories: [{categoryId: 0, active: true, categoryName: "Hello", modules: []}]
  }
  category: UserCategoryResponse = {
    assessmentCategories: [{
      categoryId: 0,
      categoryName: "hello", active: true,
      allComplete: true,
      modules: [{
        moduleId: 0, moduleName: "module", topics: [], category: 0, active: true,
        updatedAt: 0,
        comments: "",
        selected: true
      }]
    }],
    // @ts-ignore
    userAssessmentCategories: undefined,
  }

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
  let router: Router;
  let location: Location

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
      imports: [HttpClientModule, MatIconModule, MatCardModule, MatExpansionModule, MatTooltipModule, MatSnackBarModule, MtxPopoverModule,
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
    router = TestBed.inject(Router)
    fixture.detectChanges();
    location = TestBed.inject(Location)
    component.category = {
      assessmentCategories: [{
        categoryId: 0, active: true,
        categoryName: "hello",
        allComplete: true,
        modules: [{
          moduleId: 0, moduleName: "module", topics: [], category: 0, active: true,
          updatedAt: 0,
          comments: "",
          selected: true,
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
      component.assessmentId = 1
      let moduleRequest: UserAssessmentModuleRequest[] = [{moduleId: 0}, {moduleId: 1}]
      component.category = {
        assessmentCategories: [],
        userAssessmentCategories: []
      }
      window.history.pushState({type: 'table'}, '', '/');

      jest.spyOn(component, "navigate")

      component.moduleRequest = moduleRequest
      component.saveUserModule()
      component.navigate()

      router.navigateByUrl('assessment/' + component.assessmentId)

      expect(router.url).toBe('/')
      mockAppService.updateUserModules().subscribe(data => {
        expect(data).toBe(moduleRequest)
      })
      expect(component.navigate).toHaveBeenCalled()
    });

  it("should navigate to previous page", () => {
    component.assessmentId = 1
    let moduleRequest: UserAssessmentModuleRequest[] = [{moduleId: 0}, {moduleId: 1}]
    component.category = {
      assessmentCategories: [],
      userAssessmentCategories: []
    }
    window.history.pushState({type: 'url'}, '', '/');

    jest.spyOn(component, "navigate")

    component.moduleRequest = moduleRequest
    component.navigate()
    router.navigateByUrl('/')

    expect(router.url).toBe('/')
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
    }
    component.assessmentId = 1
    jest.spyOn(component, "setModules")
    jest.spyOn(component, "getModule")
    component.ngOnInit()
    mockAppService.getCategories(2).subscribe(data => {
      expect(data).toBeDefined()
    })
    expect(component.setModules).toHaveBeenCalled()
  });
  it("should fetch all the user selected categories when no category is selected", () => {
    component.getCategoriesData(2);
    mockAppService.getCategories(2).subscribe(_date => {
      expect(_date).toBeDefined()
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
      owner: true,
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
        ],
      }],
      parameterRatingAndRecommendation: [{parameterId: 1, rating: 2, parameterLevelRecommendation: [{}]}],
      userQuestionResponseList: []
    })
    component.ngOnInit()
    expect(component.assessmentName).toBe("abc1")
    expect(component.assessmentId).toBe(1)
  });

    it("should navigate back to previous page on clicking back button", () => {
      window.history.pushState({type: 'url'}, '', '/');
      jest.spyOn(component, 'navigateBack');

      const button = fixture.nativeElement.querySelector("#backButton");
      component.navigateBack()
      button.click()
      router.navigateByUrl('/')

      expect(router.url).toBe('/')
      expect(component.navigateBack).toBeCalled();
    })

  it("should navigate back to previous page", () => {
    window.history.pushState({type: ''}, '', '/');
    jest.spyOn(component, 'navigateBack');

    const button = fixture.nativeElement.querySelector("#backButton");
    component.navigateBack()
    button.click()

    expect(router.url).toBe('/')
    expect(component.navigateBack).toBeCalled();
  });


  it("should set allComplete to false when userAssessmentCategory is undefined", () => {
    component.ngOnInit()
    jest.spyOn(component, "getCategoriesData")
    component.getCategoriesData(2);
    // @ts-ignore
    component.category.userAssessmentCategories = undefined
    expect(component.getCategoriesData).toHaveBeenCalled();
    expect(component.category.assessmentCategories[0].allComplete).toBeFalsy()
  })

  it("should set module request when selected module is active and category is active", () => {
    jest.spyOn(component, "getModule")
    component.getModule(1, true, true, 1, true, true)

    expect(component.moduleRequest.length).toBe(1)

  });
  it("should remove the unselected modules", () => {
    component.moduleRequest = [{"moduleId": 1}, {"moduleId": 2}]
    component.category.userAssessmentCategories[0] = {
      categoryId: 1, active: true, categoryName: "Hello", modules: [{
        moduleId: 2, moduleName: "hello", topics: [], category: 0, active: true,
        updatedAt: 0,
        comments: "",
      }]
    }
    jest.spyOn(component, "getModule")
    component.getModule(2, false, false, 1, true, false)

    expect(component.moduleRequest.length).toBe(1)
  });
  it("should set the module status based on the category selection", () => {
    component.ngOnInit();
    jest.spyOn(component, "getModule");
    component.category.assessmentCategories[0].modules[0].active = false
    component.setModuleSelectedStatus(0, true)
    expect(component.getModule).toHaveBeenCalled()
  });
  it("should update the status of all complete field when module is active", () => {
    component.ngOnInit()
    component.updateAllCompleteStatus(0)
    expect(component.category.assessmentCategories[0].allComplete).toBeFalsy()
  });
  it("should update the status of all complete field when module is inActive", () => {
    component.ngOnInit()
    component.category.assessmentCategories[0].modules[0].active = false
    component.updateAllCompleteStatus(0)
    expect(component.category.assessmentCategories[0].allComplete).toBeTruthy()
  });
  it("should set the category on intermediate status when one module is selected", () => {
    component.ngOnInit()

    expect(component.isCategoryIntermediate(0)).toBeFalsy()
  });
  it("should return false when category is undefined", () => {
    component.ngOnInit()

    expect(component.isCategoryIntermediate(1)).toBeFalsy()
  });

  it("should return true when selected category is not active", () => {
    component.ngOnInit();
    component.category.assessmentCategories[0].active = false;

    expect(component.isActive(component.category.assessmentCategories[0])).toBeTruthy()
  });

  it("should return true when selected category has undefined modules", () => {
    component.ngOnInit();
    // @ts-ignore
    component.category.assessmentCategories[0].modules = undefined

    expect(component.isActive(component.category.assessmentCategories[0])).toBeTruthy()
  });
  it("should return false when category is not selected", () => {
    component.ngOnInit()

    component.getCategoriesData(1)

    expect(component.category.assessmentCategories[1].allComplete).toBeFalsy();
  })

});
