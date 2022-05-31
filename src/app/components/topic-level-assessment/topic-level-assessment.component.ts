/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {TopicStructure} from "../../types/topicStructure";
import {assessmentData, AssessmentQuestionComponent} from "../assessment-question/assessment-question.component";
import {Notes} from "../../types/answerRequest";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {MatDialog} from "@angular/material/dialog";
import {PopupConfirmationComponent} from "../popup-confirmation/popup-confirmation.component";
import {FormBuilder, FormGroup} from "@angular/forms";
import {TopicRatingAndRecommendation} from "../../types/topicRatingAndRecommendation";
import {TopicRequest} from "../../types/topicRequest";
import {SaveRequest} from "../../types/saveRequest";
import {ParameterRequest} from "../../types/parameterRequest";
import {ParameterRatingAndRecommendation} from "../../types/parameterRatingAndRecommendation";
import {TopicLevelRecommendationComponent} from "../topic-level-recommendation/topic-level-recommendation.component";

@Component({
  selector: 'app-topic-level-assessment',
  templateUrl: './topic-level-assessment.component.html',
  styleUrls: ['./topic-level-assessment.component.css']
})

export class TopicLevelAssessmentComponent implements OnInit{
  textAreaElement: FormGroup;

  notes: Notes[] =[];
  topicRequest: TopicRequest;
  private parameterRequest: ParameterRequest[];
  constructor(public dialog:MatDialog, private appService: AppServiceService, private _fb:FormBuilder) {}

  ngOnInit(): void {
    this.topicRatingAndRecommendation = {rating: "", recommendation: "", topicId: this.topicInput.topicId};

  }


  public answerSaved: boolean = false;
  public makeDisable = false
  @Input() selectedIndex: number
  @Output() goNext = new EventEmitter<number>();
  @Output() goBack = new EventEmitter<number>();
  @Input() assessmentId: number
  @Input() topicInput: TopicStructure;
  @Input() assessmentStatus: string;

  topicRatingAndRecommendation: TopicRatingAndRecommendation;

  @ViewChild(AssessmentQuestionComponent)
  assessmentQuestionComponent: AssessmentQuestionComponent;

  @ViewChild(TopicLevelRecommendationComponent)
  topicLevelRecommendationComponent: TopicLevelRecommendationComponent;

  @ViewChild('testForm')
  public testForm: any

  next(isChanged: boolean | null) {
    if (!isChanged) {
      const openConfirm = this.dialog.open(PopupConfirmationComponent, {
        width: '448px',
        height: '203px'
      })
      openConfirm.afterClosed().subscribe(result => {
        if (result === 1) {
          this.assessmentQuestionComponent.handleCancel()
          this.testForm.control.markAsPristine()
          this.selectedIndex += 1
          this.goNext.emit(this.selectedIndex)
        }
      })
    } else {
      this.selectedIndex += 1
      this.goNext.emit(this.selectedIndex)
    }
  }

  previous(isChanged: boolean | null) {
    if (!isChanged) {
      const openConfirm = this.dialog.open(PopupConfirmationComponent, {
        width: '448px',
        height: '203px'
      })
      openConfirm.afterClosed().subscribe(result => {
        if (result === 1) {
          this.assessmentQuestionComponent.handleCancel()
          this.testForm.control.markAsPristine()
          this.selectedIndex -= 1
          this.goNext.emit(this.selectedIndex)
        }
      })
    } else {
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
          this.testForm.control.markAsPristine()
        }
      })
  }

  // save() {
  //   const parameterRequest: ParameterRequest = {
  //     answerRequest: this.notes, parameterRatingAndRecommendation: this.parameterRatingAndRecommendation;
  //   }
  //   const topicRequest: TopicRequest = {
  //     parameterRequest:[parameterRequest] ,topicRatingAndRecommendation : this.topicRatingAndRecommendation,
  //   }
  //   const saveRequest: SaveRequest = {
  //     assessmentId: this.assessmentId, topicRequest:this.topicRequest
  //   };
  //
  //   this.appService.saveAssessment(saveRequest).subscribe((_data) => {
  //       assessmentData.push(saveRequest);
  //       window.location.reload()
  //     }
  //   )
  //   this.answerSaved = true
  // }

  receiveRating(topicRating: TopicRatingAndRecommendation) {
    console.log("gotRating")
    this.topicRatingAndRecommendation.rating=topicRating.rating
    this.topicLevelRecommendationComponent.topicRatingAndRecommendation.rating=topicRating.rating;
  }

  disableForm() {
    this.testForm.form.disable();
  }

  enableForm() {
    this.testForm.form.enable();
  }

  updateAssessmentStatus(assessmentStatus: string) {
    this.assessmentStatus = assessmentStatus;
    if (this.assessmentStatus === 'Completed')
      this.disableForm();
    else
      this.enableForm();
  }
}
