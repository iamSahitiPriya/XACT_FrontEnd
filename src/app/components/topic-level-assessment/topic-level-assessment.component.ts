/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {TopicStructure} from "../../types/topicStructure";
import {AssessmentQuestionComponent} from "../assessment-question/assessment-question.component";
import {Notes} from "../../types/answerRequest";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {MatDialog} from "@angular/material/dialog";
import {FormBuilder} from "@angular/forms";
import {TopicRatingAndRecommendation} from "../../types/topicRatingAndRecommendation";
import {TopicRequest} from "../../types/topicRequest";
import {ParameterRequest} from "../../types/parameterRequest";
import {TopicLevelRecommendationComponent} from "../topic-level-recommendation/topic-level-recommendation.component";
import {ParameterRatingAndRecommendation} from "../../types/parameterRatingAndRecommendation";
import {SaveRequest} from "../../types/saveRequest";


export const saveAssessmentData = [{}]

let topicId: number;
let topicRatingAndRecommendation: TopicRatingAndRecommendation;

export class parameterRequest {
  answerRequest: Notes[] = []
  parameterRatingAndRecommendation: ParameterRatingAndRecommendation

  constructor(answerRequest: Notes[], parameterRatingAndRecommendation: ParameterRatingAndRecommendation) {
    this.answerRequest = answerRequest;
    this.parameterRatingAndRecommendation = parameterRatingAndRecommendation;
  }
}

let parameterRequests: parameterRequest[];

@Component({
  selector: 'app-topic-level-assessment',
  templateUrl: './topic-level-assessment.component.html',
  styleUrls: ['./topic-level-assessment.component.css']
})


export class TopicLevelAssessmentComponent implements OnInit {

  notes: Notes[] = [];

  topicRequest: TopicRequest = {
    parameterLevel: parameterRequests = [],
    topicRatingAndRecommendation: topicRatingAndRecommendation
  };

  constructor(public dialog: MatDialog, private appService: AppServiceService, private _fb: FormBuilder) {
  }


  public answerSaved: boolean = false;
  public makeDisable = false
  @Input() selectedIndex: number
  @Output() goNext = new EventEmitter<number>();
  @Output() goBack = new EventEmitter<number>();
  @Input() assessmentId: number
  @Input() topicInput: TopicStructure;
  @Input() assessmentStatus: string;


  topicRatingAndRecommendation: TopicRatingAndRecommendation = {
    rating: "",
    recommendation: "",
    topicId: topicId
  }

  @ViewChild(AssessmentQuestionComponent)
  assessmentQuestionComponent: AssessmentQuestionComponent;

  @ViewChild(TopicLevelRecommendationComponent)
  topicLevelRecommendationComponent: TopicLevelRecommendationComponent;

  @ViewChild('testForm')
  public testForm: any

  // next(isChanged: boolean | null) {
  //   if (!isChanged) {
  //     const openConfirm = this.dialog.open(PopupConfirmationComponent, {
  //       width: '448px',
  //       height: '203px'
  //     })
  //     openConfirm.afterClosed().subscribe(result => {
  //       if (result === 1) {
  //         this.testForm.control.markAsPristine()
  //         this.selectedIndex += 1
  //         this.goNext.emit(this.selectedIndex)
  //       }
  //     })
  //   } else {
  //     this.selectedIndex += 1
  //     this.goNext.emit(this.selectedIndex)
  //   }
  // }

  // previous(isChanged: boolean | null) {
  //   if (!isChanged) {
  //     const openConfirm = this.dialog.open(PopupConfirmationComponent, {
  //       width: '448px',
  //       height: '203px'
  //     })
  //     openConfirm.afterClosed().subscribe(result => {
  //       if (result === 1) {
  //         this.testForm.control.markAsPristine()
  //         this.selectedIndex -= 1
  //         this.goNext.emit(this.selectedIndex)
  //       }
  //     })
  //   } else {
  //     this.selectedIndex -= 1
  //     this.goNext.emit(this.selectedIndex)
  //   }
  // }
  //
  // cancel() {
  //   const openConfirm = this.dialog.open(PopupConfirmationComponent, {
  //     width: '448px',
  //     height: '203px'
  //   })
  //   openConfirm.afterClosed().subscribe(result => {
  //     if (result === 1) {
  //       this.testForm.control.markAsPristine()
  //     }
  //   })
  // }

  save() {

    const saveRequest: SaveRequest = {
      assessmentId: this.assessmentId, topicRequest: this.topicRequest
    };
    this.appService.saveAssessment(saveRequest).subscribe((_data) => {
        saveAssessmentData.push(saveRequest);
        console.log(saveRequest)
      }
    )
    this.answerSaved = true
  }

  receiveRating(topicRating: TopicRatingAndRecommendation) {
    console.log("gotRating")
    this.topicRatingAndRecommendation.rating = topicRating.rating
    this.topicLevelRecommendationComponent.topicRatingAndRecommendation.rating = topicRating.rating;
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

  getParameterRequest(parameterId: number): ParameterRequest {
    const newParameterRequest = {
      answerRequest: this.notes
    }
    this.topicRequest.parameterLevel.push(<ParameterRequest>newParameterRequest);
    console.log("request", this.topicRequest.parameterLevel)
    return <ParameterRequest>newParameterRequest;
  }

  getParameterWithRatingAndRecommendationRequest(parameterId: number): ParameterRequest {
    const newParameterRequest = {
      answerRequest: this.notes, parameterRatingAndRecommendation: {
        parameterId: parameterId, rating: "", recommendation: ""
      }
    }
    this.topicRequest.parameterLevel.push(<ParameterRequest>newParameterRequest);
    console.log("request", this.topicRequest.parameterLevel)
    return <ParameterRequest>newParameterRequest;
  }

  ngOnInit(): void {
    if (this.topicInput.references != null) {
      for (let parameter in this.topicInput.parameters) {
        this.getParameterRequest(this.topicInput.parameters[parameter].parameterId)
      }
      this.topicRequest.topicRatingAndRecommendation = {
        rating: "",
        recommendation: "",
        topicId: topicId
      }

    } else {
        for (let parameter in this.topicInput.parameters) {
          this.getParameterWithRatingAndRecommendationRequest(this.topicInput.parameters[parameter].parameterId)
        }
      }
  }
}
