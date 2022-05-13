import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {OKTA_AUTH} from "@okta/okta-angular";
import {OktaAuth} from "@okta/okta-auth-js";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {Router} from "@angular/router";
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AssessmentRequest} from "../../types/assessmentRequest";
import {MatSnackBar} from "@angular/material/snack-bar";
import {User} from "../../types/user";

export const assessmentData = [{}]

@Component({
  selector: 'app-create-assessments',
  templateUrl: './create-assessments.component.html',
  styleUrls: ['./create-assessments.component.css']
})

export class CreateAssessmentsComponent implements OnInit {
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
  userEmails: string = '';

  constructor(private router: Router, public dialog: MatDialog, @Inject(OKTA_AUTH) public oktaAuth: OktaAuth, private appService: AppServiceService,
              private formBuilder: FormBuilder, private errorDisplay: MatSnackBar) {
  }

  get form(): { [key: string]: AbstractControl } {
    return this.createAssessmentForm.controls;
  }

  emailList: string [];

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
  }

  async openAssessment(content: any) {
    this.createAssessmentForm.reset()
    this.assessmentName = ""
    this.organizationName = ""
    this.domain = ""
    this.industry = ""

    assessmentData.splice(0, assessmentData.length)

    const dialogRef = this.dialog.open(content, {
      width: '630px', height: '650px',
    })
    dialogRef.afterClosed().subscribe(_result => {
      assessmentData.splice(0, assessmentData.length)
      dialogRef.close()
    });
    const oktaLoggedInUser = await this.oktaAuth.getUser();
    this.loggedInUserEmail = oktaLoggedInUser.email || "No value"
  }

  closePopUp(): void {
    this.dialog.closeAll()
  }

  saveAssessment() {
    this.submitted = true;
    const users = this.getValidUsers();

    if (this.createAssessmentForm.valid) {
      this.loading = true
      const assessmentRequest: AssessmentRequest = {
        assessmentName: this.assessmentName, organisationName: this.organizationName,
        domain: this.domain, industry: this.industry, teamSize: this.teamSize, users: users
      };
      this.appService.addAssessments(assessmentRequest).subscribe((_data) => {
          assessmentData.push(assessmentRequest);
          window.location.reload()
        },
        (_error) => {
          this.loading = false
          this.errorDisplay.open("Error in server. Please try again after sometime.", "", {
            duration: 4000,
            horizontalPosition: "center",
            verticalPosition: "bottom",
            panelClass: ['error-snackBar']
          })
        })
    }
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
}
