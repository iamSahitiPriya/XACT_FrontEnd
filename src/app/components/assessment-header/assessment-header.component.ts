import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {AssessmentStructure} from "../../types/assessmentStructure";
import {Observable, Subject, takeUntil} from "rxjs";
import {data_local} from "../../messages";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Store} from "@ngrx/store";
import {AppStates} from "../../reducers/app.states";
import * as fromActions from "../../actions/assessment-data.actions";
import {PopupConfirmationComponent} from "../popup-confirmation/popup-confirmation.component";
import {AssessmentMenuComponent} from "../assessment-quick-action-menu/assessment-menu.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-assessment-header',
  templateUrl: './assessment-header.component.html',
  styleUrls: ['./assessment-header.component.css']
})
export class AssessmentHeaderComponent implements OnInit, OnDestroy {

  savedAnswer: string
  createAssessmentForm: UntypedFormGroup;
  columnName = ["name", "delete"];
  assessment: AssessmentStructure;
  data: AssessmentStructure;
  @Input()
  assessmentId: number

  @ViewChild('assessmentMenuComponent')
  assessmentMenuComponent: AssessmentMenuComponent;

  answerResponse1: Observable<AssessmentStructure>;
  private cloneAssessment: AssessmentStructure;
  public static answerSaved: string;
  generateReportToolTip = data_local.ASSESSMENT_MENU.GENERATE_REPORT.TOOLTIP;
  generateReportTitle = data_local.ASSESSMENT_MENU.GENERATE_REPORT.TITLE;
  finishAssessmentToolTip = data_local.ASSESSMENT_MENU.FINISH_ASSESSMENT.TOOLTIP;
  finishAssessmentTitle = data_local.ASSESSMENT_MENU.FINISH_ASSESSMENT.TITLE;
  reopenAssessmentToolTip = data_local.ASSESSMENT_MENU.REOPEN_ASSESSMENT.TOOLTIP;
  reopenAssessmentTitle = data_local.ASSESSMENT_MENU.REOPEN_ASSESSMENT.TITLE;

  private destroy$: Subject<void> = new Subject<void>();
  assessmentUpdateStatus = data_local.ASSESSMENT_MENU.LAST_SAVE_STATUS_TEXT;
  assessmentHeader: string = "assessmentHeader";

  constructor(private appService: AppServiceService, private dialog: MatDialog, private snackBar: MatSnackBar, private formBuilder: UntypedFormBuilder, private store: Store<AppStates>, private router: Router) {
    this.answerResponse1 = this.store.select((storeMap) => storeMap.assessmentState.assessments)
  }

  finishAssessment() {
    this.appService.finishAssessment(this.assessmentId).pipe(takeUntil(this.destroy$)).subscribe((_data) => {
        this.cloneAssessment = Object.assign({}, this.assessment)
        this.cloneAssessment.assessmentStatus = _data.assessmentStatus
        this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneAssessment}))
        this.router.navigateByUrl("assessment/" + this.assessmentId + "/charts");

      }
    )
  }

  confirmFinishAssessmentAction() {
    const openConfirm = this.dialog.open(PopupConfirmationComponent, {
      width: '448px',
      height: '203px'
    });
    openConfirm.componentInstance.text = data_local.ASSESSMENT_MENU.CONFIRMATION_POPUP_TEXT;
    openConfirm.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
      if (result === 1) {
        this.finishAssessment();
      }
    })
  }

  reopenAssessment() {
    this.appService.reopenAssessment(this.assessmentId).pipe(takeUntil(this.destroy$)).subscribe((_data) => {
        this.sendAssessmentStatus(_data.assessmentStatus)
      }
    )
  }

  sendAssessmentStatus(assessmentStatus: string) {
    this.cloneAssessment = Object.assign({}, this.assessment)
    this.cloneAssessment.assessmentStatus = assessmentStatus
    this.store.dispatch(fromActions.getUpdatedAssessmentData({newData: this.cloneAssessment}))
  }


  ngOnInit(): void {
    this.answerResponse1.pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (data !== undefined) {
        this.assessment = data;
      }
    })
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}


