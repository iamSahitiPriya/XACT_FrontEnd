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
import cloneDeep from "lodash/cloneDeep";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import { MatChipInputEvent } from '@angular/material/chips';

export interface Email{
  name : string;
}

@Component({
  selector: 'app-create-assessments',
  templateUrl: './create-assessments.component.html',
  styleUrls: ['./create-assessments.component.css']
})

export class CreateAssessmentsComponent implements OnInit {
  createAssessmentForm: FormGroup;
  columnName = ["name", "delete"];
  loggedInUserEmail: string;
  loading: boolean;
  userEmails: string = '';

  addOnBlur = true;
  readonly separatorKeysCodes =[ENTER , COMMA] as const;
  emails : Email[]=[];

  @Input()
  assessment: AssessmentStructure;
  assessmentCopy: AssessmentStructure;


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
        emailValidator: ['', Validators.pattern(/^\w+([-+.']\w+)*@thoughtworks.com*$/)]
      }
    )
    this.loggedInUserEmail = (await this.oktaAuth.getUser()).email || "";
    if(this.assessment.users !== undefined) {
      this.userEmails = this.assessment.users.join(",");
      this.assessmentCopy = cloneDeep(this.assessment);
    }
  }

  saveAssessment() {
    if (this.createAssessmentForm.valid) {
      const users = this.getValidUsers();
      this.assessment.users = this.getUsersStructure(users);
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
    } else
      this.showFormError();
  }

  private showError() {
    this.errorDisplay.open("Server error. Please try again after sometime.", "", {
      duration: 3000,
      horizontalPosition: "center",
      verticalPosition: "top",
      panelClass: ['error-snackBar']
    })
  }

  private showFormError() {
    this.errorDisplay.open("Please fill in all the required fields correctly.", "", {
      duration: 2000,
      horizontalPosition: "center",
      verticalPosition: "top",
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
      if (email && email.length > 0)
        users.push({email});
    });
    return users;
  }

  updateAssessment() {
    if (this.createAssessmentForm.valid) {
      const users = this.getValidUsers();
      this.assessment.users = this.getUsersStructure(users);
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
    } else
      this.showFormError();
  }

  private closePopUp() {
    this.dialog.closeAll();
  }

  close() {
    this.resetAssessment();
    this.closePopUp();
  }

  resetAssessment() {
    if (this.assessment && this.assessmentCopy) {
      this.assessment.assessmentName = this.assessmentCopy.assessmentName;
      this.assessment.domain = this.assessmentCopy.domain;
      this.assessment.industry = this.assessmentCopy.industry;
      this.assessment.teamSize = this.assessmentCopy.teamSize;
      this.assessment.organisationName = this.assessmentCopy.organisationName;
      this.userEmails = this.assessmentCopy.users.join(",");
    }
  }

  getUsersStructure(users: User[]) {
    const userStructure: string[] = [];
    users.forEach((user) => {
      if (user.email !== this.loggedInUserEmail)
        userStructure.push(user.email);
    });
    return userStructure;
  }


  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.emails.push({ name: value });
    }
    event.chipInput!.clear();
  }

  remove(email : Email): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }

}
