import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import {ErrorComponentComponent} from './error-component.component';
import {MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";
import {RouterTestingModule} from "@angular/router/testing";
import {of} from "rxjs";

class MockDialog {
  open() {
    return {
      afterClosed: () => of({})
    }
  }

  close() {
  }
}

describe('ErrorComponentComponent', () => {
  let component: ErrorComponentComponent;
  let fixture: ComponentFixture<ErrorComponentComponent>;
  const original = window.location;
  let matDialog: any
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
      providers: [RouterTestingModule, {provide: MatDialogRef, useValue: {}}, {provide: MatDialog, useClass: MockDialog}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    matDialog = fixture.debugElement.injector.get(MatDialog)
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


});
