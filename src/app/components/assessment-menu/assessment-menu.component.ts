import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';


import {AppServiceService} from "../../services/app-service/app-service.service";
import {saveAs} from 'file-saver';
import {PopupConfirmationComponent} from "../popup-confirmation/popup-confirmation.component";
import {MatDialog} from "@angular/material/dialog";

import {OKTA_AUTH} from "@okta/okta-angular";
import {OktaAuth} from "@okta/okta-auth-js";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {User} from "../../types/user";
import {AssessmentStructure} from "../../types/assessmentStructure";
import {Store} from "@ngrx/store";
import {AssessmentState} from "../../reducers/app.states";
import * as fromReducer from "../../reducers/assessment.reducer";
import {Observable} from "rxjs";
import * as fromActions from "../../actions/assessment_data.actions";

export const assessmentData = [{}]


@Component({
  selector: 'app-assessment-menu',
  templateUrl: './assessment-menu.component.html',
  styleUrls: ['./assessment-menu.component.css']
})


export class AssessmentMenuComponent implements OnInit {
  createAssessmentForm: FormGroup;
  columnName = ["name", "delete"];
  assessmentName: string = '';
  organizationName: string = '';
  domain: string = '';
  industry: string = '';
  teamSize: number;
  email: string = '';
  submitted: boolean = false;
  loggedInUserEmail: string;
  loading: boolean;
  userEmail: string = '';
  UserEmails: string[];
  assessment: AssessmentStructure;
  data: AssessmentStructure;
  @Input()
  assessmentId: number

  assessmentStatus: string

  answerResponse1: Observable<AssessmentStructure>;
  private cloneAssessment: AssessmentStructure;

  constructor(private appService: AppServiceService, private dialog: MatDialog, @Inject(OKTA_AUTH) public oktaAuth: OktaAuth, private errorDisplay: MatSnackBar, private formBuilder: FormBuilder, private store: Store<AssessmentState>) {
    this.answerResponse1 = this.store.select(fromReducer.getAssessments)

  }

  generateReport() {
    const reportName = "xact-report-" + this.assessmentId + ".xlsx";
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
    openConfirm.componentInstance.text = "Are you sure ? You will not be able to edit assessment again without reopening it.";
    openConfirm.afterClosed().subscribe(result => {
      if (result === 1) {
        this.emailList = [];
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
    dialogRef.afterClosed().subscribe(_result => {
      assessmentData.splice(0, assessmentData.length)
      dialogRef.close()
    });
    // const oktaLoggedInUser = await this.oktaAuth.getUser();
    // this.loggedInUserEmail = oktaLoggedInUser.email || "No value"

  }


   getValidUsers() {
    let userData = this.userEmail.split(',');
    userData.push(this.loggedInUserEmail);
    userData = [...new Set(userData.filter(function (el) {
      return el != null;
    }))];

    const users: User[] = [];
    userData.forEach((email) => {
      users.push({email});
    });
    return users;
  }

  closePopUp(): void {
    this.dialog.closeAll()
  }

  get form(): { [key: string]: AbstractControl } {
    return this.createAssessmentForm.controls;
  }

  emailList: [];

  ngOnInit(): void {
    this.answerResponse1.subscribe(data => {
      if(data !== undefined) {
        this.assessment = data
        this.assessmentStatus = this.assessment.assessmentStatus
      }
    })
    this.createAssessmentForm = this.formBuilder.group(
      {
        assessmentNameValidator: ['', Validators.required],
        organizationNameValidator: ['', Validators.required],
        domainNameValidator: ['', Validators.required],
        industryValidator: ['', Validators.required],
        teamSizeValidator: ['', Validators.required],
        emailValidator: ['', Validators.pattern(/^\w+([-+.']\w+)*@thoughtworks.com(, ?\w+([-+.']\w+)*@thoughtworks.com)*$/)]
      }
    )

    // this.getAssessment()
  }


  private getAssessment() {
    this.appService.getAssessment(this.assessmentId).subscribe((_data) => {
        this.assessment = _data;
        this.setAssessment()
      }
    )
  };


  setAssessment() {
    this.assessmentName = this.assessment.assessmentName;
    this.organizationName = this.assessment.organisationName;
    this.domain = this.assessment.domain;
    this.industry = this.assessment.industry;
    this.teamSize = this.assessment.teamSize;
    this.UserEmails = this.assessment.users;
  }
}


