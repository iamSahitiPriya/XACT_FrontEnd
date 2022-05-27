import {Component, Input} from '@angular/core';
import {AppServiceService} from "../../services/app-service/app-service.service";
import FileSaver, {saveAs} from 'file-saver';

@Component({
  selector: 'app-assessment-menu',
  templateUrl: './assessment-menu.component.html',
  styleUrls: ['./assessment-menu.component.css']
})
export class AssessmentMenuComponent {

  @Input()
  assessmentId: number

  constructor(private appService: AppServiceService) {
  }

  generateReport() {
    const reportName = "xact-report-" + this.assessmentId + ".xlsx";
    this.appService.generateReport(this.assessmentId).subscribe(blob => {
      saveAs(blob, reportName);
    });
  }



}
