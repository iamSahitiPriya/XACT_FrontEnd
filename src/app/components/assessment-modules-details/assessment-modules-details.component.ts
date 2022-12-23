/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subject, takeUntil} from "rxjs";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {TopicStructure} from "../../types/topicStructure";
import {ModuleStructure} from "../../types/moduleStructure";
import {AssessmentStructure} from "../../types/assessmentStructure";
import {ParameterStructure} from "../../types/parameterStructure";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppStates} from "../../reducers/app.states";
import * as fromActions from "../../actions/assessment-data.actions";
import {MatDialog} from "@angular/material/dialog";
import {data_local} from "../../messages";
import {UserCategoryResponse} from "../../types/UserCategoryResponse";
import {CategoryStructure} from "../../types/categoryStructure";

let categories: UserCategoryResponse = {
  assessmentCategories: []
  , userAssessmentCategories: []
}
let valueEmitter = new BehaviorSubject<UserCategoryResponse>(categories)

@Component({
  selector: 'app-assessment-modules-details',
  templateUrl: './assessment-modules-details.component.html',
  styleUrls: ['./assessment-modules-details.component.css']
})
export class AssessmentModulesDetailsComponent implements OnInit, OnDestroy {
  moduleName: string
  assessment: AssessmentStructure
  category: UserCategoryResponse
  topics: TopicStructure[];
  parameters: ParameterStructure[];
  moduleSelected: number;
  topic: TopicStructure;
  parameter: ParameterStructure;
  topicName: string;
  selectedIndex: number = 0;
  assessmentId: number;

  assessmentModuleTitle = data_local.ASSESSMENT_MODULE.TITLE;
  goBackToDashboard = data_local.ASSESSMENT_MENU.GO_BACK;
  answer: Observable<AssessmentStructure>
  private destroy$: Subject<void> = new Subject<void>();


  constructor(private appService: AppServiceService, private route: ActivatedRoute, private store: Store<AppStates>, private dialog: MatDialog, public router: Router,) {
    this.answer = this.store.select((storeMap) => storeMap.assessmentState.assessments)
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.selectedIndex = tabChangeEvent.index;
  }

  navigate(module: ModuleStructure) {
    this.moduleSelected = module.moduleId;
    this.topics = module.topics;
  }

  ngOnInit() {
    const assessmentIdParam = this.route.snapshot.paramMap.get('assessmentId') || 0;
    this.assessmentId = +assessmentIdParam;
    this.store.dispatch(fromActions.getAssessmentId({id: this.assessmentId}))
    this.getCategories();
    this.getAssessment();
  }


  private getAssessment() {
    this.answer.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      if (data !== undefined) {
        this.assessment = data
        this.navigateToModule(this.assessment.assessmentState, this.assessmentId)
      }
    })
  }

  private getCategories() {
    this.appService.getOnlySelectedCategories(this.assessmentId).pipe(takeUntil(this.destroy$)).subscribe(data => {
      categories = data
      valueEmitter.next(categories)
    })
    valueEmitter.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.category = data
      if (this.category.userAssessmentCategories !== undefined && this.category.userAssessmentCategories.length > 0 ) {
        this.category.userAssessmentCategories = this.category.userAssessmentCategories.sort((category1, category2) => Number(category2.active) - Number(category1.active))
        let index = this.category.userAssessmentCategories.findIndex(category => category.active)
          this.category.userAssessmentCategories[index].modules?.forEach(eachModule => {
            if(eachModule.active) {
              let moduleIndex = this.category.userAssessmentCategories[index].modules.findIndex(module => module.moduleId === eachModule.moduleId)
              return this.navigate(this.category.userAssessmentCategories[index].modules[moduleIndex]) }
            })
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private navigateToModule(drafted: string, assessmentId: number) {
    drafted === "inProgress" ? this.router.navigateByUrl("assessment/" + assessmentId, {state: {type: 'url'}}) : this.router.navigateByUrl("assessmentModule/" + assessmentId, {state: {type: 'url'}});


  }

  isCategoryDisplayed(category: CategoryStructure) : boolean {
    let isDisplayed = false
    category.modules?.forEach(module => {
    if(module.active && category.active)
      isDisplayed = true
    })
   return isDisplayed
  }
}
