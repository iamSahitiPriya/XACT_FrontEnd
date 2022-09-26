/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppServiceService} from "../../services/app-service/app-service.service";
import {CategoryStructure} from "../../types/categoryStructure";
import {BehaviorSubject, Subject, takeUntil} from "rxjs";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {data_local} from "../../messages";
import {ActivatedRoute, Router} from "@angular/router";
import {UserCategoryResponse} from "../../types/UserCategoryResponse";
import {UserAssessmentModuleRequest} from "../../types/UserAssessmentModuleRequest";
import {forEach} from "lodash";


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
  assessmentName: string
  category: UserCategoryResponse
  categoryIconMapping: Map<number, string> = new Map<number, string>()
  private destroy$: Subject<void> = new Subject<void>();
  assessmentId: number;
  catRequest: CategoryStructure | undefined
  moduleRequest: UserAssessmentModuleRequest[] = []

  assessmentModuleTitle = data_local.ASSESSMENT_MODULE.TITLE;
  loading: boolean;

  constructor(private appService: AppServiceService, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    const assessmentIdParam = this.route.snapshot.paramMap.get('assessmentId') || 0;

    this.assessmentId = +assessmentIdParam;
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

  checkedStatus(categoryId: number): boolean {
    let index = this.category.userAssessmentCategories.findIndex(category => {
      return category.categoryId === categoryId
    })
    return index !== -1
  }

  getCategory(categoryId: number, selectedCategory: boolean) {
    this.catRequest = this.category.assessmentCategories.find(category => category.categoryId == categoryId)
    if (this.catRequest !== undefined) {
      this.catRequest.modules.forEach(modules => {
        this.getModule(modules.moduleId, selectedCategory,selectedCategory,categoryId)

      })
    }

  }

  saveUserModule() {
    const key = 'moduleId';
    this.loading=true;
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
  }

  navigate() {
       this.loading=false;
       this.router.navigateByUrl("assessment/"+this.assessmentId);
    }

  getModule(moduleId: number, selectedModule: boolean,selectedCategory : boolean,categoryId :number) {
    let moduleReq = {
      moduleId: moduleId
    }
    if (selectedModule) {
      this.moduleRequest.push(moduleReq);
    } else {
      this.moduleRequest = this.moduleRequest.filter(module => module.moduleId !== moduleReq.moduleId);
       let index=this.category.userAssessmentCategories.findIndex(category => category.categoryId == categoryId);
       if(index !== -1 && !selectedCategory){
       this.category.userAssessmentCategories.splice(index,1);}
      }

  }

  checkedModuleStatus(moduleId: number, categoryId: number, selectedCategory: boolean, selectedModule: boolean): boolean {
    let categoryIndex = this.category.userAssessmentCategories.findIndex(eachCategory => eachCategory.categoryId === categoryId);
    let moduleIndex = -1;
    selectedModule = selectedCategory;
    if (categoryIndex !== -1 && selectedModule) {
      moduleIndex = this.category.userAssessmentCategories[categoryIndex].modules.findIndex(eachModule => eachModule.moduleId === moduleId);
    } else if (selectedCategory) {
      moduleIndex = 1;
    }
    return moduleIndex !== -1;
  }

  setModules(userAssessmentCategories: CategoryStructure[]) {
    for (const userAssessmentCategory of userAssessmentCategories) {
      for (const module of userAssessmentCategory.modules) {
        this.getModule(module.moduleId,true,true,userAssessmentCategory.categoryId);
      }
    }
  }
}
