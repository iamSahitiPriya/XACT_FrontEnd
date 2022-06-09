import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AppServiceService} from "../../services/app-service/app-service.service";
import {saveAs} from 'file-saver';
import {PopupConfirmationComponent} from "../popup-confirmation/popup-confirmation.component";
import {MatDialog} from "@angular/material/dialog";


@Component({
  selector: 'app-assessment-menu',
  templateUrl: './assessment-menu.component.html',
  styleUrls: ['./assessment-menu.component.css']
})
export class AssessmentMenuComponent {
  @Input()
  assessmentId: number

  @Input()
  assessmentStatus: string

  @Output() statusEvent = new EventEmitter<string>();


  sendStatus() {
    this.statusEvent.emit(this.assessmentStatus)
  }

  constructor(private appService: AppServiceService, private dialog: MatDialog) {
  }

  generateReport() {
    const reportName = "xact-report-" + this.assessmentId + ".xlsx";
    this.appService.generateReport(this.assessmentId).subscribe(blob => {
      saveAs(blob, reportName);
    });
  }


  finishAssessment() {
    this.appService.finishAssessment(this.assessmentId).subscribe((_data) => {
        this.assessmentStatus = _data.assessmentStatus;
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
    this.appService.reopenAssessment(this.assessmentId).subscribe((_data) => {
        this.assessmentStatus = _data.assessmentStatus;
        this.sendStatus();
      }
    )

  }

}


