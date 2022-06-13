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

  @Input()
  assessmentStatus: string

  @Output() statusEvent = new EventEmitter<string>();


  sendStatus() {
    this.statusEvent.emit(this.assessmentStatus)
  }

  constructor(private appService: AppServiceService, private dialog: MatDialog, @Inject(OKTA_AUTH) public oktaAuth: OktaAuth, private errorDisplay: MatSnackBar, private formBuilder: FormBuilder) {
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


  async openAssessment(content: any) {
    assessmentData.splice(0, assessmentData.length)

    const dialogRef = this.dialog.open(content, {
      width: '630px', height: '650px',
    })
    dialogRef.afterClosed().subscribe(_result => {
      assessmentData.splice(0, assessmentData.length)
      dialogRef.close()
    });
  }


  private getValidUsers() {
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

    this.emailList = [];

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

    this.getAssessment()
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


