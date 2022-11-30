/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminReferenceComponent} from './admin-reference.component';
import {HttpClientModule} from "@angular/common/http";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../../reducers/reducers";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {AppServiceService} from "../../../services/app-service/app-service.service";


class MockAppService {

}


describe('AdminReferenceComponent', () => {
  let component: AdminReferenceComponent;
  let fixture: ComponentFixture<AdminReferenceComponent>;
  let mockAppService : MockAppService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminReferenceComponent ],
      imports : [MatSnackBarModule,HttpClientModule, MatDialogModule,StoreModule.forRoot(reducers)],
      providers: [
        {provide: AppServiceService, useClass: MockAppService}]
    })
    .compileComponents();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminReferenceComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();

  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});
