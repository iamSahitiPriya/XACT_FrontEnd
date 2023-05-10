/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {Component, OnInit} from '@angular/core';
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {UserInfo} from "../../../types/UserInfo";
import {Observable, startWith, Subject, takeUntil} from "rxjs";
import {FormControl} from "@angular/forms";
import {map} from "rxjs/operators";
import {AccessControlRole} from "../../../types/AccessControlRole";
import {MatTableDataSource} from "@angular/material/table";

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
  accessControlRole:AccessControlRole[];
  dataSource:MatTableDataSource<AccessControlRole>
  private destroy$: Subject<void> = new Subject<void>();
  displayedColumns: string[] = ['name', 'role', 'action'];


  constructor(private appService: AppServiceService) {
    this.dataSource = new MatTableDataSource<AccessControlRole>(this.accessControlRole);
  }

  ngOnInit(): void {
    this.appService.getLoggedInUserInfo().subscribe(data => {
      this.initialState = data
      this.filterUser();
    })
    this.appService.getAccessControlRoles().subscribe(data =>{
      this.accessControlRole = data;
      this.dataSource = new MatTableDataSource(this.accessControlRole)
    })
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

  saveRole(email: string, role:string) {
    let roleRequest:AccessControlRole = {
      email:email,
      accessControlRoles:role
    }
    this.appService.saveRole(roleRequest).pipe(takeUntil(this.destroy$)).subscribe(
      (_data)=>{
        this.accessControlRole.push(roleRequest)
        this.dataSource.data = this.accessControlRole
    })

  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
