import {Component, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatTable} from "@angular/material/table";


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
  @ViewChild(MatTable) table: MatTable<userStructure>;
  constructor(public dialog: MatDialog) {
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

  addUser() {
    const value = document.getElementById("userEmail") as HTMLInputElement
    if(value.value !== ""){this.dataSource.push({"name":value.value})
      }
    this.table.renderRows()
  }

  removeUser() {

  }

  getAssessments() {

  }
}
