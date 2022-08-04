/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';
import {OKTA_AUTH} from '@okta/okta-angular';
import {HeaderComponent} from './header.component';
import {MatMenuModule} from '@angular/material/menu';
import {SearchComponent} from "../search-component/search.component";
import {CreateAssessmentsComponent} from "../assessment-create/create-assessments.component";
import {RouterTestingModule} from "@angular/router/testing";
import {RouterModule} from "@angular/router";
import oktaAuth from "@okta/okta-auth-js";


describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  const oktaAuth = require('@okta/okta-auth-js');

  beforeEach(async () => {
    jest.mock('@okta/okta-auth-js');
    oktaAuth.getUser = jest.fn(() => Promise.resolve({name: 'dummyUserWithMoreThen10'}));
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent,SearchComponent,CreateAssessmentsComponent],

      imports: [MatMenuModule,RouterTestingModule,RouterModule],
      providers: [
        {provide: OKTA_AUTH, useValue: oktaAuth},

      ]
    })
      .compileComponents();
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have logo in header', () => {
    expect(fixture.nativeElement.querySelector('#logo').getAttribute("src")).toBe("../../assets/logo.png");
  });

  it('should pass user name to html', () => {
    expect(component.username).toBe('dummyUserWithMoreThen10');
  });
  it('should trim the username if the length exceeds 10', () => {
    expect(component.username.length).toBeGreaterThan(10)
    expect(component.trimmedUsername).toBe("dummyUserWi")
  });

});


