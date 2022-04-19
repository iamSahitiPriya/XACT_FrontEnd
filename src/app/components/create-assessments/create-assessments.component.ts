import {Component} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-create-assessments',
  templateUrl: './create-assessments.component.html',
  styleUrls: ['./create-assessments.component.css']
})
export class CreateAssessmentsComponent {
  animal: string;
  name: string;

  constructor(public dialog: MatDialog) {
  }
  openAssessment(content: any) {
    const dialogRef = this.dialog.open(content, {
      width: '700px',height:'600px',
    })
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }
  closePopUp(): void {
    this.dialog.closeAll();
  }

}
