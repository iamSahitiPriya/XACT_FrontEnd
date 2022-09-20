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
  assessmentCategories:[]
  ,userAssessmentCategories:[]
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
  catRequest:CategoryStructure | undefined
  moduleRequest:UserAssessmentModuleRequest[] = []
  isChecked:boolean = false

  assessmentModuleTitle = data_local.ASSESSMENT_MODULE.TITLE;

  constructor(private appService: AppServiceService, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer,private route: ActivatedRoute,private router:Router) {
  }

  ngOnInit(): void {
    const assessmentIdParam = this.route.snapshot.paramMap.get('assessmentId') || 0;

    this.assessmentId = +assessmentIdParam;
    this.appService.getCategories(this.assessmentId).pipe(takeUntil(this.destroy$)).subscribe(data => {
      if(data.userAssessmentCategories !== undefined){
        categories.userAssessmentCategories=data.userAssessmentCategories;
        categories.assessmentCategories = data.assessmentCategories
        valueEmitter.next(categories)
        this.router.navigateByUrl("assessment/"+this.assessmentId)
      }
      else{
        this.category.userAssessmentCategories=[]
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
  checkedStatus(categoryId:number):boolean{
    let index = this.category.userAssessmentCategories.findIndex(category => {
        return category.categoryId === categoryId
    })
    return index !== -1
  }

  getCategory(categoryId: number) {
    this.catRequest = this.category.assessmentCategories.find(category => category.categoryId == categoryId)
    if(this.catRequest !==undefined){
    this.catRequest.modules.forEach(modules =>{
      let moduleReq = {
        moduleId:modules.moduleId
      }
      this.moduleRequest.push(moduleReq)
    })
  }
  }

  saveUserModule() {
    const key = 'moduleId';

    const arrayUniqueByKey = [...new Map(this.moduleRequest.map(item =>
      [item[key], item])).values()];
    this.appService.saveUserModules(arrayUniqueByKey,this.assessmentId).subscribe(_data =>{
      this.router.navigateByUrl("assessment/"+this.assessmentId)
      console.log(_data)
    })
  }

  getModule(moduleId: number) {
    let moduleReq = {
      moduleId:moduleId
    }
    this.moduleRequest.push(moduleReq);
  }

  checkedModuleStatus(moduleId: number,categoryId : number) : boolean {
    let categoryIndex= this.category.userAssessmentCategories.findIndex(eachCategory => eachCategory.categoryId === categoryId);
    let moduleIndex= -1;
    if(categoryIndex !== -1){
     moduleIndex=this.category.userAssessmentCategories[categoryIndex].modules.findIndex(eachModule=>eachModule.moduleId === moduleId);
    }
    return moduleIndex !== -1;
  }
}
