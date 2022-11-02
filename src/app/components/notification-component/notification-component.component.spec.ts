import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NotificationSnackbarComponent} from './notification-component.component';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from "@angular/material/snack-bar";
import {of} from "rxjs";
import {MatIconModule} from "@angular/material/icon";


describe('NotificationComponentComponent', () => {
  let component: NotificationSnackbarComponent;
  let fixture: ComponentFixture<NotificationSnackbarComponent>;

  class MatSnackBarStub {
    open() {
      return {
        onClose: () => of({})
      }
    }

    dismiss() {

    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationSnackbarComponent],
      imports: [MatIconModule],
      providers: [
        {provide: MatSnackBarRef, useClass: MatSnackBarStub},
        {provide: MAT_SNACK_BAR_DATA, useValue: {}},
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const notificationData = " My notification ";
    component.data.message = notificationData;
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelector(".textMessage").innerHTML).toBe(notificationData);
  });
});
