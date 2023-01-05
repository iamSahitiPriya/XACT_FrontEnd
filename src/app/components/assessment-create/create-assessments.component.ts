/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {OKTA_AUTH} from "@okta/okta-angular";
import {OktaAuth} from "@okta/okta-auth-js";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {Router} from "@angular/router";
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {AssessmentRequest} from "../../types/assessmentRequest";
import {MatSnackBar} from "@angular/material/snack-bar";
import {User} from "../../types/user";
import {AssessmentStructure} from "../../types/assessmentStructure";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from '@angular/material/chips';
import {data_local} from "../../messages";
import {map, Observable, startWith, Subject, takeUntil} from "rxjs";
import {Responses} from 'src/app/types/Responses';
import {OrganisationResponse} from "../../types/OrganisationResponse";
import {NotificationSnackbarComponent} from "../notification-component/notification-component.component";


@Component({
  selector: 'app-create-assessments',
  templateUrl: './create-assessments.component.html',
  styleUrls: ['./create-assessments.component.css']
})

export class CreateAssessmentsComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  private MAX_USERS: Number = 15;
  createAssessmentForm: UntypedFormGroup;
  columnName = ["name", "delete"];
  loggedInUserEmail: string;
  orgListLoader: boolean = false;
  loading: boolean;
  re = /^([_A-Za-z\d-+]+\.?[_A-Za-z\d-+]+@(thoughtworks.com),?)*$/;
  emailTextField: string;
  selected = new UntypedFormControl('valid', [Validators.required, Validators.pattern('valid')]);

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  emails: string[] = [];
  createAssessmentTitle = data_local.ASSESSMENT.CREATE.TITLE;
  manageAssessmentTitle = data_local.ASSESSMENT.MANAGE.TITLE;
  closeToolTip = data_local.ASSESSMENT.CLOSE.TOOLTIP_MESSAGE;
  assessmentNameTitle = data_local.ASSESSMENT.ASSESSMENT_NAME.TITLE;
  purposeOfAssessmentTitle = data_local.ASSESSMENT.ASSESSMENT_NAME.PURPOSE.TITLE;
  assessmentNamePlaceholder = data_local.ASSESSMENT.ASSESSMENT_NAME.PLACEHOLDER;
  mandatoryFieldText = data_local.ASSESSMENT.MANDATORY_FIELD_TEXT;
  organisationValidationText = data_local.ASSESSMENT.ORGANISATION_VALIDATOR_MESSAGE;
  commonErrorFieldText = data_local.ASSESSMENT.ERROR_MESSAGE_TEXT;
  assessmentDomainTitle = data_local.ASSESSMENT.ASSESSMENT_DOMAIN.TITLE;
  assessmentDomainPlaceholder = data_local.ASSESSMENT.ASSESSMENT_DOMAIN.PLACEHOLDER;
  assessmentTeamTitle = data_local.ASSESSMENT.ASSESSMENT_TEAM.TITLE;
  assessmentTeamPlaceholder = data_local.ASSESSMENT.ASSESSMENT_TEAM.PLACEHOLDER;
  mandatoryNumberField = data_local.ASSESSMENT.ASSESSMENT_TEAM.MANDATORY_FIELD_NUMBER;
  numberErrorField = data_local.ASSESSMENT.ASSESSMENT_TEAM.ERROR_MESSAGE_NUMBER;
  organisationNameTitle = data_local.ASSESSMENT.ORGANISATION_NAME.TITLE;
  organisationNamePlaceholder = data_local.ASSESSMENT.ORGANISATION_NAME.PLACEHOLDER;
  organisationIndustryTitle = data_local.ASSESSMENT.ORGANISATION_INDUSTRY.TITLE;
  organisationIndustryPlaceholder = data_local.ASSESSMENT.ORGANISATION_INDUSTRY.PLACEHOLDER;
  addAssessmentUsers = data_local.ASSESSMENT.ADD_ASSESSMENT_USERS;
  userEmailTitle = data_local.ASSESSMENT.USER_EMAIL.TITLE;
  userEmailPlaceholder = data_local.ASSESSMENT.USER_EMAIL.PLACEHOLDER;
  userEmailErrorMessage = data_local.ASSESSMENT.USER_EMAIL.ERROR_MESSAGE;
  createAssessmentToolTip = data_local.ASSESSMENT.CREATE.TOOLTIP;
  createAssessmentButtonText = data_local.ASSESSMENT.CREATE.BUTTON_TEXT;
  manageAssessmentToolTip = data_local.ASSESSMENT.MANAGE.TOOLTIP;
  manageAssessmentButtonText = data_local.ASSESSMENT.MANAGE.BUTTON_TEXT;
  purposeOfAssessment = [{
    value: 'Internal Assessment'
  }, {value: 'Client Assessment'}, {value: 'Just Exploring'}]


  options: Responses = {accounts: [{name: "", industry: ""}]};


  filteredOptions: Observable<string[]>;
  result: OrganisationResponse[];
  previousOrgPattern = "$";
  accounts: string[];

  @Input()
  assessment: AssessmentStructure;
  assessmentCopy: AssessmentStructure;


  constructor(private router: Router, public dialog: MatDialog, @Inject(OKTA_AUTH) public oktaAuth: OktaAuth, private appService: AppServiceService,
              private formBuilder: UntypedFormBuilder, private _snackBar: MatSnackBar) {
  }

  get form(): { [key: string]: AbstractControl } {
    return this.createAssessmentForm.controls;
  }

  public OrganizationNameValidation = {
    'myControl': [
      {type: 'invalidAutocompleteString', message: this.organisationValidationText},
      {type: 'required', message: this.mandatoryFieldText}
    ]
  }

  async ngOnInit(): Promise<void> {
    this.createAssessmentForm = this.formBuilder.group(
      {
        selected: ['', Validators.required],
        assessmentNameValidator: ['', Validators.required],
        organizationNameValidator: ['', Validators.required],
        domainNameValidator: ['', Validators.required],
        industryValidator: ['', Validators.required],
        teamSizeValidator: ['', Validators.required],
        emailValidator: ['', Validators.pattern(this.re)],
      }
    )
    this.createAssessmentForm.controls['selected'].setValue(this.assessment.assessmentPurpose)
    this.loggedInUserEmail = (await this.oktaAuth.getUser()).email || "";
    this.assessmentCopy = Object.assign({}, this.assessment)
    if (this.assessment.users !== undefined) {
      this.emails = this.assessment.users;
      this.assessmentCopy = Object.assign({}, this.assessment)
    }

  }

  saveAssessment() {
    if (this.createAssessmentForm.valid) {
      const assessmentRequest = this.getAssessmentRequest()
      this.appService.addAssessments(assessmentRequest).pipe(takeUntil(this.destroy$)).subscribe({
        next: (_data) => {
          this.loading = false
          window.location.reload()
        },
        error: (_error) => {
          this.loading = false
          this.showError("Server Error.");
        }
      })
    } else {
      this.showError("Please fill in all the required fields correctly.");
    }
  }

  showError(message: string) {
    this._snackBar.openFromComponent(NotificationSnackbarComponent, {
      data: {message: message, iconType: "error_outline", notificationType: "Error:"}, panelClass: ['error-snackBar'],
      duration: 2000,
      verticalPosition: "top",
      horizontalPosition: "center"
    })
  }


  private getValidUsers() {
    let userData = [];
    this.emails.forEach((email) => {
      userData.push(email)
    });
    userData.push(this.loggedInUserEmail);
    userData = [...new Set(userData.filter(function (el) {
      return el != null;
    }))]

    const users: User[] = [];
    userData.forEach((email) => {
      if (email)
        users.push({email})
    });

    return users;

  }

  updateAssessment() {
    if (this.createAssessmentForm.valid) {
      const assessmentRequest = this.getAssessmentRequest();
      this.appService.updateAssessment(this.assessment.assessmentId, assessmentRequest).pipe(takeUntil(this.destroy$)).subscribe({
        next: (_data) => {
          this.loading = false
          this.closePopUp();
        },
        error: (_error) => {
          this.loading = false
          this.showError("Server error.");
        }
      })
    } else {
      this.showError("Please fill in all the required fields correctly ");
    }
  }

  private getAssessmentRequest() {
    const users = this.getValidUsers();
    this.assessment.users = this.getUsersStructure(users);
    this.loading = true
    const assessmentRequest: AssessmentRequest = {
      assessmentName: this.assessment.assessmentName,
      organisationName: this.assessment.organisationName,
      assessmentPurpose: this.assessment.assessmentPurpose,
      domain: this.assessment.domain,
      industry: this.assessment.industry,
      teamSize: this.assessment.teamSize,
      users: users
    };
    return assessmentRequest;
  }

  private closePopUp() {
    this.dialog.closeAll();
  }

  close() {
    this.resetAssessment();
    this.closePopUp();
  }

  resetAssessment() {
    this.assessment.industry = this.assessmentCopy.industry;
    this.assessment.assessmentPurpose = this.assessmentCopy.assessmentPurpose;
    this.assessment.assessmentName = this.assessmentCopy.assessmentName;
    this.assessment.domain = this.assessmentCopy.domain;
    this.assessment.industry = this.assessmentCopy.industry;
    this.assessment.teamSize = this.assessmentCopy.teamSize;
    this.assessment.organisationName = this.assessmentCopy.organisationName;
    this.assessment.users = this.assessmentCopy.users;


  }

  getUsersStructure(users: User[]) {
    const userStructure: string[] = [];
    users.forEach((user) => {
      if (user.email !== this.loggedInUserEmail)
        userStructure.push(user.email);
    });
    return userStructure;
  }


  add(event: MatChipInputEvent): void {
    const invalidEmails: string[] = [];
    let value = (event.value).trim().split(',');
    value = value.filter(ele => ele !== '')
    for (const eachEmail in value) {
      if (!this.emails.includes(value[eachEmail]) && value[eachEmail].search(this.re) != -1) {
        if (this.emails.length >= this.MAX_USERS) {
          this.showError(data_local.ASSESSMENT.USER_EMAIL.LIMIT_REACHED + this.MAX_USERS);
        } else
          this.emails.push(value[eachEmail]);
      } else {
        invalidEmails.push(value[eachEmail]);
      }
    }
    this.emailTextField = invalidEmails.join(",");

  }

  remove(email: string): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  purposeChange(option: string) {
    this.assessment.assessmentPurpose = option;
  }

  onOrganisationValueChange() {
    if (this.assessment.organisationName.length >= 2 && !(this.assessment.organisationName.includes(this.previousOrgPattern))) {
      this.previousOrgPattern = this.assessment.organisationName;
      this.orgListLoader = true;
      this.appService.getOrganizationName(this.assessment.organisationName).pipe(takeUntil(this.destroy$)).subscribe({
        next: (_data) => {
          this.options.accounts = _data;
          this.filterOptions();
          this.orgListLoader = false;
        }
      })
    } else if (this.assessment.organisationName.length < 2) {
      this.previousOrgPattern = "$"
      this.accounts = [];
      this.options.accounts = [];
      this.filterOptions();
      this.createAssessmentForm.controls['organizationNameValidator'].setValidators(this.autocompleteStringValidator(this.options.accounts))
    }
  }


  filterOptions() {
    this.createAssessmentForm.controls['organizationNameValidator'].setValidators(this.autocompleteStringValidator(this.options.accounts))
    this.filteredOptions = this.createAssessmentForm.controls['organizationNameValidator'].valueChanges.pipe(
      startWith(''),
      map(_value => this.filterOrganisationName(this.assessment.organisationName || ''))
    );
  }

  filterOrganisationName(value: string): string[] {
    const filterValue = value.toLowerCase();
    this.accounts = [];
    if (this.options.accounts !== undefined) {
      this.options.accounts.forEach(account => {
        this.accounts.push(account.name)
      })
      this.accounts = this.accounts.filter(option => option.toLowerCase().includes(filterValue));
      if (this.accounts.length === 0 && this.assessment.organisationName.length >= 2) {
        this.accounts = [this.organisationValidationText]
      }
    }
    return this.accounts;
  }

  autocompleteStringValidator(validOptions: OrganisationResponse[]): ValidatorFn {
    let flag: boolean = false;
    return (control: AbstractControl): { [key: string]: any } | null => {
      validOptions.forEach(account => {
        if (account.name == control.value) {
          flag = true
        }
      })
      return flag ? null : {'invalidAutocompleteString': {value: control.value}}
    }
  }

  selectOrganisationName(organisationName: string) {
    this.options.accounts.forEach(account => {
      if (account.name == organisationName) {
        this.assessment.industry = account.industry
      }
    })

  }
}
