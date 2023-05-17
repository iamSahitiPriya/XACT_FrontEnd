/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminQuestionReferenceComponent} from './admin-question-reference.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {HttpClientModule} from "@angular/common/http";
import {MatDialogModule} from "@angular/material/dialog";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../../reducers/reducers";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {AppServiceService} from "../../../services/app-service/app-service.service";

class MockAppService {

}
describe('AdminQuestionReferenceComponent', () => {
  let component: AdminQuestionReferenceComponent;
  let fixture: ComponentFixture<AdminQuestionReferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminQuestionReferenceComponent ],
      imports : [MatSnackBarModule,HttpClientModule, MatDialogModule,StoreModule.forRoot(reducers),MatIconModule,MatTooltipModule,BrowserAnimationsModule,NoopAnimationsModule],
      providers: [
        {provide: AppServiceService, useClass: MockAppService}]

    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminQuestionReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
