/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminConsoleComponent} from './admin-console.component';
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from '@angular/material/form-field';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatRadioModule} from "@angular/material/radio";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../../reducers/reducers";
import {of} from "rxjs";


describe('AdminConsoleComponent', () => {
  let component: AdminConsoleComponent;
  let fixture: ComponentFixture<AdminConsoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminConsoleComponent ],
      imports:[MatFormFieldModule,NoopAnimationsModule, FormsModule, ReactiveFormsModule,CommonModule, BrowserModule, MatSnackBarModule, MatCardModule,MatTooltipModule, HttpClientTestingModule, MatRadioModule, MatIconModule,RouterTestingModule,StoreModule.forRoot(reducers)]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set event', () => {
    const dummy = "parameter"
    component.setEvent(dummy);
    expect(component.type).toBe(dummy);
  });
  it('should validate the user with role', () => {
    component.loggedInUserRole=of({
      roles:['PRIMARY_ADMIN']
    })
    component.validateUser()
    expect(component.isAdminPrimary).toBe(true)
  });
});
