import {Component, Input, OnInit} from '@angular/core';


import {AppServiceService} from "../../services/app-service/app-service.service";
import {saveAs} from 'file-saver';
import {PopupConfirmationComponent} from "../popup-confirmation/popup-confirmation.component";
import {MatDialog} from "@angular/material/dialog";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AssessmentStructure} from "../../types/assessmentStructure";
import {Store} from "@ngrx/store";
import {AssessmentState} from "../../reducers/app.states";
import * as fromReducer from "../../reducers/assessment.reducer";
import {Observable} from "rxjs";
import * as fromActions from "../../actions/assessment-data.actions";
import * as moment from 'moment';

export const assessmentData = [{}]

@Component({
  selector: 'app-assessment-menu',
  templateUrl: './assessment-menu.component.html',
  styleUrls: ['./assessment-menu.component.css']
})


export class AssessmentMenuComponent implements OnInit {
  savedAnswer: string
  createAssessmentForm: FormGroup;
  columnName = ["name", "delete"];
  assessment: AssessmentStructure;
  data: AssessmentStructure;
  @Input()
  assessmentId: number
  answerResponse1: Observable<AssessmentStructure>;
  private cloneAssessment: AssessmentStructure;
  public static answerSaved: string;

  constructor(private appService: AppServiceService, private dialog: MatDialog, private errorDisplay: MatSnackBar, private formBuilder: FormBuilder, private store: Store<AssessmentState>) {
    this.answerResponse1 = this.store.select(fromReducer.getAssessments)
  }

  generateReport() {
    let reportStatus = this.assessment.assessmentStatus === 'Active' ? 'Interim' : 'Final';
    const date = moment().format('DD-MM-YYYY');
    const reportName = reportStatus + "-xact-report-" + this.assessment.assessmentName + "-" + date + ".xlsx";
    this.appService.generateReport(this.assessmentId).subscribe(blob => {
      saveAs(blob, reportName);
    });
  }


  finishAssessment() {
    this.appService.finishAssessment(this.assessmentId).subscribe((_data) => {
        this.cloneAssessment = Object.assign({}, this.assessment)
        this.cloneAssessment.assessmentStatus = _data.assessmentStatus
        this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneAssessment}))
      }
    )
  }

  confirmFinishAssessmentAction() {
    const openConfirm = this.dialog.open(PopupConfirmationComponent, {
      width: '448px',
      height: '203px'
    });
    openConfirm.componentInstance.text = "Are you sure? You will not be able to edit assessment again without reopening it.";
    openConfirm.afterClosed().subscribe(result => {
      if (result === 1) {
        this.finishAssessment();
      }
    })
  }

  reopenAssessment() {
    this.appService.reopenAssessment(this.assessmentId).subscribe((_data) => {
        this.sendAssessmentStatus(_data.assessmentStatus)
      }
    )
  }

  sendAssessmentStatus(assessmentStatus: string) {
    this.cloneAssessment = Object.assign({}, this.assessment)
    this.cloneAssessment.assessmentStatus = assessmentStatus
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneAssessment}))
  }


  async openAssessment(content: any) {
    assessmentData.splice(0, assessmentData.length)

    const dialogRef = this.dialog.open(content, {
      width: '630px', height: '650px',
    })
    dialogRef.disableClose = true;
  }


  closePopUp(): void {
    this.dialog.closeAll()
  }

  updateAssessmentStatus() {
    AssessmentMenuComponent.answerSaved = `Data was saved ${moment(new Date(this.assessment.updatedAt)).startOf('second').fromNow()}`
  }

  ngOnInit(): void {
    this.answerResponse1.subscribe(data => {
      if (data !== undefined) {
        this.assessment = data
        this.updateAssessmentStatus()
      }
    })
  }

  getAnswerStatus() {
    setInterval(() => {
      this.updateAssessmentStatus()
    }, 60000)
    return AssessmentMenuComponent.answerSaved
  }

}


