/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppServiceService} from "../../services/app-service/app-service.service";
import {CategoryStructure} from "../../types/categoryStructure";
import {BehaviorSubject, Observable, Subject, takeUntil} from "rxjs";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {data_local} from "../../messages";
import {ActivatedRoute, Router} from "@angular/router";
import {UserCategoryResponse} from "../../types/UserCategoryResponse";
import {UserAssessmentModuleRequest} from "../../types/UserAssessmentModuleRequest";
import {Store} from "@ngrx/store";
import {AssessmentState} from "../../reducers/app.states";
import {AssessmentStructure} from "../../types/assessmentStructure";
import * as fromReducer from "../../reducers/assessment.reducer";
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
  catRequest: CategoryStructure | undefined
  moduleRequest: UserAssessmentModuleRequest[] = []

  assessmentModuleTitle = data_local.ASSESSMENT_MODULE.TITLE;
  loading: boolean;
  searchText: string;
  searchBarText = data_local.SEARCH.SEARCH_BAR_TEXT;
  assessmentResponse: Observable<AssessmentStructure>
  assessmentState: string;
  saveText = data_local.ASSESSMENT_MODULE.SAVE;
  type: any;

  constructor(private appService: AppServiceService, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer, private route: ActivatedRoute, private router: Router, private store: Store<AssessmentState>, private _snackBar: MatSnackBar, private _location: Location) {
    this.assessmentResponse = this.store.select(fromReducer.getAssessments)
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
    this.appService.getCategories(this.assessmentId).pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data.userAssessmentCategories !== undefined) {
        categories.userAssessmentCategories = data.userAssessmentCategories;
        categories.assessmentCategories = data.assessmentCategories;
        this.setModules(this.category.userAssessmentCategories);
        valueEmitter.next(categories)
      } else {
        this.category.userAssessmentCategories = []
        categories.assessmentCategories = data.assessmentCategories
        valueEmitter.next(categories)
      }
    })
    valueEmitter.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.category = data
    })

  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkAllStatus(categoryId: number): boolean {
    /*const selectedCategory = this.category.userAssessmentCategories.find(category => {
      return category.categoryId === categoryId
    })
    const foundAll = selectedCategory && selectedCategory.modules.every(v => this.moduleRequest.includes(v)) || false;
    console.log("Found all", selectedCategory, foundAll);
    return foundAll;*/

    let index = this.category.userAssessmentCategories.findIndex(category => {
      return category.categoryId === categoryId
    })
    return index !== -1
  }

  /*checkSomeSelected(categoryId: number): boolean {
    const selectedCategory = this.category.userAssessmentCategories.find(category => {
      return category.categoryId === categoryId
    })
    const foundSome = (!this.checkAllStatus(categoryId)) && (selectedCategory && selectedCategory.modules.some(module1 => this.moduleRequest.indexOf(module1) >= 0)) || false;
    return foundSome;
  }*/

  getCategory(categoryId: number, selectedCategory: boolean) {
    this.catRequest = this.category.assessmentCategories.find(category => category.categoryId == categoryId)
    if (this.catRequest !== undefined) {
      this.catRequest.modules.forEach(modules => {
        this.getModule(modules.moduleId, selectedCategory, selectedCategory, categoryId, true,modules.active)

      })
    }

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
        this.appService.updateUserModules(this.moduleRequest, this.assessmentId).subscribe(_data => {
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

  getModule(moduleId: number, selectedModule: boolean, selectedCategory: boolean, categoryId: number, categoryActive: boolean,moduleActive : boolean) {
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

  checkedModuleStatus(moduleId: number, categoryId: number, selectedCategory: boolean, selectedModule: boolean,moduleStatus : boolean): boolean {
    let categoryIndex = this.category.userAssessmentCategories.findIndex(eachCategory => eachCategory.categoryId === categoryId);
    let moduleIndex = -1;
    selectedModule = selectedCategory;
    if (categoryIndex !== -1 && selectedModule) {
      moduleIndex = this.category.userAssessmentCategories[categoryIndex].modules.findIndex(eachModule => eachModule.moduleId === Number(moduleId));
    } else if (selectedCategory && moduleStatus) {
      moduleIndex = 1;
    }
    return moduleIndex !== -1;
  }

  setModules(userAssessmentCategories: CategoryStructure[]) {
    for (const userAssessmentCategory of userAssessmentCategories) {
      for (const module of userAssessmentCategory.modules) {
        this.getModule(module.moduleId, true, true, userAssessmentCategory.categoryId, userAssessmentCategory.active,module.active);
      }
    }
  }

  navigateBack() {
    this._location.back();
  }
}
