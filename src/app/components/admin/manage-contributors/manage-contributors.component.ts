import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {ContributorStructure} from "../../../types/Contributor/ContributorStructure";
import {MatChipInputEvent} from "@angular/material/chips";
import {FormControl, UntypedFormBuilder} from "@angular/forms";
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
  authors: ContributorStructure[] = []
  reviewers: ContributorStructure[] = []
  mandatoryFieldText = data_local.ASSESSMENT.MANDATORY_FIELD_TEXT;
  userEmailErrorMessage = data_local.ASSESSMENT.USER_EMAIL.ERROR_MESSAGE;

  @ViewChild("chipList1") chipList: any;
  authorFormControl = new FormControl(this.authors);
  contributorCtrl = new FormControl();
  reviewerFormControl = new FormControl(this.reviewers);
  contributors = new Map<string, ContributorStructure[]>();
  contributorFormControllers = [this.authorFormControl, this.reviewerFormControl];

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
    this.contributors.set('Author', this.authors);
    this.contributors.set('Reviewer', this.reviewers);
  }

  addContributor(event: MatChipInputEvent, role: string) {
    if (event.value.length > 0 && event.value.search(this.emailPattern) !== -1) {
      let contributor: ContributorStructure = {
        userEmail: event.value,
        role: role
      }
      this.contributors.get(role)?.push(contributor);
      this.resetFormControl();
    }
  }

  closeDialog() {
    this.dialog.closeAll()
  }

  removeContributor(userEmail: string, role: string): void {

    const index = this.contributors.get(role)?.findIndex(contributor => contributor.userEmail === userEmail);
    if (index !== undefined && index !== -1) {
      this.contributors.get(role)?.splice(index, 1);
    }
    this.resetFormControl();
  }

  private resetFormControl() {
    this.authorFormControl.setValue(this.authors)
    this.reviewerFormControl.setValue(this.reviewers)
    this.contributorCtrl.setValue(null)
  }

}
