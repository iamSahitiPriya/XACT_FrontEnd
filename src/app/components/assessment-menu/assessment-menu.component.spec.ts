/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  flush,
  flushMicrotasks,
  TestBed,
  tick
} from '@angular/core/testing';

import {AssessmentMenuComponent} from './assessment-menu.component';
import {MatMenuModule} from "@angular/material/menu";
import {AppServiceService} from "../../services/app-service/app-service.service";
import {MatIconModule} from "@angular/material/icon";
import {of} from "rxjs";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {RouterTestingModule} from "@angular/router/testing";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatTableModule} from "@angular/material/table";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatButtonModule} from "@angular/material/button";
import {MatRippleModule} from "@angular/material/core";
import {StoreModule} from "@ngrx/store";
import {reducers} from "../../reducers/reducers";
import {AssessmentStructure} from "../../types/assessmentStructure";
import {PopupConfirmationComponent} from "../popup-confirmation/popup-confirmation.component";
import {MatTooltipModule} from "@angular/material/tooltip";

class MockDialog {
  open() {
    return {
      afterClosed: () => of(true),
      componentInstance: jest.fn()
    }
  }

  closeAll() {
  }

  addUser() {
  }
}

describe('AssessmentMenuComponent', () => {
  let dialog: any;
  let matDialog: any

  let component: AssessmentMenuComponent;
  let fixture: ComponentFixture<AssessmentMenuComponent>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [AssessmentMenuComponent, PopupConfirmationComponent],
      imports: [MatDialogModule, RouterTestingModule, MatFormFieldModule, MatIconModule, MatInputModule,
        MatTableModule, HttpClientTestingModule, NoopAnimationsModule, RouterModule,
        ReactiveFormsModule, MatSnackBarModule, FormsModule, MatButtonModule, MatRippleModule, MatMenuModule, MatTooltipModule,
        StoreModule.forRoot(reducers)],
      providers: [
        {provide: MatDialog, useClass: MockDialog}
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentMenuComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
    matDialog = fixture.debugElement.injector.get(MatDialog)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should open dialog box', () => {
    jest.spyOn(matDialog, 'open')
    component.openAssessment("")
    fixture.detectChanges()
    expect(matDialog.open).toHaveBeenCalled()
  });
  it('should close the popup', () => {
    jest.spyOn(matDialog, 'closeAll')
    component.closePopUp()
    fixture.detectChanges()
    expect(matDialog.closeAll).toHaveBeenCalled()
  });

});






