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
import {TopicLevelAssessmentComponent} from "../topic-level-assessment/topic-level-assessment.component";
import {ControlContainer, NgForm} from "@angular/forms";

let categories: CategoryStructure[] = []
let valueEmitter = new BehaviorSubject<CategoryStructure[]>(categories)

@Component({
  selector: 'app-assessment-modules-details',
  templateUrl: './assessment-modules-details.component.html',
  styleUrls: ['./assessment-modules-details.component.css'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class AssessmentModulesDetailsComponent {
  assessmentName: string
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

  @ViewChild('testForm')
  public testForm: any

  constructor(private appService: AppServiceService) {
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.selectedIndex = tabChangeEvent.index;
  }

  navigate(module: ModuleStructure) {
    this.moduleSelected = module.moduleId;
    this.topics = module.topics;
  }

  ngOnInit(): void {
    if (history.state.assessmentName) {
      this.assessmentName = history.state.assessmentName
      this.assessmentId = history.state.assessmentId
      sessionStorage.setItem('assessmentName', JSON.stringify(this.assessmentName))
      sessionStorage.setItem('assessmentId', JSON.stringify(this.assessmentId))
    } else {
      this.assessmentName = JSON.parse(sessionStorage.getItem('assessmentName') || "No value")
      this.assessmentId = JSON.parse(sessionStorage.getItem('assessmentId') || "No value")
    }
    this.getCategories();
    this.getAssessment();
  }


  private getAssessment() {
    this.appService.getAssessment(this.assessmentId).subscribe((_data) => {
        this.assessment = _data;
        this.setAssessment(this.assessment)
        this.receiveStatus(this.assessment.assessmentStatus);
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
    this.updateFormActions();
  }

  disableForm() {
    setTimeout(() => {
      this.testForm.form.disable();
    }, 500);
  }

  enableForm() {
    setTimeout(() => {
      this.testForm.form.enable();
    }, 500);
  }

  updateFormActions() {
    if (this.assessment.assessmentStatus === 'Completed')
      this.disableForm();
    if (this.assessment.assessmentStatus === 'Active')
      this.enableForm();
  }

}
