import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {MatTable} from "@angular/material/table";
import {OKTA_AUTH} from "@okta/okta-angular";
import {OktaAuth} from "@okta/okta-auth-js";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {Router} from "@angular/router";
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from "../../types/user";
import {AssessmentRequest} from "../../types/assessmentRequest";
import * as _ from "lodash";

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
  dataSource: User[] = [];
  submitted: boolean = false;
  errorMsg: string = '';
  loggedInUser: User;
  @ViewChild(MatTable) table: MatTable<User>;
  loading: boolean;

  constructor(private router: Router, public dialog: MatDialog, @Inject(OKTA_AUTH) public oktaAuth: OktaAuth, private appService: AppServiceService,
              private formBuilder: FormBuilder) {
  }

  get form(): { [key: string]: AbstractControl } {
    return this.createAssessmentForm.controls;
  }

  ngOnInit(): void {
    this.createAssessmentForm = this.formBuilder.group(
      {
        assessmentNameValidator: ['', Validators.required],
        organizationNameValidator: ['', Validators.required],
        domainNameValidator: ['', Validators.required],
        industryValidator: ['', Validators.required],
        teamSizeValidator: ['', Validators.required]
      }
    )
  }

  async openAssessment(content: any) {
    this.createAssessmentForm.reset()
    this.assessmentName = ""
    this.organizationName = ""
    this.domain = ""
    this.industry = ""

    this.dataSource.splice(0, this.dataSource.length)
    assessmentData.splice(0, assessmentData.length)

    const dialogRef = this.dialog.open(content, {
      width: '630px', height: '650px',
    })
    dialogRef.afterClosed().subscribe(result => {
      this.dataSource.splice(0, this.dataSource.length)
      assessmentData.splice(0, assessmentData.length)
      dialogRef.close()
    });
    const oktalLoggedInUser = await this.oktaAuth.getUser();
    const username: string = oktalLoggedInUser.name || "No value"
    const loggedInUserEmail: string = oktalLoggedInUser.email || "No value"
    const name: string[] = username.split(' ')
    this.loggedInUser = {email: loggedInUserEmail, firstName: name[0], lastName: name[1], role: "Owner"}
  }

  closePopUp(): void {
    this.dialog.closeAll()
  }

  async addUser(email: string) {
    if (!(this.dataSource.some(e => e.email === email) || this.loggedInUser.email === email)) {
      this.appService.getUserByEmail(email).subscribe(
        (response) => {
          this.dataSource.push(response);
          this.table.renderRows()
        }
      )
      console.log(this.dataSource)
    }
  }

  removeUser(user: User) {
    this.dataSource = this.dataSource.filter((u) => u.email !== user.email);
  }

  saveAssessment() {
    this.submitted = true;
    const userData = _.cloneDeep(this.dataSource);
    userData.push(this.loggedInUser);
    if (this.createAssessmentForm.valid) {
      this.loading = true
      const assessmentRequest: AssessmentRequest = {
        assessmentName: this.assessmentName, organisationName: this.organizationName,
        domain: this.domain, industry: this.industry, teamSize: this.teamSize, users: userData
      };
      this.appService.addAssessments(assessmentRequest).subscribe(data => {
        assessmentData.push(assessmentRequest);
        window.location.reload()
      })
    }
  }

}
