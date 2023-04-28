/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PopupConfirmationComponent} from './popup-confirmation.component';
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";

describe('PopupConfirmationComponent', () => {
  let component: PopupConfirmationComponent;
  let fixture: ComponentFixture<PopupConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopupConfirmationComponent],
      imports: [MatDialogModule, MatIconModule,MatTooltipModule],
      providers: [{
        provide: MatDialogRef, useValue: {
          close: () => {
          }
        }
      }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should close dialog box', () => {
    jest.spyOn(component.dialogRef, 'close');
    component.cancelChanges(0);
    expect(component.dialogRef.close).toHaveBeenCalled();
  });


});
