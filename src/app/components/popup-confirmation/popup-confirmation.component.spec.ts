import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PopupConfirmationComponent} from './popup-confirmation.component';
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";

describe('PopupConfirmationComponent', () => {
  let component: PopupConfirmationComponent;
  let fixture: ComponentFixture<PopupConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupConfirmationComponent ],
      imports:[MatDialogModule,MatIconModule],
      providers:[{
        provide:MatDialogRef,useValue:{}
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
    expect(component.cancelChanges).toBeTruthy()
  });
});
