import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {ContributorStructure} from "../../../types/Contributor/ContributorStructure";
import {MatChipInputEvent} from "@angular/material/chips";
import {AbstractControl, FormControl, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {log} from "util";
import {data_local} from "../../../messages";


@Component({
  selector: 'app-manage-contributors',
  templateUrl: './manage-contributors.component.html',
  styleUrls: ['./manage-contributors.component.css']
})
export class ManageContributorsComponent implements OnInit {
  addOnBlur: boolean = true;
  emailPattern = /^([_A-Za-z\d-+]+\.?[_A-Za-z\d-+]+@(thoughtworks.com),?)*$/;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  emailTextField: string;
  authors: ContributorStructure[] = []
  reviewers: ContributorStructure[] = []
  reviewerText: string;
  mandatoryFieldText = data_local.ASSESSMENT.MANDATORY_FIELD_TEXT;
  userEmailErrorMessage = data_local.ASSESSMENT.USER_EMAIL.ERROR_MESSAGE;



  @ViewChild("chipList1") chipList: any;
  authorFormControl = new FormControl(this.authors);
  contributorCtrl = new FormControl();
  reviewerFormControl = new FormControl(this.reviewers);


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private formBuilder: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    this.formatData()
  }

  private formatData() {
    if (this.data.contributors !== undefined) {
      this.data.contributors.forEach((eachContributor: ContributorStructure) => {
        if (eachContributor.role === 'AUTHOR') {
          this.authors.push(eachContributor)
        } else if (eachContributor.role === 'REVIEWER') {
          this.reviewers.push(eachContributor)
        }
      })
    }
  }

  addContributor(event: MatChipInputEvent, role: string) {
    if (event.value.length > 0 && event.value.search(this.emailPattern) !== -1) {
      let contributor: ContributorStructure = {
        userEmail: event.value,
        role: role
      }
      if (contributor.role === 'AUTHOR') {
        this.emailTextField = ""
        this.authors.push(contributor)
        this.authorFormControl.setValue(this.authors)
        this.contributorCtrl.setValue(null)
      } else if (contributor.role === 'REVIEWER') {
        this.reviewerText = ""
        this.reviewers.push(contributor)
        this.reviewerFormControl.setValue(this.reviewers)
        this.contributorCtrl.setValue(null)
      }
    }
  }

  closeDialog() {
    this.dialog.closeAll()
  }
}
