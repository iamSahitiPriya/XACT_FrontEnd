/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, takeUntil} from "rxjs";
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

let categories: UserCategoryResponse = {
  assessmentCategories: []
  , userAssessmentCategories: []
}

enum QueryParamHandling {
  PRESERVE = 'preserve',
  MERGE = 'merge',
  NONE = '',
}

@Component({
  selector: 'app-assessment-modules-details',
  templateUrl: './assessment-modules-details.component.html',
  styleUrls: ['./assessment-modules-details.component.css']
})
export class AssessmentModulesDetailsComponent implements OnInit, OnDestroy {
  moduleName: string
  assessment: AssessmentStructure
  category: UserCategoryResponse = {assessmentCategories: [], userAssessmentCategories: []}
  topics: TopicStructure[] | undefined;
  parameters: ParameterStructure[];
  moduleSelected: number | undefined;
  categorySelected: number;
  topic: TopicStructure;
  parameter: ParameterStructure;
  topicName: string;
  selectedIndex: number | undefined;
  assessmentId: number;

  assessmentModuleTitle = data_local.ASSESSMENT_MODULE.TITLE;
  goBackToDashboard = data_local.ASSESSMENT_MENU.GO_BACK;
  answer: Observable<AssessmentStructure>
  private destroy$: Subject<void> = new Subject<void>();
  private selectedModuleId: undefined;
  private selectedTopicId: number;
  private selectedCategoryId: number | undefined;
  isReloaded: boolean = true;


  constructor(private appService: AppServiceService, private route: ActivatedRoute, private store: Store<AppStates>, private dialog: MatDialog, public router: Router) {
    this.answer = this.store.select((storeMap) => storeMap.assessmentState.assessments)
    this.route.queryParams.subscribe(params => {
      this.selectedCategoryId = params['category'];
      this.selectedModuleId = params['module'];
      this.selectedTopicId = params['topic'];
    });
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if (!this.isReloaded) {
      this.selectedIndex = tabChangeEvent.index;
      this.selectedTopicId = this.topics ? this.topics[this.selectedIndex].topicId : 0;
      this.updateParamToUri(QueryParamHandling.MERGE);
    }
    this.isReloaded = false;
  }

  navigate(module: ModuleStructure) {
    this.selectedCategoryId = module.category
    this.moduleSelected = module.moduleId;
    this.topics = module.topics;
    this.selectedIndex = 0;
    this.updateParamToUri(QueryParamHandling.MERGE);
  }

  updateParamToUri(queryParamHandlingStrategy: QueryParamHandling) {
    this.router.navigate(
      [],  // Remain on current route
      {
        relativeTo: this.route,
        queryParams: {
          category: this.selectedCategoryId,
          module: this.moduleSelected,
          topic: this.selectedTopicId,
          scrollToElement: undefined,
        },
        queryParamsHandling: queryParamHandlingStrategy
      });
  }

  ngOnInit() {
    if(history.state.type === 'modulePage'){
      this.selectedCategoryId=undefined;
      this.selectedModuleId=undefined;
    }
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
      this.category = data
      if (this.category.userAssessmentCategories !== undefined && this.category.userAssessmentCategories.length > 0) {
        this.category.userAssessmentCategories = this.category.userAssessmentCategories.sort((category1, category2) => Number(category2.active) - Number(category1.active))
        if (this.selectedCategoryId !== undefined) {
          this.navigateToSelectedParams();
        } else {
          this.navigateToFirstActiveModule();
        }
      }
    })
  }

  private navigateToFirstActiveModule() {
    let index = this.category.userAssessmentCategories.findIndex(category => category.active);
    let selectedCategory = this.category.userAssessmentCategories[index];
    this.categorySelected = selectedCategory.categoryId;
    let moduleIndex = selectedCategory.modules.findIndex(module => module.active);
    if (moduleIndex > -1) {
      this.navigate(selectedCategory.modules[moduleIndex]);
    }
  }

  private navigateToSelectedParams() {
    let selectedCategory = this.category.userAssessmentCategories.find(category => category.categoryId == this.selectedCategoryId);
    let selectedModule = selectedCategory?.modules.find(module => module.moduleId == this.selectedModuleId);

    this.moduleSelected = selectedModule?.moduleId;
    this.topics = selectedModule?.topics;
    this.selectedIndex = this.topics?.findIndex(topic => topic.topicId == this.selectedTopicId);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private navigateToModule(drafted: string, assessmentId: number) {
    if (drafted !== "inProgress") {
      this.router.navigateByUrl("assessmentModule/" + assessmentId, {state: {type: 'url'}});
    }

  }

  shouldExpandCategory(isFirst: boolean, categoryId: number): boolean {
    if (this.selectedCategoryId !== undefined) {
      return this.selectedCategoryId == categoryId;
    } else
      return isFirst;
  }
}
