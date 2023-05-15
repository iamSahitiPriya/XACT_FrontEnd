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
import {MatTableDataSource} from "@angular/material/table";
import {data_local} from "../../../messages";
import {Store} from "@ngrx/store";
import {AppStates, User} from "../../../reducers/app.states";
import {AccessControlRoleRequest} from "../../../types/AccessControlRoleRequest";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";

interface UserRole {
  role: string,
  value: string
}

interface RoleSchema {
  role:string,
  displayText:string,
  color:string
}

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
  roleSchema = new Map()
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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
  role: UserRole[] = [{
    role: 'Primary', value: 'PRIMARY_ADMIN'
  }, {
    role: 'Secondary', value: 'SECONDARY_ADMIN'
  }];
  isAdminPrimary: boolean = false;
  private accessControlRoleDataSource: AccessControlRole[];


  constructor(private appService: AppServiceService, private formBuilder: UntypedFormBuilder, private store: Store<AppStates>) {
    this.dataSource = new MatTableDataSource<AccessControlRole>(this.accessControlRoleDataSource);
    this.loggedInUser = this.store.select(storeMap => storeMap.loggedInUserEmail)
    this.roleSchema.set('PRIMARY_ADMIN',{displayText:'Primary Admin',color:'#3f51b5'})
    this.roleSchema.set('SECONDARY_ADMIN',{displayText:'Secondary Admin', color:'green'})


  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
      this.filterLoggedInUser()
    })
  }

  get form(): { [key: string]: AbstractControl } {
    return this.addUserFormGroup.controls;
  }

  private _filterUser(value: string): UserInfo[] {
    const filterValue = value.toLowerCase();
    let dummy: UserInfo = {
      email: '',
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
        username:email,
        email: email,
        accessControlRoles: role
      }
      let roleData:AccessControlRoleRequest = {
        email: email,
        accessControlRoles: role
      }
      let filteredData = this.accessControlRole.filter(eachData => eachData.email === roleRequest.email)
      if (filteredData.length === 0) {
        this.appService.saveRole(roleData).pipe(takeUntil(this.destroy$)).subscribe(
          (_data) => {
            this.accessControlRole.unshift(roleRequest)
            this.dataSource.data = this.accessControlRole
            this.userEmail = ""
          })
      } else {
        this.addUserFormGroup.controls['userEmailRoleValidator'].setValidators(this.validateUserEmailRole(roleRequest))

      }
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
      return flag ? null : {'invalidAutocompleteString': {value: control.value}}
    }
  }
  private validateUserEmailRole(roleRequest: AccessControlRole) {
    let flag = false;
    let filteredData = this.accessControlRole.filter(eachData => eachData.email === roleRequest.email)
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (filteredData.length === 0) {
        flag = true
      }
      return flag ? null : {'alreadyPresent': {value: control.value}}
    }
  }

  deleteUser(user:AccessControlRole) {
    let request:AccessControlRoleRequest = {
      email:user.email,
      accessControlRoles:user.accessControlRoles
    }
    this.appService.deleteRole(request).pipe(takeUntil(this.destroy$)).subscribe(_data =>{
      let index = this.accessControlRole.findIndex(eachUser => eachUser.email === request.email)
      if(index !== -1){
        this.accessControlRoleDataSource.splice(index,1)
      }
      this.dataSource.data = this.accessControlRoleDataSource
    })
  }

  private filterLoggedInUser() {
    this.loggedInUser.subscribe(user =>{
      this.accessControlRoleDataSource = this.accessControlRole.filter(eachUser => eachUser.email !== user.email)
      this.dataSource = new MatTableDataSource(this.accessControlRoleDataSource)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }
}
