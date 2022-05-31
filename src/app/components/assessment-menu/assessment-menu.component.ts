import {Component, Input, Output,EventEmitter} from '@angular/core';
import {AppServiceService} from "../../services/app-service/app-service.service";
import {saveAs} from 'file-saver';

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

  constructor(private appService: AppServiceService) {
  }

  generateReport() {
    const reportName = "xact-report-" + this.assessmentId + ".xlsx";
    this.appService.generateReport(this.assessmentId).subscribe(blob => {
      saveAs(blob, reportName);
    });
  }


  public finishAssessment() {
    this.appService.finishAssessment(this.assessmentId).subscribe((_data) => {
        this.assessmentStatus = _data.assessmentStatus;
        this.sendStatus();
      }
    )
  }

  reopenAssessment() {
    this.appService.reopenAssessment(this.assessmentId).subscribe((_data) => {
        this.assessmentStatus = _data.assessmentStatus;
        this.sendStatus();
      }
    )
  }
}
