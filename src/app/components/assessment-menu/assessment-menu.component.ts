import {Component, EventEmitter, Input, Output} from '@angular/core';


import {AppServiceService} from "../../services/app-service/app-service.service";
import {saveAs} from 'file-saver';
import {PopupConfirmationComponent} from "../popup-confirmation/popup-confirmation.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormGroup} from "@angular/forms";
import {AssessmentStructure} from "../../types/assessmentStructure";

export const assessmentData = [{}]

@Component({
  selector: 'app-assessment-menu',
  templateUrl: './assessment-menu.component.html',
  styleUrls: ['./assessment-menu.component.css']
})


export class AssessmentMenuComponent {
  createAssessmentForm: FormGroup;
  loggedInUserEmail: string;
  loading: boolean;
  userEmail: string = '';

  @Input()
  assessment: AssessmentStructure;

  @Output() statusEvent = new EventEmitter<string>();
  private dialogRef: MatDialogRef<any>;


  sendStatus() {
    this.statusEvent.emit(this.assessment.assessmentStatus)
  }

  constructor(private appService: AppServiceService, private dialog: MatDialog) {
  }

  generateReport() {
    const reportName = "xact-report-" + this.assessment.assessmentId + ".xlsx";
    this.appService.generateReport(this.assessment.assessmentId).subscribe(blob => {
      saveAs(blob, reportName);
    });
  }


  finishAssessment() {
    this.appService.finishAssessment(this.assessment.assessmentId).subscribe((_data) => {
        this.assessment.assessmentStatus = _data.assessmentStatus;
        this.sendStatus();
      }
    )
  }

  confirmFinishAssessmentAction() {
    const openConfirm = this.dialog.open(PopupConfirmationComponent, {
      width: '448px',
      height: '203px'
    });
    openConfirm.componentInstance.text = "Are you sure ? You will not be able to edit assessment again without reopening it.";
    openConfirm.afterClosed().subscribe(result => {
      if (result === 1) {
        this.finishAssessment();
      }
    })
  }

  reopenAssessment() {
    this.appService.reopenAssessment(this.assessment.assessmentId).subscribe((_data) => {
        this.assessment.assessmentStatus = _data.assessmentStatus;
        this.sendStatus();
      }
    )

  }
  async openAssessment(content: any) {
    assessmentData.splice(0, assessmentData.length)

    this.dialogRef = this.dialog.open(content, {
      width: '630px', height: '650px',
    })
  }
}


