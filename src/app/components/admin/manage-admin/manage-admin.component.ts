/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, OnInit} from '@angular/core';
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {UserInfo} from "../../../types/UserInfo";
import {Observable, startWith, Subject, takeUntil} from "rxjs";
import {AbstractControl, FormControl, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {map} from "rxjs/operators";
import {AccessControlRole} from "../../../types/AccessControlRole";
import {MatTableDataSource} from "@angular/material/table";
import {data_local} from "../../../messages";

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
  mandatoryFieldText = data_local.ASSESSMENT.MANDATORY_FIELD_TEXT;

  displayedColumns: string[] = ['name', 'role', 'action'];
  addUserFormGroup: UntypedFormGroup;
  public userEmailRoleValidator = {
    'userFormControl': [
      {type: 'invalidAutocompleteString', message: "Not found"},
      {type: 'required', message: this.mandatoryFieldText},
      {type: 'alreadyPresent', message: 'Already present'}
    ]
  }
  userEmail: string;


  constructor(private appService: AppServiceService, private formBuilder: UntypedFormBuilder) {
    this.dataSource = new MatTableDataSource<AccessControlRole>(this.accessControlRole);
  }

  ngOnInit(): void {
    this.addUserFormGroup = this.formBuilder.group(
      {
        userEmailRoleValidator: ['', Validators.required]
      }
    )
    this.appService.getLoggedInUserInfo().subscribe(data => {
      this.initialState = data
      this.filterUser();
    })
    this.appService.getAccessControlRoles().subscribe(data => {
      this.accessControlRole = data;
      this.dataSource = new MatTableDataSource(this.accessControlRole)
    })
  }

  get form(): { [key: string]: AbstractControl } {
    return this.addUserFormGroup.controls;
  }

  private _filterUser(value: string): UserInfo[] {
    const filterValue = value.toLowerCase();
    let dummy: UserInfo = {
      email: 'abc',
      family_name: 'Not Found',
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

  private filterUser() {
    this.addUserFormGroup.controls['userEmailRoleValidator'].setValidators(this.autoCompleteValidator(this.users))
    this.filteredUsers = this.userControl.valueChanges.pipe(
      startWith(''),
      map((_state: string) => {
        return this._filterUser(this.userControl.value || "")
      })
    )
  }

  onInputChange() {
    this.filterUser()
  }

  saveRole(email: string, role: string) {
    if (this.addUserFormGroup.valid) {
      let roleRequest: AccessControlRole = {
        email: email,
        accessControlRoles: role
      }
      let filteredData = this.dataSource.data.filter(eachData => eachData.email === roleRequest.email)
      if (filteredData.length === 0) {
        this.appService.saveRole(roleRequest).pipe(takeUntil(this.destroy$)).subscribe(
          (_data) => {
            this.accessControlRole.push(roleRequest)
            this.dataSource.data = this.accessControlRole
            this.userEmail = ""
          })
      }
      // }else{
      //   this.addUserFormGroup.controls['userEmailRoleValidator'].setValidators({'alreadyPresent':{value:{}}})
      //
      // }
    }

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private autoCompleteValidator(users: UserInfo[]) {
    let flag: boolean = false
    return (control: AbstractControl): { [key: string]: any } | null => {
      users.forEach(eachUser => {
        if (eachUser.email == control.value) {
          flag = true
        }
      })
      console.log(flag)
      return flag ? null : {'invalidAutocompleteString': {value: control.value}}
    }
  }
}
