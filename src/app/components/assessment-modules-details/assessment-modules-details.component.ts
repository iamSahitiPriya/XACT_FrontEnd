/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, ViewChild} from '@angular/core';
import {CategoryStructure} from "../../types/categoryStructure";
import {BehaviorSubject, Observable} from "rxjs";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {TopicStructure} from "../../types/topicStructure";
import {ModuleStructure} from "../../types/moduleStructure";
import {AssessmentStructure} from "../../types/assessmentStructure";
import {ParameterStructure} from "../../types/parameterStructure";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {TopicLevelAssessmentComponent} from "../assessment-rating-and-recommendation/topic-level-assessment.component";
import {ActivatedRoute} from "@angular/router";
import * as fromReducer from "../../reducers/assessment.reducer";
import {Store} from "@ngrx/store";
import {AssessmentState} from "../../reducers/app.states";
import * as fromActions from "../../actions/assessment_data.actions";

let categories: CategoryStructure[] = []
let valueEmitter = new BehaviorSubject<CategoryStructure[]>(categories)

@Component({
  selector: 'app-assessment-modules-details',
  templateUrl: './assessment-modules-details.component.html',
  styleUrls: ['./assessment-modules-details.component.css']
})
export class AssessmentModulesDetailsComponent {
  moduleName: string
  assessment: AssessmentStructure
  category: CategoryStructure[] = []
  topics: TopicStructure[];
  parameters: ParameterStructure[];
  moduleSelected: number;
  topic: TopicStructure;
  parameter: ParameterStructure;
  topicName: string;
  selectedIndex: number = 0;
  assessmentId: number;

  @ViewChild(TopicLevelAssessmentComponent)
  topicLevelAssessmentComponent: TopicLevelAssessmentComponent;
  answer:Observable<AssessmentStructure>

  constructor(private appService: AppServiceService, private route: ActivatedRoute, private store:Store<AssessmentState>) {
    this.answer = this.store.select(fromReducer.getAssessments)
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.selectedIndex = tabChangeEvent.index;
  }

  navigate(module: ModuleStructure) {
    this.moduleSelected = module.moduleId;
    this.topics = module.topics;
  }

  ngOnInit(): void {
    const assessmentIdParam = this.route.snapshot.paramMap.get('assessmentId') || 0;
    this.assessmentId = +assessmentIdParam;
    this.store.dispatch(fromActions.getAssessmentId({id:this.assessmentId}))
    this.answer.subscribe(data =>{
      if(data !== undefined) {
        this.assessment = data
        this.receiveStatus(this.assessment.assessmentStatus);
      }
    })

    this.getCategories();
    // this.getAssessment();
  }


  private getAssessment() {

    // this.appService.getAssessment(this.assessmentId).subscribe((_data) => {
    //     this.assessment = _data;
    //     this.receiveStatus(this.assessment.assessmentStatus);
    //   }
    // )
  }

  private getCategories() {
    this.appService.getCategories().subscribe(data => {
      categories = data
      valueEmitter.next(categories)
    })
    valueEmitter.subscribe(data => {
      this.category = data
      if (this.category.length > 0)
        this.navigate(this.category[0].modules[0])
    })
  }

  receiveStatus(assessmentStatus: string) {
    this.assessment.assessmentStatus = assessmentStatus;
  }

}
