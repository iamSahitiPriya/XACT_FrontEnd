/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppServiceService} from "../../services/app-service/app-service.service";
import {CategoryStructure} from "../../types/categoryStructure";
import {BehaviorSubject, Observable, Subject, takeUntil} from "rxjs";
import {data_local} from "../../messages";
import {ActivatedRoute, Router} from "@angular/router";
import {UserCategoryResponse} from "../../types/UserCategoryResponse";
import {UserAssessmentModuleRequest} from "../../types/UserAssessmentModuleRequest";
import {Store} from "@ngrx/store";
import {AppStates} from "../../reducers/app.states";
import {AssessmentStructure} from "../../types/assessmentStructure";
import * as fromActions from "../../actions/assessment-data.actions";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Location} from '@angular/common';


let categories: UserCategoryResponse = {
  assessmentCategories: []
  , userAssessmentCategories: []
}
let valueEmitter = new BehaviorSubject<UserCategoryResponse>(categories)


@Component({
  selector: 'app-assessment-modules',
  templateUrl: './assessment-modules.component.html',
  styleUrls: ['./assessment-modules.component.css']
})
export class AssessmentModulesComponent implements OnInit, OnDestroy {
  goBackToDashboard = data_local.ASSESSMENT_MENU.GO_BACK;

  assessmentName: string
  category: UserCategoryResponse
  categoryIconMapping: Map<number, string> = new Map<number, string>()
  private destroy$: Subject<void> = new Subject<void>();
  assessmentId: number;
  catRequest: any | undefined
  moduleRequest: UserAssessmentModuleRequest[] = []

  assessmentModuleTitle = data_local.ASSESSMENT_MODULE.TITLE;
  loading: boolean;
  searchText: string;
  searchBarText = data_local.SEARCH.SEARCH_BAR_TEXT;
  assessmentResponse: Observable<AssessmentStructure>
  assessmentState: string;
  saveText = data_local.ASSESSMENT_MODULE.SAVE;
  type: any;
  content: string = data_local.ASSESSMENT_MODULE.CATEGORY_CONTENT;
  categoryTitle : string = data_local.ASSESSMENT_MODULE.CATEGORY

  constructor(private appService: AppServiceService, private route: ActivatedRoute, private router: Router, private store: Store<AppStates>, private _snackBar: MatSnackBar, private _location: Location) {
    this.assessmentResponse = this.store.select((storeMap) => storeMap.assessmentState.assessments)
  }

  ngOnInit(): void {
    const assessmentIdParam = this.route.snapshot.paramMap.get('assessmentId') || 0;
    this.assessmentId = +assessmentIdParam;
    this.store.dispatch(fromActions.getAssessmentId({id: this.assessmentId}))
    this.assessmentResponse.subscribe(data => {
      if (data != undefined) {
        this.assessmentName = data.assessmentName
        this.assessmentState = data.assessmentState
      }

    })
    this.getCategoriesData(this.assessmentId);

    valueEmitter.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.category = data
    })

  }

  getCategoriesData(assessmentId: number) {
    this.appService.getCategories(assessmentId).pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data.userAssessmentCategories !== undefined) {
        categories.userAssessmentCategories = data.userAssessmentCategories;
        categories.assessmentCategories = data.assessmentCategories;
        this.setCategorySelectedState()
        this.setModules(this.category.userAssessmentCategories);
        valueEmitter.next(categories)
      } else {
        this.category.userAssessmentCategories = []
        categories.assessmentCategories = data.assessmentCategories
        categories.assessmentCategories?.forEach(category => {
          category.allComplete = false
          category.modules?.forEach((module: { selected: boolean; }) => {
            module.selected = false
          })
        })
        valueEmitter.next(categories)
      }
    })
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  showError(message: string, action: string) {
    this._snackBar.open(message, action, {
      verticalPosition: 'top',
      panelClass: ['errorSnackbar'],
      duration: 2000
    })
  }

  saveUserModule() {
    const key = 'moduleId';
    this.loading = true;
    if (this.moduleRequest.length > 0) {
      const arrayUniqueByKey = [...new Map(this.moduleRequest.map(item =>
        [item[key], item])).values()];
      if (this.category.userAssessmentCategories === undefined) {
        this.appService.saveUserModules(arrayUniqueByKey, this.assessmentId).subscribe(_data => {
          this.navigate();
        })
      } else {
        this.appService.updateUserModules(arrayUniqueByKey, this.assessmentId).subscribe(_data => {
            this.navigate();
          }
        )
      }
    } else {
      this.loading = false
      this.showError("Select at least one category/module to continue", "close")
    }
  }

  navigate() {
    this.loading = false;
    if (history.state.type === 'table') {
      this.router.navigateByUrl("assessment/" + this.assessmentId);
    } else {
      this._location.back();
    }
  }

  getModule(moduleId: number | string, selectedModule: boolean, selectedCategory: boolean, categoryId: number, categoryActive: boolean, moduleActive: boolean) {
    let moduleReq = {
      moduleId: Number(moduleId)
    }
    if (selectedModule && categoryActive && moduleActive) {
      this.moduleRequest.push(moduleReq);
    } else {
      this.moduleRequest = this.moduleRequest.filter(module => module.moduleId !== moduleReq.moduleId);
      let index = this.category.userAssessmentCategories.findIndex(category => category.categoryId == categoryId);
      if (index !== -1 && !selectedCategory) {
        this.category.userAssessmentCategories.splice(index, 1);
      }
    }
  }

  setModules(userAssessmentCategories: CategoryStructure[]) {
    for (const userAssessmentCategory of userAssessmentCategories) {
      for (const module of userAssessmentCategory.modules) {
        let moduleReq = {
          moduleId: Number(module.moduleId)
        }
        this.moduleRequest.push(moduleReq)
      }
    }
  }

  navigateBack() {
    if (history.state.type == 'url') {
      this.router.navigateByUrl('')
    } else {
      this._location.back()
    }
  }

  setModuleSelectedStatus(categoryId: number, checked: boolean) {
    this.catRequest = this.category.assessmentCategories.find(category => category.categoryId == categoryId)
    this.catRequest.allComplete = checked
    this.catRequest.modules?.forEach((module: { moduleId: number; active: boolean; selected: boolean; }) => {
      this.getModule(module.moduleId, checked, checked, categoryId, true, module.active)
      module.selected = checked
      if (!module.active)
        module.selected = false
    })
  }

  updateAllCompleteStatus(categoryId: number) {
    let category = this.category.assessmentCategories.find(eachCategory => eachCategory.categoryId === categoryId)
    if (category !== undefined) {
      category.allComplete = true
      let isActive = true
      category.modules?.forEach((module) => {
        if (module.active)
          isActive = isActive && module.selected
      })
      category.allComplete = isActive
    }
  }

  isCategoryIntermediate(categoryId: number) {
    let category = this.category.assessmentCategories.find(eachCategory => eachCategory.categoryId === categoryId)
    if (category !== undefined)
      return category.modules?.filter((module: { selected: any; }) => module.selected).length > 0 && !category.allComplete
    else
      return false
  }

  private setCategorySelectedState() {
    categories.assessmentCategories.forEach(category => {
      let selectedCategory = categories.userAssessmentCategories.find(userSelectedCategory => userSelectedCategory.categoryId === category.categoryId)
      category.allComplete = false
      if (category.modules !== undefined) {
        category.allComplete = true
        category.modules?.forEach((module: { selected: boolean; moduleId: number; active: boolean }) => {
          let moduleState = this.setModuleSelectedState(selectedCategory, module);
          category.allComplete = category.allComplete && moduleState
        })
      }
    })
  }

  private setModuleSelectedState(selectedCategory: CategoryStructure | undefined, module: { selected: boolean; moduleId: number; active: boolean }): boolean {
    if (selectedCategory !== undefined) {
      let selectedModule = selectedCategory.modules.find(userSelectedModule => userSelectedModule.moduleId === module.moduleId)
      module.selected = selectedModule !== undefined;
      return module.active ? module.selected : true
    }
    else {
      module.selected = false
      return  false;
    }
  }

  isActive(category: any) {
    if (category.active === false)
      return true
    else if (category.modules === undefined)
      return true
    else
      return category.modules?.every((module: { active: any; }) => module.active === false)
  }

}
