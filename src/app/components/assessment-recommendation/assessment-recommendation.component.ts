/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, ElementRef, ViewChild} from '@angular/core';
import {ControlContainer, NgForm} from "@angular/forms";

@Component({
  selector: 'app-assessment-recommendation',
  templateUrl: './assessment-recommendation.component.html',
  styleUrls: ['./assessment-recommendation.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class AssessmentRecommendationComponent {

  @ViewChild('recommendationElement') recommendationElement: ElementRef;


  handleCancel() {
    this.recommendationElement.nativeElement.value = '';
  }

}
