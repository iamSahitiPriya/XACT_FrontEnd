/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, OnInit, ViewChild} from '@angular/core';
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {UserInfo} from "../../../types/UserInfo";
import {Observable, startWith, Subject, takeUntil} from "rxjs";
import {AbstractControl, FormControl, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {map} from "rxjs/operators";
import {AccessControlRole} from "../../../types/AccessControlRole";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {data_local} from "../../../messages";
import {Store} from "@ngrx/store";
import {AppStates, User} from "../../../reducers/app.states";
import {AccessControlRoleRequest} from "../../../types/AccessControlRoleRequest";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {cloneDeep} from "lodash";
import {NotificationSnackbarComponent} from "../../notification-component/notification-component.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {PopupConfirmationComponent} from "../../popup-confirmation/popup-confirmation.component";
import {MatDialog} from "@angular/material/dialog";

interface UserRole {
  role: string,
  value: string
}

const NOTIFICATION_DURATION = 2000;

@Component({
  selector: 'app-manage-admin',
  templateUrl: './manage-admin.component.html',
  styleUrls: ['./manage-admin.component.css']
})
export class ManageAdminComponent implements OnInit {
  filteredUsers: Observable<UserInfo[]>;
  initialState: UserInfo[];
  userControl = new FormControl();
  users: UserInfo[];
  accessControlRole: AccessControlRole[];
  dataSource: MatTableDataSource<AccessControlRole>
  private destroy$: Subject<void> = new Subject<void>();
  loggedInUser: Observable<User>
  mandatoryFieldText = data_local.ASSESSMENT.MANDATORY_FIELD_TEXT;
  invalidAutocompleteValidation = data_local.ADMIN.MANAGE_ADMIN.INVALID_AUTOCOMPLETE_VALIDATION;
  invalidAutocompleteValidationMessage = data_local.ADMIN.MANAGE_ADMIN.INVALID_AUTOCOMPLETE_VALIDATION_MESSAGE;
  requireValidation = data_local.ADMIN.MANAGE_ADMIN.REQUIRED_FIELD_VALIDATION;
  roleAlreadyPresentValidation = data_local.ADMIN.MANAGE_ADMIN.ROLE_ALREADY_PRESENT_VALIDATION;
  roleAlreadyPresentValidationMessage = data_local.ADMIN.MANAGE_ADMIN.MESSAGE.ROLE_ALREADY_PRESENT;
  serverErrorMessage = data_local.ADMIN.SERVER_ERROR_MESSAGE
  primaryAdminRole = data_local.ADMIN.ROLE.PRIMARY.ROLE_VALUE;
  primaryAdminDisplayValue = data_local.ADMIN.ROLE.PRIMARY.DISPLAY_VALUE;
  primaryAdminDisplayText = data_local.ADMIN.ROLE.PRIMARY.DISPLAY_TEXT;
  secondaryAdminRole = data_local.ADMIN.ROLE.SECONDARY.ROLE_VALUE;
  secondaryAdminDisplayValue = data_local.ADMIN.ROLE.SECONDARY.DISPLAY_VALUE;
  secondaryAdminDisplayText = data_local.ADMIN.ROLE.SECONDARY.DISPLAY_TEXT;
  primaryAdminDisplayColor = '#3f51b5';
  private confirmationTitle: string = data_local.CONTRIBUTOR.CONFIRMATION_POPUP_TEXT;
  userEmailValidatorCriteriaText: string = data_local.ADMIN.MANAGE_ADMIN.CRITERIA_TEXT;
  roleHeader: string = "Role";
  addUserDisplayText: string = "Add";
  nameHeader: string = "Name";
  action = data_local.ADMIN.ACTION
  roleSchema = new Map()
  secondaryAdminDisplayColor = 'green';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<AccessControlRole>

  displayedColumns: string[] = ['name', 'role', 'action'];
  addUserFormGroup: UntypedFormGroup;
  public userEmailRoleValidator = {
    'userFormControl': [
      {type: this.invalidAutocompleteValidation, message: this.invalidAutocompleteValidationMessage},
      {type: this.requireValidation, message: this.mandatoryFieldText},
      {type: this.roleAlreadyPresentValidation, message: this.roleAlreadyPresentValidationMessage}
    ]
  }
  userEmail: string;
  role: UserRole[] = [{
    role: this.secondaryAdminRole, value: this.secondaryAdminDisplayValue
  }, {
    role: this.primaryAdminRole, value: this.primaryAdminDisplayValue
  }

  ];
  isAdminPrimary: boolean = false;
  private accessControlRoleDataSource: AccessControlRole[];
  loggedInUserEmail: string;
  private dataSuccessMessage: string = data_local.ADMIN.UPDATE_SUCCESSFUL_MESSAGE;


  constructor(private dialog: MatDialog, private appService: AppServiceService, private formBuilder: UntypedFormBuilder, private store: Store<AppStates>, private _snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource<AccessControlRole>();
    this.loggedInUser = this.store.select(storeMap => storeMap.loggedInUserEmail)
    this.roleSchema.set(this.primaryAdminDisplayValue, {
      displayText: this.primaryAdminDisplayText,
      color: this.primaryAdminDisplayColor
    })
    this.roleSchema.set(this.secondaryAdminDisplayValue, {
      displayText: this.secondaryAdminDisplayText,
      color: this.secondaryAdminDisplayColor
    })


  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.addUserFormGroup = this.formBuilder.group(
      {
        userEmailRoleValidator: ['', Validators.required],
        roleValidator: ['SECONDARY_ADMIN', Validators.required]
      }
    )
    this.appService.getLoggedInUserInfo().subscribe(data => {
      this.initialState = data
      this.filterUser();
    })
    this.appService.getAccessControlRoles().subscribe(data => {
      this.accessControlRole = data;
      this.filterLoggedInUser()
    })
  }

  get form(): { [key: string]: AbstractControl } {
    return this.addUserFormGroup.controls;
  }

  onInputChange() {
    this.filterUser()
  }

  saveRole(email: string, role: string) {
    let user = this.users.find(eachUser => eachUser.email === email);
    let roleRequest: AccessControlRole = {
      username: user?.given_name + ' ' + user?.family_name || '',
      email: email,
      accessControlRoles: role
    }
    let roleData: AccessControlRoleRequest = {
      email: email,
      accessControlRoles: role
    }
    let filteredData = this.accessControlRole.filter(eachData => eachData.email === roleRequest.email)
    if (filteredData.length === 0) {
      this.appService.saveRole(roleData).pipe(takeUntil(this.destroy$)).subscribe({
        next: (_data) => {
          this.accessControlRole.unshift(roleRequest)
          this.filterLoggedInUser()
          this.userEmail = ""
          this.showNotification(this.dataSuccessMessage, NOTIFICATION_DURATION)
        },
        error: (_err) => {
          this.showError(this.serverErrorMessage);
        }

      })
    } else {
      this.addUserFormGroup.controls['userEmailRoleValidator'].setErrors({roleAlreadyPresent: true})

    }
  }

  deleteUser(user: AccessControlRole) {
    const openConfirm = this.dialog.open(PopupConfirmationComponent, {
      width: '448px',
      height: '203px'
    });
    openConfirm.componentInstance.text = this.confirmationTitle
    openConfirm.afterClosed().subscribe(result => {
      if (result === 1) {
        let request: AccessControlRoleRequest = {
          email: user.email,
          accessControlRoles: user.accessControlRoles
        }
        this.appService.deleteRole(request).pipe(takeUntil(this.destroy$)).subscribe({
          next: _data => {
            let index = this.accessControlRole.findIndex(eachUser => eachUser.email === request.email)
            if (index !== -1) {
              this.accessControlRole.splice(index, 1)
            }
            this.filterLoggedInUser()
            this.showNotification(this.dataSuccessMessage, NOTIFICATION_DURATION)
          },
          error: () => {
            this.showError(this.serverErrorMessage);
          }
        })
      }
    })

  }
  private showNotification(message: string, duration: number) {
    this._snackBar.openFromComponent(NotificationSnackbarComponent, {
      data: {message: message, iconType: "done", notificationType: "Success:"}, panelClass: ['success'],
      duration: duration,
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  showError(message: string) {
    this._snackBar.openFromComponent(NotificationSnackbarComponent, {
      data: {message: message, iconType: "error_outline", notificationType: "Error:"}, panelClass: ['error-snackBar'],
      duration: NOTIFICATION_DURATION,
      verticalPosition: "top",
      horizontalPosition: "center"
    })
  }

  private filterUser() {
    this.addUserFormGroup.controls['userEmailRoleValidator'].setValidators(this.autoCompleteValidator(this.users))
    this.filteredUsers = this.userControl.valueChanges.pipe(
      startWith(''),
      map((_state: string) => {
        return this._filterUser(this.userControl.value || "")
      })
    )
  }


  private autoCompleteValidator(users: UserInfo[]) {
    let flag: boolean = false
    return (control: AbstractControl): { [key: string]: any } | null => {
      users.forEach(eachUser => {
        if (eachUser.email == control.value) {
          flag = true
        }
      })
      return flag ? null : {'invalidAutocompleteString': {value: control.value}}
    }
  }

  private filterLoggedInUser() {
    this.loggedInUser.subscribe(data => {
      this.loggedInUserEmail = data.email
      this.accessControlRoleDataSource = cloneDeep(this.accessControlRole);
      this.dataSource = new MatTableDataSource(this.accessControlRoleDataSource)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  private _filterUser(value: string): UserInfo[] {
    const filterValue = value.toLowerCase();
    let dummy: UserInfo = {
      email: '',
      family_name: this.invalidAutocompleteValidationMessage,
      given_name: '',
      locale: ''
    }
    this.users = []
    if (filterValue.length > 2) {
      this.users = this.initialState.filter(state => state.email.toLowerCase().includes(filterValue));
      if (this.users.length === 0) {
        this.users.push(dummy)
      }
    }
    return this.users
  }
}
