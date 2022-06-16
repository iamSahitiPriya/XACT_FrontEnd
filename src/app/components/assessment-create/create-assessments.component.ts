/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Inject, Input, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {OKTA_AUTH} from "@okta/okta-angular";
import {OktaAuth} from "@okta/okta-auth-js";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {Router} from "@angular/router";
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AssessmentRequest} from "../../types/assessmentRequest";
import {MatSnackBar} from "@angular/material/snack-bar";
import {User} from "../../types/user";
import {AssessmentStructure} from "../../types/assessmentStructure";

@Component({
  selector: 'app-create-assessments',
  templateUrl: './create-assessments.component.html',
  styleUrls: ['./create-assessments.component.css']
})

export class CreateAssessmentsComponent implements OnInit {
  createAssessmentForm: FormGroup;
  columnName = ["name", "delete"];
  submitted: boolean = false;
  loggedInUserEmail: string;
  loading: boolean;
  userEmails: string = '';

  @Input()
  assessment: AssessmentStructure;


  constructor(private router: Router, public dialog: MatDialog, @Inject(OKTA_AUTH) public oktaAuth: OktaAuth, private appService: AppServiceService,
              private formBuilder: FormBuilder, private errorDisplay: MatSnackBar) {
  }

  get form(): { [key: string]: AbstractControl } {
    return this.createAssessmentForm.controls;
  }

  async ngOnInit(): Promise<void> {

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
    this.loggedInUserEmail = (await this.oktaAuth.getUser()).email || "";
    this.userEmails = this.assessment.users.join(",");
  }

  saveAssessment() {
    this.submitted = true;
    const users = this.getValidUsers();

    if (this.createAssessmentForm.valid) {
      this.loading = true
      const assessmentRequest: AssessmentRequest = {
        assessmentName: this.assessment.assessmentName,
        organisationName: this.assessment.organisationName,
        domain: this.assessment.domain,
        industry: this.assessment.industry,
        teamSize: this.assessment.teamSize,
        users: users
      };
      this.appService.addAssessments(assessmentRequest).subscribe({
        next: (_data) => {
          this.loading = false
          window.location.reload()
        },
        error: (_error) => {
          this.loading = false
          this.showError();
        }
      })
    }
  }

  private showError() {
    this.errorDisplay.open("Error in server. Please try again after sometime.", "", {
      duration: 4000,
      horizontalPosition: "center",
      verticalPosition: "bottom",
      panelClass: ['error-snackBar']
    })
  }

  private getValidUsers() {
    let userData = this.userEmails.split(',');
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

  updateAssessment() {
    this.submitted = true;
    const users = this.getValidUsers();

    if (this.createAssessmentForm.valid) {
      this.loading = true
      const assessmentRequest: AssessmentRequest = {
        assessmentName: this.assessment.assessmentName,
        organisationName: this.assessment.organisationName,
        domain: this.assessment.domain,
        industry: this.assessment.industry,
        teamSize: this.assessment.teamSize,
        users: users
      };
      this.appService.updateAssessment(this.assessment.assessmentId, assessmentRequest).subscribe({
        next: (_data) => {
          this.loading = false
          this.closePopUp();
        },
        error: (_error) => {
          this.loading = false
          this.showError();
        }
      })
    }
  }

  closePopUp() {
    this.dialog.closeAll();
  }
}
