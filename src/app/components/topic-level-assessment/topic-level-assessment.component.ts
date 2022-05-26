/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {TopicStructure} from "../../types/topicStructure";
import {assessmentData, AssessmentQuestionComponent} from "../assessment-question/assessment-question.component";
import {AssessmentRecommendationComponent} from "../assessment-recommendation/assessment-recommendation.component";
import {Notes} from "../../types/notes";
import {AnswerRequest} from "../../types/answerRequest";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {MatDialog} from "@angular/material/dialog";
import {PopupConfirmationComponent} from "../popup-confirmation/popup-confirmation.component";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-topic-level-assessment',
  templateUrl: './topic-level-assessment.component.html',
  styleUrls: ['./topic-level-assessment.component.css']
})


export class TopicLevelAssessmentComponent{
  textAreaElement: FormGroup;
  notes: Notes[] =[];
  constructor(public dialog:MatDialog, private appService: AppServiceService, private _fb:FormBuilder) {}
  public answerSaved: boolean = false;
  public makeDisable = false
  @Input() selectedIndex: number
  @Output() goNext = new EventEmitter<number>();
  @Output() goBack = new EventEmitter<number>();
  @Input() assessmentId: number
  @Input() topicInput: TopicStructure;

  @ViewChild(AssessmentQuestionComponent)
  assessmentQuestionComponent: AssessmentQuestionComponent;

  @ViewChild(AssessmentRecommendationComponent)
  assessmentRecommendationComponent: AssessmentRecommendationComponent;

  @ViewChild('testForm')
  public testForm:any

  next(isChanged:boolean | null) {
    if(!isChanged) {
      const openConfirm = this.dialog.open(PopupConfirmationComponent, {
        width: '448px',
        height: '203px'
      })
      openConfirm.afterClosed().subscribe(result => {
        if (result === 1) {
          this.assessmentQuestionComponent.handleCancel()
          this.assessmentRecommendationComponent.handleCancel()
          this.testForm.control.markAsPristine()
          this.selectedIndex += 1
          this.goNext.emit(this.selectedIndex)
        }
      })
    }else{
      this.selectedIndex += 1
      this.goNext.emit(this.selectedIndex)
    }
  }

  previous(isChanged:boolean | null) {
    if(!isChanged) {
      const openConfirm = this.dialog.open(PopupConfirmationComponent, {
        width: '448px',
        height: '203px'
      })
      openConfirm.afterClosed().subscribe(result => {
        if (result === 1) {
          this.assessmentQuestionComponent.handleCancel()
          this.assessmentRecommendationComponent.handleCancel()
          this.testForm.control.markAsPristine()
          this.selectedIndex -= 1
          this.goNext.emit(this.selectedIndex)
        }
      })
    }else{
      this.selectedIndex -= 1
      this.goNext.emit(this.selectedIndex)
    }
  }

  cancel() {
      const openConfirm = this.dialog.open(PopupConfirmationComponent, {
        width: '448px',
        height: '203px'
      })
      openConfirm.afterClosed().subscribe(result => {
        if (result === 1) {
          this.assessmentQuestionComponent.handleCancel()
          this.assessmentRecommendationComponent.handleCancel()
          this.testForm.control.markAsPristine()
        }
      })
  }

  save() {
    const answerRequest: AnswerRequest = {
      assessmentId: this.assessmentId, notes: this.notes
    };
    this.appService.saveAssessment(answerRequest).subscribe((_data) => {
        assessmentData.push(answerRequest);
        window.location.reload()
      }
    )
    this.answerSaved = true

  }
}
