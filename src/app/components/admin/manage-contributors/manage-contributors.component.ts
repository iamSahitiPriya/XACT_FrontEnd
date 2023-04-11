import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {ModuleData} from "../../../types/moduleData";
import {ContributorStructure} from "../../../types/Contributor/ContributorStructure";


@Component({
  selector: 'app-manage-contributors',
  templateUrl: './manage-contributors.component.html',
  styleUrls: ['./manage-contributors.component.css']
})
export class ManageContributorsComponent implements OnInit {
  addOnBlur: boolean = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  emailTextField: string;
  authors:ContributorStructure[] = []
  reviewers:ContributorStructure[] = []
  reviewerText: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.formatData()
  }

  private formatData() {
    if(this.data.contributors !== undefined) {
      this.data.contributors.forEach((eachContributor: ContributorStructure) => {
        if (eachContributor.role === 'AUTHOR') {
          this.authors.push(eachContributor)
        } else if (eachContributor.role === 'REVIEWER') {
          this.reviewers.push(eachContributor)
        }
      })
    }

  }
}
