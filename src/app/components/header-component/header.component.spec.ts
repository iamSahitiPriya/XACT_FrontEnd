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
import {MatIconModule} from '@angular/material/icon';
import {of} from 'rxjs';
import {AppServiceService} from "../../services/app-service/app-service.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../reducers/reducers";


describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  const oktaAuth = require('@okta/okta-auth-js');

  beforeEach(async () => {
    jest.mock('@okta/okta-auth-js');
    oktaAuth.getUser = jest.fn(() => Promise.resolve({name: 'dummyUserWithMoreThen10'}));
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent, SearchComponent, CreateAssessmentsComponent],

      imports: [MatMenuModule, RouterTestingModule, RouterModule,MatIconModule,HttpClientTestingModule, StoreModule.forRoot(reducers)],
      providers: [
        AppServiceService,
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
    expect(fixture.nativeElement.querySelector('#logo').getAttribute("src")).toBe("../../assets/logo.svg");
  });

  it('should pass user name to html', () => {
    expect(component.username).toBe('dummyUserWithMoreThen10');
  });
  it('should enable admin-console when the user is Admin', () => {
    component.userRole = of(["Admin"]);
    expect(component.isAdmin).toBeFalsy();
    component.ngOnInit()
  });

  it("should be able to sign out", () => {
    jest.spyOn(component,'signOut');
    const button = fixture.nativeElement.querySelector("#signout");
    button.click();
    expect(component.signOut).toBeCalled();
  })

  it('should set isContributor to true', () => {
    component.userRole = of(["AUTHOR"])
    expect(component.isContributor).toBeFalsy()

    component.ngOnInit()
  });
});


