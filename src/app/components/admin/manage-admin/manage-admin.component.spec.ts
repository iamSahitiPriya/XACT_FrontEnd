/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ManageAdminComponent} from './manage-admin.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {AppServiceService} from "../../../services/app-service/app-service.service";
import {UntypedFormBuilder} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../../reducers/reducers";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {of, throwError} from "rxjs";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {AccessControlRoleRequest} from "../../../types/AccessControlRoleRequest";
import {UserInfo} from "../../../types/UserInfo";
import {AccessControlRole} from "../../../types/AccessControlRole";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatIconModule} from "@angular/material/icon";
import {MatChipsModule} from "@angular/material/chips";
import {BrowserModule} from "@angular/platform-browser";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";

class MockDialog {
  open() {
    return {
      afterClosed: () => of(1),
      componentInstance: jest.fn()
    }
  }

  closeAll() {
  }
}
class MockAppService {
  userInfo: UserInfo[] = [{
    email: "def@thoughtworks.com",
    family_name: "ABC",
    given_name: "DEF",
    locale: "US"
  }, {
    email: "twq@thoughtworks.com",
    family_name: "Thoughtworks",
    given_name: "DEF",
    locale: "US"
  }]
  acr: AccessControlRole[] = [{
    email: "abc@thoughtworks.com",
    username: "ABC DEF",
    accessControlRoles: "PRIMARY_ADMIN"
  },
    {
      email: "def@thoughtworks.com",
      username: "ABC DEF",
      accessControlRoles: "PRIMARY_ADMIN"
    }]

  getLoggedInUserInfo() {
    return of(this.userInfo);
  }

  getAccessControlRoles() {
    return of(this.acr);
  }

  saveRole(user: AccessControlRoleRequest) {
    if (user.email === "twq@thoughtworks.com" || user.email === "def@thoughtworks.com") {
      return of(user);
    } else {
      return throwError("Error!")
    }
  }

  deleteRole(user: AccessControlRole) {
    if (user.email === "abc@thoughtworks.com") {
      return of(user);
    } else {
      return throwError("Error!")
    }
  }

}

describe('ManageAdminComponent', () => {
  let component: ManageAdminComponent;
  let fixture: ComponentFixture<ManageAdminComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageAdminComponent],
      imports: [HttpClientTestingModule, MatFormFieldModule, MatInputModule, StoreModule.forRoot(reducers), MatAutocompleteModule, BrowserAnimationsModule, NoopAnimationsModule, MatPaginatorModule
        , MatTableModule, MatSnackBarModule, MatTooltipModule, MatIconModule, MatChipsModule, BrowserModule],
      providers: [{provide: AppServiceService, useClass: MockAppService}, {provide: MatDialog, useClass: MockDialog},
        UntypedFormBuilder],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ManageAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges()
    component.loggedInUser = of({
      email: "abc@thoughtworks.com"
    })
    component.users = [{
      email: "def@thoughtworks.com",
      family_name: "ABC",
      given_name: "DEF",
      locale: "US"
    }]
  });

  it('should create', () => {
    component.ngOnInit()
    expect(component).toBeTruthy();
  });

  it('should save user along with their role', () => {
    component.ngOnInit();
    let email = "twq@thoughtworks.com"
    let role = "PRIMARY_ADMIN"
    component.users = [{email:"twq@thoughtworks.com",locale:"en",given_name:"name",family_name:"name"}]

    component.addUserFormGroup.clearValidators()
    component.userControl.clearValidators()
    component.saveRole(email, role);

    expect(component.accessControlRole.length).toBe(3);
  });

  it("should remove user from their respective role", () => {
    component.ngOnInit()
    let user: AccessControlRole = {
      accessControlRoles: "PRIMARY_ADMIN", email: "abc@thoughtworks.com", username: "ABC DEF"
    }
    component.deleteUser(user)

    expect(component.accessControlRole.length).toBe(1);
  });

  it("should handle when the user email is not found", () => {
    component.ngOnInit()

    let email = "123@thoughtworks.com"
    component.userControl.setValue(email)
    component.addUserFormGroup.controls["userEmailRoleValidator"].setValue(email)

    expect(component.users[0].family_name).toBe("User Not found")
  });

  it("should handle error when trying to delete a user", () => {
    component.ngOnInit();
    jest.spyOn(component, 'showError')
    let user: AccessControlRole = {
      accessControlRoles: "PRIMARY_ADMIN", email: "123@thoughtworks.com", username: "ABC DEF"
    }
    component.deleteUser(user)

    expect(component.showError).toHaveBeenCalled()
  });

  it("should handle error when trying to save user", () => {
    component.ngOnInit();
    jest.spyOn(component, 'showError')
    let email = "345@thoughtworks.com"
    let role = "PRIMARY_ADMIN"
    component.users = [{email:"345@thoughtworks.com",locale:"en",given_name:"name",family_name:"name"}]
    component.saveRole(email, role)
    expect(component.showError).toHaveBeenCalled()

  });

  it("should throw error when user tries to add already present email", () => {
    component.ngOnInit()

    let email = "abc@thoughtworks.com"
    component.userControl.setValue(email)
    component.addUserFormGroup.controls["userEmailRoleValidator"].setValue(email)

    expect(component.addUserFormGroup.controls['userEmailRoleValidator'].hasError('invalidAutocompleteString')).toBeTruthy()
  });

  it("should throw error when user tries to add again", () => {
    component.ngOnInit()
    let email = "def@thoughtworks.com"
    let role = "PRIMARY_ADMIN"
    component.onInputChange()

    component.saveRole(email, role)

    expect(component.addUserFormGroup.controls['userEmailRoleValidator'].hasError('roleAlreadyPresent')).toBeTruthy()
  });

  it("should throw invalid auto complete error", () => {
    component.ngOnInit()
    component.users = [{
      email: "def@thoughtworks.com",
      family_name: "ABC",
      given_name: "DEF",
      locale: "US"
    }]
    let email = "def@thoughtworks.com"
    component.userControl.setValue(email)
    component.addUserFormGroup.controls["userEmailRoleValidator"].setValue(email)

  });
});
