import {Component, EventEmitter, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
  duplicateEmailErrorMessage =data_local.CONTRIBUTOR.duplicateErrorMessage;
  commonEmailErrorMessage =data_local.CONTRIBUTOR.commonErrorMessage;
  private destroy$: Subject<void> = new Subject<void>();


  @ViewChild("chipList1") chipList: any;
  authorFormControl = new FormControl(this.authors);
  reviewerFormControl = new FormControl(this.reviewers);
  contributors = new Map<string, ContributorStructure[]>();
  contributorFormControllers = [this.authorFormControl, this.reviewerFormControl];
  authorEmail: string = ""
  reviewerEmail: string = ""
  ngModelArray = [this.authorEmail, this.reviewerEmail]
  errorMessagePopUp = data_local.SHOW_ERROR_MESSAGE.POPUP_ERROR;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private _snackBar: MatSnackBar, private formBuilder: UntypedFormBuilder, private appService: AppServiceService) {
  }

  ngOnInit(): void {
    this.formatResponse()
  }

  addContributor(event: MatChipInputEvent, role: string) {
    let emails = (event.value).trim().split(',');
    emails = emails.filter(ele => ele !== '')
    let invalidEmails: string[] = []
    for (const eachEmail of emails) {
      if (this.isValid(eachEmail)) {
        this.validateAndAddContributor(eachEmail, role, invalidEmails);
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


  private isValid(email: string) {
    return email.length > 0 && email.search(this.emailPattern) !== -1;
  }


  private validateAndAddContributor(email: string, role: string, invalidEmail: string[]) {
    const authorIndex = this.authors.findIndex(author => author.userEmail === email)
    const reviewerIndex = this.reviewers.findIndex(author => author.userEmail === email)
    const contributor: ContributorStructure = {
      userEmail: email,
      role: role
    }
    if (authorIndex !== -1 || reviewerIndex !== -1) {
      invalidEmail.push(email)
      this.setCommonEmailError(authorIndex, reviewerIndex, role);
    } else {
      this.contributors.get(role)?.push(contributor);
      this.resetFormControl(role);
    }
    this.resetNgModel(role, invalidEmail);

  }

  private setInvalidPatternError(role: string, invalidEmail: string[]) {
    if (role === 'AUTHOR') {
      this.authorFormControl.setErrors({'pattern': true})
    } else if (role === 'REVIEWER') {
      this.reviewerFormControl.setErrors({'pattern': true})
    }
    this.resetNgModel(role, invalidEmail)
  }

  private formatResponse() {
    if (this.data.contributors !== undefined) {
      this.data.contributors.forEach((eachContributor: ContributorStructure) => {
        if (eachContributor.role === 'AUTHOR') {
          this.authors.push(eachContributor)
        } else if (eachContributor.role === 'REVIEWER') {
          this.reviewers.push(eachContributor)
        }
      })

    }
    this.contributors.set('AUTHOR', this.authors);
    this.contributors.set('REVIEWER', this.reviewers);
  }

  private setCommonEmailError(authorIndex: number, reviewerIndex: number, role: string) {
    if (authorIndex !== -1 && role === 'REVIEWER') {
      this.reviewerFormControl.setErrors({'invalid': true})
    } else if (reviewerIndex !== -1 && role === 'AUTHOR') {
      this.authorFormControl.setErrors({'invalid': true})
    } else if (authorIndex !== -1 && role === 'AUTHOR') {
      this.authorFormControl.setErrors({'duplicate': true})
    } else if (reviewerIndex !== -1 && role === 'REVIEWER') {
      this.reviewerFormControl.setErrors({'duplicate': true})
    }
  }

  private resetFormControl(role: string) {
    switch (role) {
      case 'AUTHOR':
        this.authorFormControl.setValue(this.authors)
        break;
      case 'REVIEWER':
        this.reviewerFormControl.setValue(this.reviewers)
        break;
    }
  }

  private resetNgModel(role: string, invalidEmail: string[]) {
    switch (role) {
      case 'AUTHOR':
        this.ngModelArray[0] = invalidEmail.join(',')
        break;
      case 'REVIEWER':
        this.ngModelArray[1] = invalidEmail.join(',')
        break;
    }
  }
}
