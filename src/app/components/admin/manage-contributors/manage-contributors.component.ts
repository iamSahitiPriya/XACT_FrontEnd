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
  private destroy$: Subject<void> = new Subject<void>();
  contributorCount = new EventEmitter();
  duplicate : boolean =false;


  @ViewChild("chipList1") chipList: any;
  authorFormControl = new FormControl(this.authors);
  contributorCtrl = new FormControl();
  reviewerFormControl = new FormControl(this.reviewers);
  contributors = new Map<string, ContributorStructure[]>();
  contributorFormControllers = [this.authorFormControl, this.reviewerFormControl];
  errorMessagePopUp = data_local.SHOW_ERROR_MESSAGE.POPUP_ERROR;
  isDuplicated: boolean = false;
  errorMessage: string;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private _snackBar: MatSnackBar, private formBuilder: UntypedFormBuilder, private appService: AppServiceService) {
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
    this.contributors.set('AUTHOR', this.authors);
    this.contributors.set('REVIEWER', this.reviewers);
  }

  addContributor(event: MatChipInputEvent, role: string) {
    let value = (event.value).trim().split(',');
    value = value.filter(ele => ele !== '')
    for (const eachEmail of value) {
      const authorIndex = this.authors.findIndex(author => author.userEmail ===eachEmail)
      const reviewerIndex = this.reviewers.findIndex(author => author.userEmail === eachEmail)
      if (eachEmail.length > 0 && eachEmail.search(this.emailPattern) !== -1) {
        const contributor: ContributorStructure = {
          userEmail: eachEmail,
          role: role
        }
        this.setCommonInvalid(authorIndex, reviewerIndex);
        if (!(authorIndex !== -1 || reviewerIndex !== -1)) {
          this.contributors.get(role)?.push(contributor);
          this.resetFormControl();
        }
      } else if (event.value.length > 0) {
        this.setEmailInvalid(role);
      }
    }
  }

  private setEmailInvalid(role: string) {
    if (role === 'AUTHOR') {
      this.authorFormControl.setErrors({'pattern': true})
    } else if (role === 'REVIEWER') {
      this.reviewerFormControl.setErrors({'pattern': true})
    }
  }

  private setCommonInvalid(authorIndex: number, reviewerIndex: number) {
    if(authorIndex !==-1){
      this.reviewerFormControl.setErrors({'invalid': true})
    }if(reviewerIndex !==-1){
      this.authorFormControl.setErrors({'invalid': true})
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

  private resetFormControl() {
    this.authorFormControl.setValue(this.authors)
    this.reviewerFormControl.setValue(this.reviewers)
    this.contributorCtrl.setValue(null)
  }

  showError(message: string) {
    this._snackBar.openFromComponent(NotificationSnackbarComponent, {
      data: {message, iconType: "error_outline", notificationType: "Error:"}, panelClass: ['error-snackBar'],
      duration: 2000,
      verticalPosition: "top",
      horizontalPosition: "center"
    })
  }

  onInputChange(text : string) {
    if(text.length === 0){
      this.resetFormControl()
    }
  }
}
