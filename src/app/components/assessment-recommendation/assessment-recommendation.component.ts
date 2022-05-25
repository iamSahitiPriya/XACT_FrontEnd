/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-assessment-recommendation',
  templateUrl: './assessment-recommendation.component.html',
  styleUrls: ['./assessment-recommendation.component.css']
})
export class AssessmentRecommendationComponent {

  @ViewChild('recommendationElement') recommendationElement: ElementRef;


  handleCancel() {
    this.recommendationElement.nativeElement.value = '';
  }

}
