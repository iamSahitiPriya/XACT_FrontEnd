/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, ViewChild} from '@angular/core';
import {CategoryStructure} from "../../types/categoryStructure";
import {BehaviorSubject} from "rxjs";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {TopicStructure} from "../../types/topicStructure";
import {ModuleStructure} from "../../types/moduleStructure";
import {AssessmentStructure} from "../../types/assessmentStructure";
import {ParameterStructure} from "../../types/parameterStructure";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {TopicLevelAssessmentComponent} from "../assessment-rating-and-recommendation/topic-level-assessment.component";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ErrorComponentComponent} from "../error-component/error-component.component";

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

  constructor(private appService: AppServiceService, private route: ActivatedRoute, private dialog: MatDialog) {
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
    this.getCategories();
    this.getAssessment();
  }


  private getAssessment() {
    this.appService.getAssessment(this.assessmentId).subscribe((_data) => {
        this.assessment = _data;
        this.setAssessment(this.assessment)
        this.receiveStatus(this.assessment.assessmentStatus);
      },
      (_error) => {
        const openConfirm = this.dialog.open(ErrorComponentComponent,      {backdropClass:'backdrop-bg-opaque'});
        openConfirm.componentInstance.bodyText = "We are facing problem accessing this assessment.";
      }
    )
  }

  private setAssessment(assessment: AssessmentStructure) {
    this.assessment = assessment
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
