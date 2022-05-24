import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {AssessmentQuestionComponent} from "../assessment-question/assessment-question.component";
import {AssessmentRecommendationComponent} from "../assessment-recommendation/assessment-recommendation.component";

@Component({
  selector: 'app-popup-confirmation',
  templateUrl: './popup-confirmation.component.html',
  styleUrls: ['./popup-confirmation.component.css']
})
export class PopupConfirmationComponent{

  constructor(public dialogRef: MatDialogRef<PopupConfirmationComponent>) { }

  cancelChanges() {
    this.dialogRef.close(1)
  }
}
