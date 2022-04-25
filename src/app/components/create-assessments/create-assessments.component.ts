import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {MatTable} from "@angular/material/table";
import {OKTA_AUTH} from "@okta/okta-angular";
import {OktaAuth} from "@okta/okta-auth-js";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {Router} from "@angular/router";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';


export interface userStructure {
  name: string
}

export const user = [{
  "email": "", "firstName": "", "lastName": "", "role": ""
}]
export const assessmentData = [{}]

@Component({
  selector: 'app-create-assessments',
  templateUrl: './create-assessments.component.html',
  styleUrls: ['./create-assessments.component.css']
})

export class CreateAssessmentsComponent implements OnInit {
  createAssessmentForm: FormGroup
  columnName = ["name", "delete"]
  assessmentName: string = ''
  organizationName: string = ''
  domain: string = ''
  industry: string = ''
  teamSize: string = ''
  dataSource = [{
    name: "undefined"
  }]
  submitted: boolean = false;
  errorMsg: string = ''
  username: string
  @ViewChild(MatTable) table: MatTable<userStructure>;
  private isPresent: boolean = false;

  constructor(private router: Router, public dialog: MatDialog, @Inject(OKTA_AUTH) public oktaAuth: OktaAuth, private appService: AppServiceService,
              private formBuilder: FormBuilder) {
  }

  get f(): { [key: string]: AbstractControl } {
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
    this.teamSize = ""

    this.dataSource.splice(0, this.dataSource.length)
    assessmentData.splice(0, assessmentData.length)

    user.splice(0, user.length)

    const dialogRef = this.dialog.open(content, {
      width: '700px', height: '600px',
    })
    dialogRef.afterClosed().subscribe(result => {
      this.dataSource.splice(0, this.dataSource.length)
      assessmentData.splice(0, assessmentData.length)
      dialogRef.close()
    });
    this.username = (await this.oktaAuth.getUser()).name || "No value"
    const name = this.username.split(' ')
    user.push({
      "email": (await this.oktaAuth.getUser()).email || "No email",
      "firstName": name[0],
      "lastName": name[1],
      "role": "Owner"
    })
  }

  closePopUp(): void {
    this.dialog.closeAll()
  }

  async addUser() {
    const email = document.getElementById("userEmail") as HTMLInputElement
    if (email.value !== "" && (await this.oktaAuth.getUser()).email === email.value) {
      this.username = (await this.oktaAuth.getUser()).name || "No value"
      this.isPresent = this.dataSource.some(data => {
        if (data.name == this.username) {
          return false
        }
        return true
      })
      if (this.isPresent) {
        const name = this.username.split(' ')
        user.push({"email": email.value, "firstName": name[0], "lastName": name[1], "role": "Owner"})
        this.dataSource.push({"name": this.username})
      } else {
        this.errorMsg = "User already present."
      }
    }
    this.table.renderRows()
  }

  removeUser(userName: string) {
    this.dataSource = this.dataSource.filter((u) => u.name === userName);
    console.log(this.dataSource)
  }

  saveAssessment() {
    this.submitted = true;
    if (this.createAssessmentForm.valid) {
      const assessmentDataPayload = {
        'assessmentName': this.assessmentName, "organisationName": this.organizationName,
        "domain": this.domain, "industry": this.industry, "teamSize": this.teamSize, "users": user
      };
      this.appService.addAssessments(assessmentDataPayload).subscribe(data => {
        assessmentData.push(assessmentDataPayload);
        window.location.reload()
      })
    }
  }

}
