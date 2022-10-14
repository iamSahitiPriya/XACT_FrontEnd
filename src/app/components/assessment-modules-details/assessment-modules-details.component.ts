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
import {ActivatedRoute} from "@angular/router";
import * as fromReducer from "../../reducers/assessment.reducer";
import {Store} from "@ngrx/store";
import {AssessmentState} from "../../reducers/app.states";
import * as fromActions from "../../actions/assessment-data.actions";
import {MatDialog} from "@angular/material/dialog";
import {data_local} from "../../messages";
import {UserCategoryResponse} from "../../types/UserCategoryResponse";

let categories: UserCategoryResponse = {
  assessmentCategories:[]
  ,userAssessmentCategories:[]
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
  goBackToDashboard = data_local.ASSESSMENT_MENU.GO_BACK_DASHBOARD;
  answer: Observable<AssessmentStructure>
  private destroy$: Subject<void> = new Subject<void>();


  constructor(private appService: AppServiceService, private route: ActivatedRoute, private store: Store<AssessmentState>, private dialog: MatDialog) {
    this.answer = this.store.select(fromReducer.getAssessments)
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    const direction = this.selectedIndex - tabChangeEvent.index;
    this.selectedIndex = tabChangeEvent.index;
    this.scrollNext(direction);
  }

  private scrollNext(direction: number) {
    if (direction < 0 && this.topics.length - this.selectedIndex > 1) {
      const element = document.getElementById("mat-tab-label-0-" + (this.selectedIndex + 1));
      element && element.scrollIntoView();
    } else if (direction > 0 && this.selectedIndex > 0) {
      const element = document.getElementById("mat-tab-label-0-" + (this.selectedIndex - 1));
      element && element.scrollIntoView();
    }
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
      }
    })
  }

  private getCategories() {
    this.appService.getCategories(this.assessmentId).pipe(takeUntil(this.destroy$)).subscribe(data => {
      categories = data
      valueEmitter.next(categories)
    })
    valueEmitter.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.category = data
      if (this.category.userAssessmentCategories.length > 0)
        this.navigate(this.category.userAssessmentCategories[0].modules[0])

    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
