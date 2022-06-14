import {ComponentFixture, fakeAsync, flush, TestBed, tick} from '@angular/core/testing';

import {ErrorComponentComponent} from './error-component.component';
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";
import {RouterTestingModule} from "@angular/router/testing";

describe('ErrorComponentComponent', () => {
  let component: ErrorComponentComponent;
  let fixture: ComponentFixture<ErrorComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorComponentComponent],
      imports: [MatDialogModule, MatIconModule, RouterTestingModule],
      providers: [RouterTestingModule, {provide: MatDialogRef, useValue: {}}]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call retry', fakeAsync(() => {
    jest.spyOn(component, 'retry');
    fixture.detectChanges();
    let retry = fixture.debugElement.nativeElement.querySelector("#retry");
    retry.click();
    tick();
    expect(component.retry).toHaveBeenCalled();
    flush()
  }));

  it('should close and move', fakeAsync(() => {
    jest.spyOn(component, 'cancelChanges');
    fixture.detectChanges();
    let home = fixture.debugElement.nativeElement.querySelector("#home");
    home.click();
    tick();
    expect(component.cancelChanges).toHaveBeenCalled();
    flush()
  }));


});
