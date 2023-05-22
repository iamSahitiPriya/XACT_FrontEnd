/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {OKTA_AUTH, OKTA_CONFIG, OktaAuthStateService} from '@okta/okta-angular';
import {RouterTestingModule} from '@angular/router/testing';
import {AppServiceService} from '../../services/app-service/app-service.service';
import {AppComponent} from './app.component';
import {SearchComponent} from "../search-component/search.component";
import {CreateAssessmentsComponent} from "../assessment-create/create-assessments.component";
import {RouterModule} from "@angular/router";
import {NgHttpLoaderComponent} from "ng-http-loader";
import {MatDialogModule} from "@angular/material/dialog";
import {Idle, InterruptSource} from "@ng-idle/core";
import {Interrupt} from "@ng-idle/core/lib/interrupt";
import {EventEmitter} from "@angular/core";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../reducers/reducers";
import {of} from "rxjs";


describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let service: AppServiceService;

  class MockAppService {
    getUserRole() {
      return of("admin")
    }
  }

  class MockIdle {

    public setIdle(seconds: number): number {
      return seconds;
    }

    public setTimeout(seconds: number): number {
      return seconds;
    }

    public setInterrupts(sources: Array<InterruptSource>): Array<Interrupt> {
      return new Array<Interrupt>();
    }

    public onIdleStart:EventEmitter<any> = {
      // @ts-ignore
      subscribe() {
        return {};
      }
    }
    public onIdleEnd:EventEmitter<any> = {
      // @ts-ignore
      subscribe() {
        return {};
      }
    }
    public onTimeout:EventEmitter<any> = {
      // @ts-ignore
      subscribe() {
        return {};
      }
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        SearchComponent,
        CreateAssessmentsComponent,
        NgHttpLoaderComponent,

      ],
      imports: [
        HttpClientModule,
        RouterTestingModule,
        RouterModule,
        MatDialogModule,
        MatSnackBarModule,
        StoreModule.forRoot(reducers),
      ],
      providers: [
        AppServiceService,
        RouterTestingModule,
        {provide: OKTA_CONFIG, useValue: 23},
        {provide: OKTA_AUTH, useValue: 23},
        {provide: OktaAuthStateService, useValue: 23},
        {provide: Idle, useClass: MockIdle},
        {provide: AppServiceService, useClass: MockAppService},
      ]
    }).compileComponents();
  });


  beforeEach(() => {
    service = TestBed.inject(AppServiceService);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

})


