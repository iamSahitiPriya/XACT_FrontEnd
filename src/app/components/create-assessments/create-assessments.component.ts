import {Component, Inject, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {MatTable} from "@angular/material/table";
import {OKTA_AUTH} from "@okta/okta-angular";
import {OktaAuth} from "@okta/okta-auth-js";
import {FormControl, Validators} from "@angular/forms";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {Router} from "@angular/router";


export interface userStructure {
  name: string
}

export const user = [{}]
export const assessmentData = [{}]

@Component({
  selector: 'app-create-assessments',
  templateUrl: './create-assessments.component.html',
  styleUrls: ['./create-assessments.component.css']
})

export class CreateAssessmentsComponent {
  assessmentNameValidator = new FormControl('', [Validators.required]);
  organizationNameValidator = new FormControl('', [Validators.required]);
  domainNameValidator = new FormControl('', [Validators.required]);
  industryValidator = new FormControl('', [Validators.required]);
  teamSizeValidator = new FormControl('', [Validators.required]);

  columnName = ["name", "delete"]
  assessmentName: string = ''
  organizationName: string = ''
  domain: string = ''
  industry: string = ''
  teamSize: string = ''
  dataSource = [{}]
  username: string
  @ViewChild(MatTable) table: MatTable<userStructure>;

  constructor(private router: Router,public dialog: MatDialog, @Inject(OKTA_AUTH) public oktaAuth: OktaAuth,private appService:AppServiceService) {
  }

  openAssessment(content: any) {
    this.assessmentNameValidator.reset()
    this.organizationNameValidator.reset()
    this.industryValidator.reset()
    this.domainNameValidator.reset()
    this.teamSizeValidator.reset()
    this.assessmentName =""
    this.organizationName =""
    this.domain =""

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
  }

  closePopUp(): void {
    this.dialog.closeAll()
  }

  async addUser() {
    const email = document.getElementById("userEmail") as HTMLInputElement
    if (email.value !== "" && (await this.oktaAuth.getUser()).email === email.value) {
      this.username = (await this.oktaAuth.getUser()).name || "No value"
      const name = this.username.split(' ')
      user.push({"email": email.value, "firstName": name[0], "lastName": name[1], "role": "Owner"})
      this.dataSource.push({"name": this.username})
    }
    this.table.renderRows()
  }

  removeUser() {

  }

  getAssessments() {
    if (this.assessmentName !== '') {
      assessmentData.push({
        'assessmentName': this.assessmentName, "organisationName": this.organizationName,
        "domain": this.domain, "industry": this.industry, "teamSize": this.teamSize, "users": user})
      console.log(assessmentData)
    }
    this.appService.addAssessments(assessmentData).subscribe(data =>{
      console.log(data)
    })
    window.location.reload()
  }

}
