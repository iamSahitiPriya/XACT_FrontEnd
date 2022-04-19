import {Component, Inject, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatTable} from "@angular/material/table";
import {OKTA_AUTH} from "@okta/okta-angular";
import {OktaAuth, UserClaims} from "@okta/okta-auth-js";


export interface userStructure{
  name:string
}

@Component({
  selector: 'app-create-assessments',
  templateUrl: './create-assessments.component.html',
  styleUrls: ['./create-assessments.component.css']
})

export class CreateAssessmentsComponent {
  columnName = ["name","delete"]
  dataSource = [{}]
  username:string
  @ViewChild(MatTable) table: MatTable<userStructure>;
  constructor(public dialog: MatDialog,@Inject(OKTA_AUTH) public oktaAuth: OktaAuth) {
  }

  openAssessment(content: any) {
    this.dataSource.splice(0,this.dataSource.length)
    const dialogRef = this.dialog.open(content, {
      width: '700px', height: '600px',
    })
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  closePopUp(): void {
    this.dialog.closeAll();
  }

  async addUser() {
    const email = document.getElementById("userEmail") as HTMLInputElement
    if (email.value !== "" && (await this.oktaAuth.getUser()).email === email.value) {
      this.username = (await this.oktaAuth.getUser()).name || "No value"
      console.log(this.username)
      this.dataSource.push({"name": this.username})
    }
    this.table.renderRows()
  }

  removeUser() {

  }

  getAssessments() {

  }
}
