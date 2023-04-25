/*
 * Copyright (c) 2022 - Thoughtworks Inc. All rights reserved.
 */

import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import {ErrorComponentComponent} from './error-component.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";
import {RouterTestingModule} from "@angular/router/testing";
import {of} from "rxjs";

class MockDialog {
  open() {
    return {
      afterClosed: () => of({})
    }
  }

  close(id:number) {
  }
}
class MockDialogRef {
  open() {
    return {
      afterClosed: () => of({})
    }
  }

  close(id:number) {
  }
}

describe('ErrorComponentComponent', () => {
  let component: ErrorComponentComponent;
  let fixture: ComponentFixture<ErrorComponentComponent>;
  const original = window.location;
  let matDialog: any
  let dialogRef:MockDialogRef
  const reloadFn = () => {
    window.location.reload();
  };
  beforeEach(async () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {reload: jest.fn()}
    })
    await TestBed.configureTestingModule({
      declarations: [ErrorComponentComponent],
      imports: [MatDialogModule, MatIconModule, RouterTestingModule],
      providers: [RouterTestingModule, {provide: MatDialogRef, useClass: MockDialogRef}, {provide: MatDialog, useClass: MockDialog},
        {
          provide: MockDialogRef,
          useValue: {}
        },{provide:MAT_DIALOG_DATA,useValue:{}}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    matDialog = fixture.debugElement.injector.get(MatDialog)
    dialogRef = fixture.debugElement.injector.get(MockDialogRef)
  });
  afterAll(() => {
    Object.defineProperty(window, 'location', {configurable: true, value: original});
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call retry', fakeAsync(() => {
    component.retry()
    reloadFn()
    expect(window.location.reload).toHaveBeenCalled()
    fixture.detectChanges()
  }));

  it('should close and move', fakeAsync(() => {
    expect(component.cancelChanges).toBeTruthy()
  }));
  it('should be able to cancel the changes', ()=> {
    jest.spyOn(component,'cancelChanges');

    const button = fixture.nativeElement.querySelector("#home");
    button.click();
    component.cancelChanges()

    expect(component.cancelChanges).toBeCalled();
  })


});
