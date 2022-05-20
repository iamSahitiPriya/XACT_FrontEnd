import {Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-assessment-recommendation',
  templateUrl: './assessment-recommendation.component.html',
  styleUrls: ['./assessment-recommendation.component.css']
})
export class AssessmentRecommendationComponent {

  @ViewChild('recommendationElement') recommendationElement: ElementRef;

  handleCancel() {
    console.log(this.recommendationElement.nativeElement.value)
    this.recommendationElement.nativeElement.value = '';
  }

}
