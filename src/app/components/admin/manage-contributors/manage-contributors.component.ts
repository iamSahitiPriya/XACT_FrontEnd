import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {ContributorStructure} from "../../../types/Contributor/ContributorStructure";
import {MatChipInputEvent} from "@angular/material/chips";
import {FormControl, UntypedFormBuilder} from "@angular/forms";
import {data_local} from "../../../messages";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {Subject, takeUntil} from "rxjs";
import {NotificationSnackbarComponent} from "../../notification-component/notification-component.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ManageContributorRequest} from "../../../types/Contributor/ManageContributorRequest";

@Component({
  selector: 'app-manage-contributors',
  templateUrl: './manage-contributors.component.html',
  styleUrls: ['./manage-contributors.component.css']
})
export class ManageContributorsComponent implements OnInit, OnDestroy {
  addOnBlur: boolean = true;
  emailPattern = /^([_A-Za-z\d-+]+\.?[_A-Za-z\d-+]+@(thoughtworks.com),?)*$/;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  authors: ContributorStructure[] = []
  reviewers: ContributorStructure[] = []
  mandatoryFieldText = data_local.ASSESSMENT.MANDATORY_FIELD_TEXT;
  userEmailErrorMessage = data_local.ASSESSMENT.USER_EMAIL.ERROR_MESSAGE;
  userEmailPlaceholder = data_local.ASSESSMENT.USER_EMAIL.PLACEHOLDER;
  duplicateEmailErrorMessage = data_local.CONTRIBUTOR.duplicateErrorMessage;
  commonEmailErrorMessage = data_local.CONTRIBUTOR.commonErrorMessage;
  author = data_local.CONTRIBUTOR.ROLE.AUTHOR;
  reviewer = data_local.CONTRIBUTOR.ROLE.REVIEWER;
  private destroy$: Subject<void> = new Subject<void>();

  @ViewChild("chipList1") chipList: any;
  authorFormControl = new FormControl(this.authors);
  reviewerFormControl = new FormControl(this.reviewers);
  contributors = new Map<string, ContributorStructure[]>();
  contributorFormControllers = [this.authorFormControl, this.reviewerFormControl];
  authorEmail: string = ""
  reviewerEmail: string = ""
  ngModelValues = [this.authorEmail, this.reviewerEmail]
  errorMessagePopUp = data_local.SHOW_ERROR_MESSAGE.POPUP_ERROR;
  ManageContributors = data_local.CONTRIBUTOR.manageText;
  save: string = data_local.CONTRIBUTOR.SAVE;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private _snackBar: MatSnackBar, private formBuilder: UntypedFormBuilder, private appService: AppServiceService) {
  }

  ngOnInit(): void {
    this.formatResponse()
  }

  addContributor(event: MatChipInputEvent, role: string) {
    let emails = (event.value).trim().split(',');
    emails = emails.filter(email => email !== '')
    let invalidEmails: string[] = []
    for (const eachEmail of emails) {
      if (this.isAValidPattern(eachEmail)) {
        this.validateContributor(eachEmail, role, invalidEmails);
      } else {
        invalidEmails.push(eachEmail)
        this.setInvalidPatternError(role, invalidEmails);
      }
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
    this.resetFormControl(role);
  }


  saveContributors() {
    if (this.reviewerFormControl.valid && this.authorFormControl.valid) {
      const contributorRequest: ManageContributorRequest = {
        contributors: this.authors.concat(this.reviewers)
      };
      this.appService.saveContributors(contributorRequest, this.data.moduleId).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.closeDialog();
          window.location.reload()
        },
        error: _err => {
          this.showError(this.errorMessagePopUp);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  showError(message: string) {
    this._snackBar.openFromComponent(NotificationSnackbarComponent, {
      data: {message, iconType: "error_outline", notificationType: "Error:"}, panelClass: ['error-snackBar'],
      duration: 2000,
      verticalPosition: "top",
      horizontalPosition: "center"
    })
  }

  onInputChange(text: string, role: string) {
    if (text.length === 0) {
      this.resetFormControl(role)
    }
  }


  private isAValidPattern(email: string) {
    return email.length > 0 && email.search(this.emailPattern) !== -1;
  }


  private validateContributor(email: string, role: string, invalidEmail: string[]) {
    const authorIndex = this.authors.findIndex(author => author.userEmail === email)
    const reviewerIndex = this.reviewers.findIndex(reviewer => reviewer.userEmail === email)
    const contributor: ContributorStructure = {
      userEmail: email,
      role: role
    }
    if (this.isPresent(authorIndex) || this.isPresent(reviewerIndex)) {
      invalidEmail.push(email)
      this.setCommonEmailError(authorIndex, reviewerIndex, role);
    } else {
      this.addValidContributor(role, contributor);
    }
    this.resetNgModel(role, invalidEmail);

  }

  private addValidContributor(role: string, contributor: ContributorStructure) {
    this.contributors.get(role)?.unshift(contributor);
    this.resetFormControl(role);
  }

  private setInvalidPatternError(role: string, invalidEmail: string[]) {
    if (role === this.author) {
      this.authorFormControl.setErrors({'pattern': true})
    } else if (role === this.reviewer) {
      this.reviewerFormControl.setErrors({'pattern': true})
    }
    this.resetNgModel(role, invalidEmail)
  }

  private formatResponse() {
    if (this.data.contributors !== undefined) {
      this.data.contributors.forEach((eachContributor: ContributorStructure) => {
        if (eachContributor.role === this.author) {
          this.authors.push(eachContributor)
        } else if (eachContributor.role === this.reviewer) {
          this.reviewers.push(eachContributor)
        }
      })

    }
    this.contributors.set(this.author, this.authors);
    this.contributors.set(this.reviewer, this.reviewers);
  }

  private setCommonEmailError(authorIndex: number, reviewerIndex: number, role: string) {
    switch (role) {
      case(this.reviewer):
        this.set(authorIndex, reviewerIndex, this.reviewerFormControl);
        break;
      case(this.author):
        this.set(reviewerIndex, authorIndex, this.authorFormControl);
        break;
    }
  }

  private set(authorIndex: number, reviewerIndex: number, formControl: FormControl<ContributorStructure[] | null>) {
    if (this.isPresent(authorIndex)) {
      formControl.setErrors({'invalid': true})
    } else if (this.isPresent(reviewerIndex)) {
      formControl.setErrors({'duplicate': true});
    }
  }

  private isPresent(index: number) {
    return index !== -1;
  }

  private resetFormControl(role: string) {
    switch (role) {
      case this.author:
        this.authorFormControl.setValue(this.authors)
        break;
      case this.reviewer:
        this.reviewerFormControl.setValue(this.reviewers)
        break;
    }
  }

  private resetNgModel(role: string, invalidEmail: string[]) {
    switch (role) {
      case this.author:
        this.ngModelValues[0] = invalidEmail.join(',')
        break;
      case this.reviewer:
        this.ngModelValues[1] = invalidEmail.join(',')
        break;
    }
  }
}
